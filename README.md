# LINE Bot + AI 自動応答システム

美容室向け LINE 公式アカウントの AI 自動応答システム。

## 技術スタック

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Auth + RLS)
- Claude API (Anthropic)
- LINE Messaging API
- Vercel

## セットアップ

### 1. 依存関係インストール

```bash
npm install
```

### 2. 環境変数

`.env.local.example` を `.env.local` にコピーし、各値を設定してください。

```bash
cp .env.local.example .env.local
```

### 3. Supabase テーブル作成

Supabase ダッシュボードの SQL Editor で以下を実行:

```
supabase/migrations/001_initial_schema.sql
```

作成されるテーブル:
- `faqs` — FAQ
- `menus` — メニュー・料金
- `conversations` — 会話ログ

### 4. LINE Messaging API 設定

1. [LINE Developers Console](https://developers.line.biz/) でチャネル作成
2. Channel Secret / Channel Access Token を `.env.local` に設定
3. Webhook URL を設定: `https://your-domain.vercel.app/api/webhook/line`
4. Webhook の利用を ON にする
5. 応答メッセージを OFF にする（Bot が返信するため）

### 5. 開発サーバー起動

**ターミナル1** — Next.js（port 3000 を使う）:

```bash
npm run dev:3000
```

**ターミナル2** — ngrok（別ターミナルで起動）:

```bash
ngrok http 3000
```

> `npm run dev` と `ngrok` を同じターミナルで実行しないでください。  
> `npm run dev` がブロックするため ngrok が起動しません。

### 6. LINE Webhook 設定

1. ngrok の URL をコピー（例: `https://xxxx.ngrok-free.app`）
2. LINE Developers → Messaging API → Webhook URL に設定:
   `https://xxxx.ngrok-free.app/api/webhook/line`
3. **Verify** ボタンで成功することを確認
4. Webhook の利用 → **ON**
5. 応答メッセージ → **OFF**（Bot が返信するため）

## トラブルシューティング

### メッセージを送っても反応がない

| 確認項目 | 対処 |
|---------|------|
| ngrok が起動しているか | 別ターミナルで `ngrok http 3000` を実行 |
| ポートが一致しているか | ngrok は **3000**、Next.js も **3000** で起動 |
| 古い Next.js プロセスが残っていないか | `lsof -i :3000` で確認し、古い process を停止 |
| Webhook Verify が成功するか | LINE Developers で Verify → Success になること |
| ターミナルに POST ログが出るか | メッセージ送信時 `[LINE Webhook] POST received` が表示される |
| 応答メッセージが OFF か | ON のままだと LINE 側の自動応答と競合する |

### ポート 3000 が使用中の場合

```bash
# 使用中のプロセスを確認
lsof -i :3000

# 古い next dev を停止（PID は上記で確認）
kill <PID>

# 再起動
npm run dev:3000
```

## 現在のフェーズ: 管理画面（Phase 3）✅

### 管理画面ルート

| パス | 機能 |
|------|------|
| `/login` | ログイン |
| `/admin` | ダッシュボード |
| `/admin/faq` | FAQ 追加・編集・削除 |
| `/admin/menu` | メニュー・料金更新 |
| `/admin/conversations` | 会話ログ・要対応一覧 |
| `/admin/broadcast` | お知らせ一斉配信 |

### Supabase セットアップ（管理画面に必須）

1. [supabase.com](https://supabase.com) でプロジェクト作成
2. SQL Editor で以下を順に実行:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_unanswered_questions.sql`
   - `supabase/migrations/003_announcements.sql`
3. **Authentication → Users** でオーナー用アカウント作成（メール+パスワード）
4. `.env.local` に Supabase の URL / キーを設定
5. `/login` からログイン

### UI 方針

- スマホファースト（最大幅 512px）
- ボタン最小高さ 44px
- 処理中はスピナー表示

## テスト

```bash
# ビルド
npm run build

# Webhook 署名テスト用データ生成
node scripts/test-webhook.mjs

# Webhook 疎通確認
curl http://localhost:3000/api/webhook/line
```

## ディレクトリ構成

```
src/
├── app/
│   ├── api/webhook/line/   # LINE Webhook
│   └── page.tsx            # トップページ
├── lib/
│   ├── supabase/           # Supabase クライアント
│   ├── line/               # LINE SDK ラッパー
│   └── services/           # メッセージ処理
└── types/                  # 型定義
supabase/migrations/        # DB マイグレーション
```

## 次のステップ（Phase 2）

- FAQ 自動応答（Claude API 連携）
- 回答不能時のオーナー通知・エスカレーション
