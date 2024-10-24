import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { match } from "ts-pattern";

export const maxDuration = 30;

export async function POST(req: Request): Promise<Response> {
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "",
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
  });

  if (
    !process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY === ""
  ) {
    return new Response(
      "Missing OPENAI_API_KEY - make sure to add it to your .env file.",
      {
        status: 400,
      }
    );
  }

  const { prompt, option, command } = await req.json();

  const systemPrompt = match(option)
    .with(
      "continue",
      () =>
        "You are an AI writing assistant that continues existing text based on context from prior text. " +
        "Give more weight/priority to the later characters than the beginning ones. " +
        "Limit your response to no more than 200 characters, but make sure to construct complete sentences. " +
        "Use Markdown formatting when appropriate."
    )
    .with(
      "improve",
      () =>
        "You are an AI writing assistant that improves existing text. " +
        "Limit your response to no more than 200 characters, but make sure to construct complete sentences. " +
        "Use Markdown formatting when appropriate."
    )
    .with(
      "shorter",
      () =>
        "You are an AI writing assistant that shortens existing text. " +
        "Use Markdown formatting when appropriate."
    )
    .with(
      "longer",
      () =>
        "You are an AI writing assistant that lengthens existing text. " +
        "Use Markdown formatting when appropriate."
    )
    .with(
      "fix",
      () =>
        "You are an AI writing assistant that fixes grammar and spelling errors in existing text. " +
        "Limit your response to no more than 200 characters, but make sure to construct complete sentences. " +
        "Use Markdown formatting when appropriate."
    )
    .with(
      "zap",
      () =>
        "You are an AI writing assistant that generates text based on a prompt. " +
        "You take an input from the user and a command for manipulating the text. " +
        "Use Markdown formatting when appropriate."
    )
    .run();

  const userPrompt = match(option)
    .with("continue", () => prompt)
    .with(
      "improve",
      "shorter",
      "longer",
      "fix",
      () => `The existing text is: ${prompt}`
    )
    .with(
      "zap",
      () =>
        `For this text: ${prompt}. You have to respect the command: ${command}`
    )
    .run();

  // Combine system prompt and user prompt for Gemini
  const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}`;



  const result = await streamText({
    model: google("gemini-1.5-pro"),
    prompt: fullPrompt,
  });

  return result.toDataStreamResponse();
}
