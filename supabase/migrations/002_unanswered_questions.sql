-- 未回答質問テーブル
CREATE TABLE IF NOT EXISTS unanswered_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  line_user_id TEXT NOT NULL,
  category TEXT,
  confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_unanswered_status ON unanswered_questions (status);

ALTER TABLE unanswered_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage unanswered"
  ON unanswered_questions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage unanswered"
  ON unanswered_questions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
