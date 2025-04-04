import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type PhysicsConcept = {
  title: string;
  description: string;
  formula: string;
  field: string;
  additionalInfo: string;
};

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

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates physics content.",
        },
        {
          role: "user",
          content: systemPrompt,
        },
      ],
    });

    const rawContent = completion.choices[0].message.content;

    // 🧠 Safely parse JSON from GPT
    let parsed: PhysicsConcept | null = null;

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
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { message: "Error processing your request" },
      { status: 500 }
    );
  }
}
