import { getLineClient } from "./client";

export type WebhookEvent = {
  type: string;
  replyToken?: string;
  source: {
    userId?: string;
    type: string;
  };
  message?: {
    type: string;
    text?: string;
  };
};

export async function replyMessage(
  replyToken: string,
  text: string
): Promise<void> {
  const client = getLineClient();
  await client.replyMessage({
    replyToken,
    messages: [{ type: "text", text }],
  });
}

export async function pushMessage(
  userId: string,
  text: string
): Promise<void> {
  const client = getLineClient();
  await client.pushMessage({
    to: userId,
    messages: [{ type: "text", text }],
  });
}
