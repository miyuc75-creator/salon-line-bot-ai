"use client";

import { useState } from "react";
import { Button } from "@/components/admin/Button";
import type { Announcement } from "@/types/database";

type BroadcastFormProps = {
  history: Announcement[];
};

export function BroadcastForm({ history }: BroadcastFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSend() {
    if (!title.trim() || !body.trim()) {
      setMessage("タイトルと本文を入力してください");
      return;
    }
    if (!confirm("LINE友だち全員にお知らせを配信します。よろしいですか？")) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "配信失敗");
      }

      setMessage("配信しました！");
      setTitle("");
      setBody("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "配信に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">タイトル</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 臨時休業のお知らせ"
            className="min-h-11 w-full rounded-xl border border-zinc-300 px-4 text-base"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">本文</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="お知らせの内容を入力..."
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base"
          />
        </div>
        {title && body && (
          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-xs font-medium text-zinc-500">プレビュー</p>
            <p className="mt-2 font-semibold text-zinc-800">{title}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-600">{body}</p>
          </div>
        )}
        <Button onClick={handleSend} loading={loading}>
          LINE友だちに配信する
        </Button>
        {message && (
          <p className={`text-sm ${message.includes("しました") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>

      {history.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-600">配信履歴</h2>
          <div className="space-y-2">
            {history.map((a) => (
              <div key={a.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-zinc-800">{a.title}</p>
                  <span className={`text-xs ${a.status === "sent" ? "text-green-600" : "text-zinc-400"}`}>
                    {a.status === "sent" ? "配信済" : "下書き"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{a.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
