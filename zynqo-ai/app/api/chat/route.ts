import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
    });

    return NextResponse.json({
      reply: response.text ?? "I couldn't generate a response. Please try again.",
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    const details =
      error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: details },
      { status: 500 }
    );
  }
}