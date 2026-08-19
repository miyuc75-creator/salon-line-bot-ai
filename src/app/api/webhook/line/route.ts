import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature } from "@/lib/line/verify";
import { handleLineEvent } from "@/lib/services/message-handler";
import type { WebhookEvent } from "@/lib/line/reply";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-line-signature");

  console.log("[LINE Webhook] POST received");

  if (!verifyLineSignature(body, signature)) {
    console.error("[LINE Webhook] Signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let events: WebhookEvent[];

  try {
    const parsed = JSON.parse(body) as { events: WebhookEvent[] };
    events = parsed.events ?? [];
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log(`[LINE Webhook] ${events.length} event(s) received`);

  await Promise.all(
    events.map(async (event) => {
      try {
        console.log("[LINE Webhook] Event:", event.type, event.message?.type);
        console.log("[LINE Webhook] userId:", event.source.userId);
        await handleLineEvent(event);
      } catch (error) {
        console.error("[LINE Webhook] Failed to handle event:", error);
      }
    })
  );

  return NextResponse.json({ status: "ok" });
}

export async function GET() {
  return NextResponse.json({ status: "LINE webhook is ready" });
}
