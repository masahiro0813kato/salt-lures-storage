-- 閲覧トラッキング用テーブル
CREATE TABLE page_views (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lure_id integer REFERENCES lures(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  ip_hash text NOT NULL
);

-- ランキング集計用インデックス
CREATE INDEX idx_page_views_lure_viewed ON page_views(lure_id, viewed_at);

-- 重複チェック用インデックス（同一IP + 同一ルアー + 日付）
CREATE INDEX idx_page_views_dedup ON page_views(lure_id, ip_hash, viewed_at);
