-- ルアー詳細ページの背景グラデーション用の事前抽出色データを保存するカラム
-- 形式: { "colors": [{ "baseRgb": [r, g, b], "weight": n }, ...] }
ALTER TABLE lures ADD COLUMN IF NOT EXISTS bg_colors jsonb;
