"use client";

import { useState } from "react";
import { Button } from "@/components/admin/Button";
import { createMenu, updateMenu, deleteMenu } from "./actions";
import type { Menu } from "@/types/database";

type MenuManagerProps = {
  menus: Menu[];
};

export function MenuManager({ menus }: MenuManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (editing) {
        await updateMenu(editing.id, formData);
      } else {
        await createMenu(formData);
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
    if (!confirm("このメニューを削除しますか？")) return;
    setLoading(true);
    try {
      await deleteMenu(id);
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
          <label className="mb-1 block text-sm font-medium text-zinc-700">メニュー名</label>
          <input
            name="name"
            defaultValue={editing?.name ?? ""}
            required
            className="min-h-11 w-full rounded-xl border border-zinc-300 px-4 text-base"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">料金（円）</label>
          <input
            name="price"
            type="number"
            defaultValue={editing?.price ?? ""}
            required
            min={0}
            className="min-h-11 w-full rounded-xl border border-zinc-300 px-4 text-base"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">説明（任意）</label>
          <input
            name="description"
            defaultValue={editing?.description ?? ""}
            className="min-h-11 w-full rounded-xl border border-zinc-300 px-4 text-base"
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
      <Button onClick={() => setShowForm(true)}>＋ メニューを追加</Button>
      {menus.length === 0 ? (
        <p className="py-8 text-center text-zinc-500">メニューがまだありません</p>
      ) : (
        <div className="space-y-3">
          {menus.map((menu) => (
            <div key={menu.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex items-baseline justify-between">
                <p className="font-semibold text-zinc-800">{menu.name}</p>
                <p className="text-lg font-bold text-rose-600">
                  {menu.price.toLocaleString()}円
                </p>
              </div>
              {menu.description && (
                <p className="mt-1 text-sm text-zinc-500">{menu.description}</p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setEditing(menu)}
                  className="min-h-11 flex-1 rounded-xl border border-zinc-300 text-sm font-medium text-zinc-700"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(menu.id)}
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
