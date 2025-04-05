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
    const initialPromptPath = path.join(process.cwd(), "prompt.txt");
    const systemPrompt = fs.readFileSync(initialPromptPath, "utf8");

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.8,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const response = await model.invoke([
      {
        role: "system",
        content: "You are a helpful assistant that generates physics content.",
      },
      {
        role: "user",
        content: systemPrompt,
      },
    ]);

    const rawContent =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    let parsed: PhysicsConcept;

    try {
      parsed = JSON.parse(rawContent ?? "");
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
      { message: "Error processing your request" },
      { status: 500 }
    );
  }
}
