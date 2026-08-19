import { AdminCard } from "@/components/admin/AdminCard";

export default function AdminPage() {
  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">管理画面</h1>
        <p className="mt-1 text-sm text-zinc-500">店舗情報の更新・確認</p>
      </div>
      <div className="space-y-3">
        <AdminCard
          href="/admin/faq"
          icon="❓"
          title="FAQ管理"
          description="よくある質問の追加・編集"
        />
        <AdminCard
          href="/admin/menu"
          icon="💇"
          title="メニュー・料金"
          description="メニューと料金の更新"
        />
        <AdminCard
          href="/admin/conversations"
          icon="💬"
          title="会話ログ"
          description="お客様とのやり取りを確認"
        />
        <AdminCard
          href="/admin/broadcast"
          icon="📢"
          title="お知らせ配信"
          description="LINE友だちへ一斉配信"
        />
      </div>
    </div>
  );
}
