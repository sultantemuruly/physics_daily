import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

import fs from "fs";
import path from "path";

import { PhysicsConcept } from "@/types/main";

export async function GET() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error: true,
        message:
          "OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable.",
      },
      { status: 400 }
    );
  }

  try {
    const filePaths = [
      path.join(process.cwd(), "data", "physics-1.pdf"),
      path.join(process.cwd(), "data", "physics-2.pdf"),
    ];

    const docs = [];
    for (const filePath of filePaths) {
      const loader = new PDFLoader(filePath);
      const loadedDocs = await loader.load();
      docs.push(...loadedDocs);
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    const cleanDocs = splitDocs.filter(
      (doc) => doc.pageContent && doc.pageContent.trim().length > 0
    );

    // Random chunk + neighbors
    const index = Math.floor(Math.random() * cleanDocs.length);
    const start = Math.max(0, index - 2);
    const end = Math.min(cleanDocs.length, index + 3);
    const contextGroup = cleanDocs.slice(start, end);
    const contextText = contextGroup.map((doc) => doc.pageContent).join("\n\n");

    // Prompt
    const initialPromptPath = path.join(process.cwd(), "prompt.txt");
    const systemPrompt = fs.readFileSync(initialPromptPath, "utf8");

    const finalPrompt = `
Below is an excerpt from a physics textbook. Based **only on this excerpt**, extract and explain a single physics concept that is clearly presented or referenced in it. Do not use general knowledge.

${contextText}

${systemPrompt}
`;

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.9,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const response = await model.call([
      {
        role: "system",
        content: "You are a helpful educational assistant.",
      },
      {
        role: "user",
        content: finalPrompt,
      },
    ]);

    const rawContent =
      typeof response.text === "string"
        ? response.text
        : JSON.stringify(response.text);

    // Parse result as JSON
    let parsed: PhysicsConcept;
    try {
      parsed = JSON.parse(rawContent ?? "");
    } catch (err) {
      console.error("Failed to parse GPT response as JSON:", response, err);
      return NextResponse.json(
        {
          error: true,
          message: "Invalid JSON response from OpenAI",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("LangChain API error:", error);
    return NextResponse.json(
      {
        message: "Error processing your request",
        error: true,
      },
      { status: 500 }
    );
  }
}
