import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

import fs from "fs";
import path from "path";

import { PhysicsConcept } from "@/types/main";

export async function GET() {
  // validate API Key
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

    // split documents into manageable chunks for embedding
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    // embed chunks and store in in-memory vector store
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings()
    );

    const initialPromptPath = path.join(process.cwd(), "prompt.txt");
    const systemPrompt = fs.readFileSync(initialPromptPath, "utf8");

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.8,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // create a RAG chain using the retriever
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

    const responseFromChain = await chain.call({
      query: systemPrompt,
    });

    const rawContent =
      typeof responseFromChain.text === "string"
        ? responseFromChain.text
        : JSON.stringify(responseFromChain.text);

    // attempt to parse the LLM response as JSON
    let parsed: PhysicsConcept;
    try {
      parsed = JSON.parse(rawContent);
    } catch (err) {
      console.error("Failed to parse GPT response as JSON:", rawContent, err);
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
