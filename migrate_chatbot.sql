-- ============================================================
-- BisnisMulai — CHATBOT TABLES ONLY
-- Paste HANYA file ini di Supabase SQL Editor
-- Jangan campur dengan migrate.sql
-- ============================================================

-- 1. Tabel riwayat sesi chat
CREATE TABLE IF NOT EXISTS chatbot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel penggunaan harian (rate limiting 30 pesan/hari)
CREATE TABLE IF NOT EXISTS chatbot_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- 3. Aktifkan RLS
ALTER TABLE chatbot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_usage ENABLE ROW LEVEL SECURITY;

-- 4. Buat RLS policy (hapus dulu jika sudah ada)
DROP POLICY IF EXISTS "Users can only access own chat sessions" ON chatbot_sessions;
CREATE POLICY "Users can only access own chat sessions"
  ON chatbot_sessions FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only access own usage data" ON chatbot_usage;
CREATE POLICY "Users can only access own usage data"
  ON chatbot_usage FOR ALL
  USING (auth.uid() = user_id);

-- 5. Function untuk atomic increment usage counter
CREATE OR REPLACE FUNCTION increment_chatbot_usage(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO chatbot_usage (user_id, date, message_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET message_count = chatbot_usage.message_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Selesai! 2 tabel baru: chatbot_sessions & chatbot_usage
