import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLineClient } from "@/lib/line/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, body } = (await request.json()) as {
    title: string;
    body: string;
  };

  if (!title || !body) {
    return NextResponse.json({ error: "Title and body required" }, { status: 400 });
  }

  try {
    const client = getLineClient();
    const message = `${title}\n\n${body}`;

    await client.broadcast({
      messages: [{ type: "text", text: message }],
    });

    const { error } = await supabase.from("announcements").insert({
      title,
      body,
      status: "sent",
      sent_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[Broadcast] Failed to save announcement:", error);
    }

    return NextResponse.json({ status: "sent" });
  } catch (error) {
    console.error("[Broadcast] Failed:", error);
    return NextResponse.json(
      { error: "配信に失敗しました" },
      { status: 500 }
    );
  }
}
