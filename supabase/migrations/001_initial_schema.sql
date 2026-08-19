-- FAQ テーブル
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- メニュー・料金テーブル
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 会話ログテーブル
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_line_user_id ON conversations (line_user_id);
CREATE INDEX IF NOT EXISTS idx_faqs_is_active ON faqs (is_active);
CREATE INDEX IF NOT EXISTS idx_menus_is_active ON menus (is_active);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER menus_updated_at
  BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS 有効化
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザー（オーナー）: 全操作可
CREATE POLICY "Authenticated users can manage faqs"
  ON faqs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage menus"
  ON menus FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (true);

-- service_role（Webhook 用）: 読み取り + conversations INSERT
CREATE POLICY "Service role can read faqs"
  ON faqs FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can read menus"
  ON menus FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage conversations"
  ON conversations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 初期シードデータ
INSERT INTO faqs (question, answer, category) VALUES
  ('営業時間を教えてください', '平日 10:00〜19:00、土日祝 9:00〜18:00 です。', '営業時間'),
  ('定休日はいつですか？', '毎週火曜日と第3水曜日が定休日です。', '営業時間'),
  ('予約方法を教えてください', 'LINE、お電話（03-1234-5678）、またはホットペッパービューティーからご予約いただけます。', '予約'),
  ('駐車場はありますか？', '店舗前に3台分の無料駐車場がございます。満車の場合は近隣のコインパーキングをご利用ください。', 'アクセス'),
  ('パーマとカラーは同時にできますか？', '髪の状態によりますが、基本的には同日施術可能です。詳しくはご来店時にスタイリストがご相談に応じます。', '施術');

INSERT INTO menus (name, price, description) VALUES
  ('カット', 5500, 'シャンプー・ブロー込み'),
  ('カラー', 7700, 'トリートメント込み'),
  ('パーマ', 8800, 'カット・ブロー込み'),
  ('カット + カラー', 12100, 'セットメニュー'),
  ('カット + パーマ', 13200, 'セットメニュー'),
  ('トリートメント', 3300, 'ダメージケア');
