import { createAdminClient } from "@/lib/supabase/admin";
import { pushMessage } from "@/lib/line/reply";
import type { AiResponse } from "./prompt";

const ESCALATION_USER_MESSAGE =
  "ご質問ありがとうございます。確認が必要な内容のため、スタッフが確認のうえ後ほどご返信いたします。少々お待ちください。";

export async function saveUnansweredQuestion(
  question: string,
  lineUserId: string,
  aiResponse: AiResponse
): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("unanswered_questions").insert({
      question,
      line_user_id: lineUserId,
      category: aiResponse.category,
      confidence: aiResponse.confidence,
      status: "pending",
    });
  } catch (error) {
    console.error("[Escalation] Failed to save unanswered question:", error);
  }
}

export async function notifyOwner(
  question: string,
  lineUserId: string,
  aiResponse: AiResponse
): Promise<void> {
  const ownerUserId = process.env.LINE_OWNER_USER_ID;
  if (!ownerUserId || ownerUserId === "U1234567890") {
    console.warn("[Escalation] LINE_OWNER_USER_ID is not configured, skipping notification");
    return;
  }

  const text = [
    "【要対応】AIが回答できない質問がありました",
    "",
    `質問: ${question}`,
    `カテゴリ: ${aiResponse.category}`,
    `確信度: ${aiResponse.confidence}`,
    `理由: ${aiResponse.reason ?? "不明"}`,
    `ユーザーID: ${lineUserId}`,
  ].join("\n");

  try {
    await pushMessage(ownerUserId, text);
    console.log("[Escalation] Owner notified");
  } catch (error) {
    console.error("[Escalation] Failed to notify owner:", error);
  }
}

export function getEscalationUserMessage(): string {
  return ESCALATION_USER_MESSAGE;
}

export type { AiResponse };
