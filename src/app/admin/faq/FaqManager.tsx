"use client";

import { useState } from "react";
import { Button } from "@/components/admin/Button";
import { createFaq, updateFaq, deleteFaq } from "./actions";
import type { Faq } from "@/types/database";

const CATEGORIES = ["営業時間", "メニュー・料金", "予約", "施術", "アクセス", "その他"];

type FaqManagerProps = {
  faqs: Faq[];
};

export function FaqManager({ faqs }: FaqManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (editing) {
        await updateFaq(editing.id, formData);
      } else {
        await createFaq(formData);
      }
      setShowForm(false);
      setEditing(null);
    } catch {
      alert("保存に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("このFAQを削除しますか？")) return;
    setLoading(true);
    try {
      await deleteFaq(id);
    } catch {
      alert("削除に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  if (showForm || editing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">カテゴリ</label>
          <select
            name="category"
            defaultValue={editing?.category ?? "その他"}
            className="min-h-11 w-full rounded-xl border border-zinc-300 px-4 text-base"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">質問</label>
          <input
            name="question"
            defaultValue={editing?.question ?? ""}
            required
            className="min-h-11 w-full rounded-xl border border-zinc-300 px-4 text-base"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">回答</label>
          <textarea
            name="answer"
            defaultValue={editing?.answer ?? ""}
            required
            rows={4}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base"
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" loading={loading}>
            {editing ? "更新する" : "追加する"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => { setShowForm(false); setEditing(null); }}
          >
            キャンセル
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowForm(true)}>＋ FAQを追加</Button>
      {faqs.length === 0 ? (
        <p className="py-8 text-center text-zinc-500">FAQがまだありません</p>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-600">
                {faq.category ?? "その他"}
              </span>
              <p className="mt-2 font-semibold text-zinc-800">{faq.question}</p>
              <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{faq.answer}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setEditing(faq)}
                  className="min-h-11 flex-1 rounded-xl border border-zinc-300 text-sm font-medium text-zinc-700"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="min-h-11 flex-1 rounded-xl border border-red-200 text-sm font-medium text-red-600"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
