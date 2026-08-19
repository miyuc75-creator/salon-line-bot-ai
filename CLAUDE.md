# LINE Bot + AI 自動応答システム

美容室向け LINE 公式アカウントの AI 自動応答システム。

## 技術スタック

- **フロントエンド / API**: Next.js 16 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS 4
- **データベース / 認証**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: Claude API (Anthropic)
- **LINE 連携**: LINE Messaging API (`@line/bot-sdk`)
- **ホスティング**: Vercel

## ディレクトリ構成

```
src/
├── app/
│   ├── api/webhook/line/   # LINE Webhook エンドポイント
│   ├── admin/              # 管理画面（オーナー向け）
│   └── login/              # ログイン
├── lib/
│   ├── supabase/           # Supabase クライアント
│   ├── line/               # LINE SDK ラッパー
│   └── ai/                 # Claude API 連携
└── types/                  # 型定義
supabase/migrations/        # DB マイグレーション
```

## 命名規則

- **ファイル**: kebab-case (`message-handler.ts`)
- **コンポーネント**: PascalCase (`FaqList.tsx`)
- **関数 / 変数**: camelCase (`handleMessage`)
- **定数**: UPPER_SNAKE_CASE (`LINE_CHANNEL_SECRET`)
- **DB テーブル**: snake_case 複数形 (`faqs`, `menus`, `conversations`)
- **API ルート**: `/api/webhook/line`, `/api/broadcast`

## カラーパレット（管理画面）

| 用途 | 色 | Tailwind |
|------|-----|----------|
| プライマリ | ローズピンク | `rose-500` / `rose-600` |
| 背景 | ライトグレー | `zinc-50` |
| カード | 白 | `white` |
| テキスト | ダークグレー | `zinc-800` |
| エラー | レッド | `red-500` |
| 成功 | グリーン | `green-500` |

## コーディングルール

1. **秘密情報をコードに書かない** — 環境変数（`.env.local`）で管理
2. **Server Actions / Route Handler** で API 処理、クライアントは UI のみ
3. **Supabase RLS** でデータアクセスを制御
4. **LINE Webhook** は必ず署名検証を行う
5. **AI は推測で回答しない** — 登録情報のみを根拠に回答
6. **エラーハンドリング** — API 障害時は誤回答せずオーナー対応へ
7. **日本語** — UI・AI 回答ともに丁寧な日本語
8. **スマホファースト** — 管理画面は 375px 幅を基準に設計

## 環境変数

```env
# LINE
LINE_CHANNEL_SECRET=
LINE_CHANNEL_ACCESS_TOKEN=
LINE_OWNER_USER_ID=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=
```

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm run lint     # Lint
```

## フェーズ

- **Phase 1（基盤）**: Webhook エコー + Supabase テーブル ✅
- **Phase 2（コア）**: FAQ 自動応答 + エスカレーション ✅
- **Phase 3（管理画面）**: CRUD + 認証 + 一斉配信 ✅
- **Phase 4（配信）**: お知らせ一斉配信

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
