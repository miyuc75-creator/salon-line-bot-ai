import { messagingApi } from "@line/bot-sdk";

export function getLineClient() {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!channelAccessToken) {
    throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not configured");
  }

  return new messagingApi.MessagingApiClient({ channelAccessToken });
}
