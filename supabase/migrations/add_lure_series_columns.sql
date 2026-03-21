-- ルアーシリーズ管理用カラム
ALTER TABLE lures ADD COLUMN IF NOT EXISTS lure_series_ja text;
ALTER TABLE lures ADD COLUMN IF NOT EXISTS lure_series_en text;
CREATE INDEX IF NOT EXISTS idx_lures_series ON lures(lure_series_ja);
