import { createAdminClient } from "@/lib/supabase/admin";
import { replyMessage } from "@/lib/line/reply";
import type { WebhookEvent } from "@/lib/line/reply";
import { generateAiResponse } from "@/lib/ai/claude";
import {
  getEscalationUserMessage,
  notifyOwner,
  saveUnansweredQuestion,
} from "@/lib/ai/respond";

async function saveConversation(
  lineUserId: string,
  role: "user" | "assistant",
  message: string
): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("conversations").insert({
      line_user_id: lineUserId,
      role,
      message,
    });
  } catch (error) {
    console.error(`[Conversation] Failed to save ${role} message:`, error);
  }
}

export async function handleLineEvent(event: WebhookEvent): Promise<void> {
  if (
    event.type !== "message" ||
    !event.message ||
    event.message.type !== "text" ||
    !event.message.text
  ) {
    return;
  }

  const userId = event.source.userId;
  const userMessage = event.message.text;
  const replyToken = event.replyToken;

  if (!userId || !replyToken) {
    return;
  }

  await saveConversation(userId, "user", userMessage);
  console.log("[LINE] userId:", userId);

  let replyText: string;

  try {
    console.log("[AI] Generating response for:", userMessage);
    const aiResponse = await generateAiResponse(userMessage);

    console.log(
      `[AI] category=${aiResponse.category} confidence=${aiResponse.confidence} canAnswer=${aiResponse.canAnswer}`
    );

    if (aiResponse.canAnswer && aiResponse.answer) {
      replyText = aiResponse.answer;
    } else {
      replyText = getEscalationUserMessage();
      await saveUnansweredQuestion(userMessage, userId, aiResponse);
      await notifyOwner(userMessage, userId, aiResponse);
    }
  } catch (error) {
    console.error("[AI] Failed to generate response, escalating:", error);
    replyText = getEscalationUserMessage();
    await saveUnansweredQuestion(userMessage, userId, {
      category: "その他",
      answer: "",
      confidence: "low",
      canAnswer: false,
      reason: "AI API error",
    });
    await notifyOwner(userMessage, userId, {
      category: "その他",
      answer: "",
      confidence: "low",
      canAnswer: false,
      reason: "AI API error",
    });
  }

  try {
    await replyMessage(replyToken, replyText);
    console.log("[LINE] Reply sent");
    await saveConversation(userId, "assistant", replyText);
  } catch (error) {
    console.error("[LINE] Failed to reply:", error);
  }
}
