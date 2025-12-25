# Supabaseセットアップガイド

## ステップ1: Supabaseプロジェクトの作成

### 1-1. Supabaseアカウント作成

1. [Supabase](https://supabase.com/)にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインアップ

### 1-2. 新規プロジェクト作成

1. ダッシュボードで「New Project」をクリック
2. 以下の情報を入力：
   - **Name**: `lure-database`（または任意の名前）
   - **Database Password**: 強力なパスワードを生成（必ずメモする！）
   - **Region**: `Northeast Asia (Tokyo)`（日本から最も近いリージョン）
   - **Pricing Plan**: `Free`（開発・テスト用）

3. 「Create new project」をクリック
4. プロジェクトの準備が完了するまで1-2分待つ

---

## ステップ2: 認証情報の取得

### 2-1. Project Settings を開く

1. 左サイドバーの「Settings」アイコンをクリック
2. 「API」セクションを選択

### 2-2. 必要な情報をコピー

以下の3つの情報をコピーしてメモ帳に保存：

1. **Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

2. **anon public key**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

3. **service_role secret** ⚠️ 注意：これは秘密鍵です
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

---

## ステップ3: 環境変数の設定

### 3-1. `.env.local` ファイルを編集

プロジェクトルートの `.env.local` ファイルを開き、以下のように編集：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Node Environment
NODE_ENV=development
```

⚠️ **重要**:
- `NEXT_PUBLIC_SUPABASE_URL`: コピーしたProject URLを貼り付け
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: コピーしたanon public keyを貼り付け
- `SUPABASE_SERVICE_ROLE_KEY`: コピーしたservice_role secretを貼り付け

### 3-2. 開発サーバーを再起動

環境変数を反映させるため、開発サーバーを再起動：

```bash
# Ctrl+C で停止
npm run dev
```

---

## ステップ4: データベーススキーマの作成

### 4-1. SQL Editorを開く

1. Supabaseダッシュボードの左サイドバーで「SQL Editor」をクリック
2. 「New Query」をクリック

### 4-2. テーブル作成SQLを実行

以下のSQLを順番に実行していきます：

#### ① lure_makersテーブル

```sql
-- ルアーメーカーテーブル
CREATE TABLE lure_makers (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  lure_maker_name_ja TEXT NOT NULL,
  lure_maker_name_en TEXT NOT NULL,
  lure_maker_logo_image TEXT,
  lure_maker_ref_url TEXT,
  description TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lure_makers_slug ON lure_makers(slug);

-- 初期データ（例）
INSERT INTO lure_makers (slug, lure_maker_name_ja, lure_maker_name_en) VALUES
  ('ima', 'アイマ', 'ima'),
  ('daiwa', 'ダイワ', 'DAIWA'),
  ('shimano', 'シマノ', 'SHIMANO');
```

「RUN」ボタンをクリックして実行。

#### ② lure_categoriesテーブル

```sql
-- ルアーカテゴリーテーブル
CREATE TABLE lure_categories (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  category_name_ja TEXT NOT NULL,
  category_name_en TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初期データ
INSERT INTO lure_categories (slug, category_name_ja, category_name_en, display_order) VALUES
  ('floating-minnow', 'フローティングミノー', 'Floating Minnow', 1),
  ('topwater', 'トップウォーター', 'Topwater', 2),
  ('sinking-pencil', 'シンキングペンシル', 'Sinking Pencil', 3),
  ('spintail-jig', 'スピンテールジグ', 'Spintail Jig', 4),
  ('metal-vibration', 'メタルバイブレーション', 'Metal Vibration', 5),
  ('lipless-minnow', 'リップレスミノー', 'Lipless Minnow', 6),
  ('suspend-shad', 'サスペンドシャッド', 'Suspend Shad', 7),
  ('vibration', 'バイブレーション', 'Vibration', 8);
```

「RUN」ボタンをクリックして実行。

#### ③ luresテーブル（最重要）

```sql
-- ルアーテーブル
CREATE TABLE lures (
  id BIGSERIAL PRIMARY KEY,
  url_code TEXT UNIQUE NOT NULL,
  scraping_source_id TEXT,

  lure_maker_id BIGINT REFERENCES lure_makers(id) ON DELETE CASCADE,
  lure_category_id BIGINT REFERENCES lure_categories(id),

  lure_name_ja TEXT NOT NULL,
  lure_name_en TEXT NOT NULL,
  lure_main_image TEXT,
  lure_tmb_image TEXT,
  lure_tmb_small TEXT,
  lure_tmb_medium TEXT,

  attached_hook_size_1 TEXT,
  attached_hook_size_2 TEXT,
  attached_hook_size_3 TEXT,
  attached_hook_size_4 TEXT,
  attached_hook_size_5 TEXT,
  attached_ring_size TEXT,

  lure_buoyancy TEXT,
  lure_shape TEXT,
  lure_action TEXT,

  lure_length NUMERIC(4,1),
  lure_weight NUMERIC(5,2),
  lure_range_min NUMERIC(5,1),
  lure_range_max NUMERIC(5,1),

  lure_ref_url TEXT UNIQUE,

  target_fish_1 TEXT,
  target_fish_2 TEXT,
  target_fish_3 TEXT,
  target_fish_4 TEXT,
  target_fish_5 TEXT,

  lure_information TEXT,

  view_count INT DEFAULT 0,
  data_version INT DEFAULT 1,

  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_lures_maker ON lures(lure_maker_id);
CREATE INDEX idx_lures_category ON lures(lure_category_id);
CREATE UNIQUE INDEX idx_lures_url ON lures(id, url_code);
CREATE INDEX idx_lures_scraping_source ON lures(scraping_source_id);
CREATE INDEX idx_lures_ref_url ON lures(lure_ref_url);
CREATE INDEX idx_lures_search ON lures USING gin(
  to_tsvector('simple', lure_name_ja || ' ' || lure_name_en)
);
```

「RUN」ボタンをクリックして実行。

#### ④ テストデータの投入

```sql
-- テストデータ（ima コモモ SF-125）
INSERT INTO lures (
  url_code,
  lure_maker_id,
  lure_category_id,
  lure_name_ja,
  lure_name_en,
  lure_main_image,
  lure_tmb_image,
  attached_hook_size_1,
  attached_hook_size_2,
  attached_ring_size,
  lure_buoyancy,
  lure_action,
  lure_length,
  lure_weight,
  lure_range_min,
  lure_range_max,
  lure_information
) VALUES (
  'a3k9x',
  1,  -- ima
  1,  -- フローティングミノー
  'コモモ SF-125',
  'komomo SF-125',
  'komomo_sf125',
  'komomo_sf125',
  '#6',
  '#4',
  '#2',
  'フローティング',
  'ローリング',
  125,
  16,
  10,
  50,
  'シーバス向けフローティングミノー。水面直下をゆっくりと引くことができる。'
);
```

「RUN」ボタンをクリックして実行。

### 4-3. テーブル確認

1. 左サイドバーの「Table Editor」をクリック
2. 以下のテーブルが作成されていることを確認：
   - ✅ `lure_makers`（3件）
   - ✅ `lure_categories`（8件）
   - ✅ `lures`（1件のテストデータ）

---

## ステップ5: Row Level Security（RLS）の設定

### 5-1. RLSポリシーの作成

```sql
-- luresテーブルにRLSを有効化
ALTER TABLE lures ENABLE ROW LEVEL SECURITY;

-- 公開読み取りポリシー
CREATE POLICY "Public read access" ON lures
  FOR SELECT
  USING (is_available = true);

-- 管理者フルアクセスポリシー（将来用）
CREATE POLICY "Admin full access" ON lures
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- lure_makersテーブル
ALTER TABLE lure_makers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON lure_makers
  FOR SELECT
  USING (is_available = true);

-- lure_categoriesテーブル
ALTER TABLE lure_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON lure_categories
  FOR SELECT
  USING (is_visible = true);
```

---

## ステップ6: Storageの設定（画像保存用）

### 6-1. Storage Bucketの作成

1. 左サイドバーの「Storage」をクリック
2. 「New bucket」をクリック
3. 以下の設定：
   - **Name**: `public`
   - **Public bucket**: ✅ ON（チェックを入れる）
4. 「Create bucket」をクリック

### 6-2. フォルダ構造の作成

`public` bucketを開き、以下のフォルダを作成：

1. `makers/` → `logos/`
2. `lures/` → `main/`
3. `lures/` → `thumbnails/`
4. `hooks/`

### 6-3. Storage Policyの設定

```sql
-- 公開読み取りポリシー
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'public');

-- 管理者アップロードポリシー（将来用）
CREATE POLICY "Admin upload access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public' AND
  auth.jwt() ->> 'role' = 'admin'
);
```

---

## ステップ7: 接続テスト

### 7-1. Next.jsアプリから接続確認

開発サーバーが起動している状態で、以下のURLにアクセス：

```
http://localhost:3001/lures
```

### 7-2. ブラウザの開発者ツールで確認

1. F12キーで開発者ツールを開く
2. Consoleタブを確認
3. エラーがないことを確認

---

## 完了チェックリスト

- [ ] Supabaseプロジェクト作成完了
- [ ] 認証情報を`.env.local`に設定
- [ ] `lure_makers`テーブル作成（3件のデータ）
- [ ] `lure_categories`テーブル作成（8件のデータ）
- [ ] `lures`テーブル作成（1件のテストデータ）
- [ ] RLSポリシー設定完了
- [ ] Storage bucket作成（`public`）
- [ ] フォルダ構造作成
- [ ] 開発サーバー再起動
- [ ] 接続テスト成功

---

## トラブルシューティング

### エラー: "Failed to fetch"

**原因**: 環境変数が正しく設定されていない

**解決方法**:
1. `.env.local`の内容を確認
2. 開発サーバーを完全に再起動（Ctrl+C → `npm run dev`）

### エラー: "relation does not exist"

**原因**: テーブルが作成されていない

**解決方法**:
1. SQL Editorでテーブル作成SQLを再実行
2. Table Editorでテーブルの存在を確認

### エラー: "permission denied for table"

**原因**: RLSポリシーが正しく設定されていない

**解決方法**:
1. RLS設定SQLを再実行
2. `is_available = true`になっているか確認

---

## 次のステップ

✅ Supabaseセットアップ完了後：

1. API実装（`/api/v1/lures`, `/api/v1/suggest`）
2. 実際のデータ取得・表示
3. 画像アップロード
4. ページネーション実装

---

**参考リンク**:
- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Next.js + Supabase統合ガイド](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
