import Anthropic from "@anthropic-ai/sdk";
import type { AiResponse, ConfidenceLevel } from "./prompt";
import { CONFIDENCE_PROMPT } from "./prompt";
import { fetchBotContext, formatContextForPrompt } from "./context";

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "placeholder") {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  return new Anthropic({ apiKey });
}

function parseAiResponse(text: string): AiResponse {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as AiResponse;

  const confidence = ["high", "medium", "low"].includes(parsed.confidence)
    ? (parsed.confidence as ConfidenceLevel)
    : "low";

  const canAnswer =
    parsed.canAnswer === true && confidence !== "low";

  return {
    category: parsed.category ?? "その他",
    answer: parsed.answer ?? "",
    confidence,
    canAnswer,
    reason: parsed.reason,
  };
}

export async function generateAiResponse(
  userMessage: string
): Promise<AiResponse> {
  const context = await fetchBotContext();
  const contextText = formatContextForPrompt(context);
  const client = getClient();

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: CONFIDENCE_PROMPT,
    messages: [
      {
        role: "user",
        content: `${contextText}\n\n## お客様からの質問\n${userMessage}`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return parseAiResponse(textBlock.text);
}
