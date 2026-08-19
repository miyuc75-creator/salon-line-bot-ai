import crypto from "crypto";

export function verifyLineSignature(
  body: string,
  signature: string | null
): boolean {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;

  if (!channelSecret || !signature) {
    return false;
  }

  const hash = crypto
    .createHmac("SHA256", channelSecret)
    .update(body)
    .digest("base64");

  return hash === signature;
}
