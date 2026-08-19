import { AdminHeader } from "@/components/admin/AdminHeader";
import { getConversations, getUnansweredQuestions } from "./actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ConversationsPage() {
  const [conversations, unanswered] = await Promise.all([
    getConversations(),
    getUnansweredQuestions(),
  ]);

  return (
    <>
      <AdminHeader title="会話ログ" />
      <div className="space-y-6 px-4 py-6">
        {unanswered.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-red-600">
              要対応（{unanswered.length}件）
            </h2>
            <div className="space-y-2">
              {unanswered.map((q) => (
                <div
                  key={q.id}
                  className="rounded-2xl border border-red-200 bg-red-50 p-4"
                >
                  <p className="text-sm font-medium text-zinc-800">{q.question}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatDate(q.created_at)} · 確信度: {q.confidence ?? "low"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-600">
            やり取り履歴（{conversations.length}件）
          </h2>
          {conversations.length === 0 ? (
            <p className="py-8 text-center text-zinc-500">会話ログがありません</p>
          ) : (
            <div className="space-y-2">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-2xl p-4 ${
                    c.role === "user"
                      ? "border border-zinc-200 bg-white"
                      : "border border-rose-100 bg-rose-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500">
                      {c.role === "user" ? "お客様" : "Bot"}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-800">{c.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
