ルアーデータベース - 要件定義書 v2.0
最終更新: 2025 年 11 月 12 日
プロジェクト名: Lure Database (ルアーデータベース)
バージョン: 2.0 (Web + モバイル対応版)

📋 目次

プロジェクト概要
技術スタック
データベース設計
URL 設計とセキュリティ
機能要件
パフォーマンス最適化
UI/UX 設計
モバイル展開計画
実装フェーズ
コスト試算

プロジェクト概要
目的
釣具メーカーの公式サイトから製品情報（ルアー・フック）を自動収集し、統一されたデータベースとして提供する。ユーザーがルアーを簡単に検索・比較できる Web サービス、および将来的にモバイルアプリを構築する。
主要機能

ルアー・メーカーの検索と閲覧
詳細フィルター機能（カテゴリー、サイズ、重量、レンジ）
閲覧履歴と検索履歴の管理
フックデータベース（将来実装）
ユーザーアカウント機能（第 2 フェーズ）
サブスクリプション機能（第 3 フェーズ）

差別化要素

ビジュアル体験: シェーダーエフェクトを使った独自の背景演出
高速パフォーマンス: Lighthouse Score 95+目標
スクレイピング対策: 多層防御による堅牢なシステム
クロスプラットフォーム: Web・iOS・Android で同一データベース

技術スタック
フロントエンド
typescript- Next.js 15 (App Router)

- TypeScript
- React 18
- Tailwind CSS
- shadcn/ui (UI コンポーネント)
- Three.js + React Three Fiber (シェーダー用)
  バックエンド
  typescript- Next.js API Routes
- Supabase (PostgreSQL)
- Supabase Auth (認証)
- Supabase Storage (画像保存)
  インフラ
  typescript- Vercel (ホスティング)
- Cloudflare (CDN + セキュリティ)
- Supabase Cloud (データベース)
  開発ツール
  typescript- Claude Code (AI 開発支援)
- Git + GitHub
- ESLint + Prettier
  将来のモバイル開発
  typescript- React Native + Expo
- 共有コードベース (70-80%)

データベース設計
テーブル構成

1. lure_makers（ルアーメーカー）
   sqlCREATE TABLE lure_makers (
   id BIGSERIAL PRIMARY KEY,
   slug TEXT UNIQUE NOT NULL, -- 'ima', 'daiwa'
   lure_maker_name_ja TEXT NOT NULL,
   lure_maker_name_en TEXT NOT NULL,
   lure_maker_logo_image TEXT, -- 'maker_logo_1.webp'
   lure_maker_ref_url TEXT,
   description TEXT,
   is_available BOOLEAN DEFAULT true,
   created_at TIMESTAMPTZ DEFAULT NOW(),
   updated_at TIMESTAMPTZ DEFAULT NOW()
   );

CREATE INDEX idx_lure_makers_slug ON lure_makers(slug); 2. lure_categories（ルアーカテゴリー）
sqlCREATE TABLE lure_categories (
id BIGSERIAL PRIMARY KEY,
slug TEXT UNIQUE NOT NULL, -- 'floating-minnow'
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
('vibration', 'バイブレーション', 'Vibration', 8); 3. lures（ルアー）
sqlCREATE TABLE lures (
id BIGSERIAL PRIMARY KEY,
url_code TEXT UNIQUE NOT NULL, -- 'a3k9x' (ランダム 5 文字)
scraping_source_id TEXT, -- 'ima-product-62' (内部管理用)

lure_maker_id BIGINT REFERENCES lure_makers(id) ON DELETE CASCADE,
lure_category_id BIGINT REFERENCES lure_categories(id),

lure_name_ja TEXT NOT NULL,
lure_name_en TEXT NOT NULL,
lure_main_image TEXT, -- 'lure_main_1.webp'
lure_tmb_image TEXT, -- 'lure_tmb_1.webp'
lure_tmb_small TEXT, -- 'lure_tmb_1_small.webp' (モバイル用)
lure_tmb_medium TEXT, -- 'lure_tmb_1_medium.webp' (タブレット用)

attached_hook_size_1 TEXT,
attached_hook_size_2 TEXT,
attached_hook_size_3 TEXT,
attached_hook_size_4 TEXT,
attached_hook_size_5 TEXT,
attached_ring_size TEXT,

lure_buoyancy TEXT, -- 'フローティング', 'シンキング', 'サスペンド'
lure_shape TEXT,
lure_action TEXT,

lure_length NUMERIC(4,1), -- mm
lure_weight NUMERIC(5,2), -- g
lure_range_min NUMERIC(5,1), -- cm
lure_range_max NUMERIC(5,1), -- cm

lure_ref_url TEXT UNIQUE,

target_fish_1 TEXT,
target_fish_2 TEXT,
target_fish_3 TEXT,
target_fish_4 TEXT,
target_fish_5 TEXT,

lure_information TEXT,

view_count INT DEFAULT 0,
data_version INT DEFAULT 1, -- モバイルキャッシュ管理用

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
); 4. hook_makers（フックメーカー）
sqlCREATE TABLE hook_makers (
id BIGSERIAL PRIMARY KEY,
slug TEXT UNIQUE NOT NULL,
hook_maker_name_ja TEXT NOT NULL,
hook_maker_name_en TEXT NOT NULL,
hook_maker_logo_image TEXT,
hook_maker_ref_url TEXT,
description TEXT,
is_available BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
); 5. hooks（フック商品）
sqlCREATE TABLE hooks (
id BIGSERIAL PRIMARY KEY,
url_code TEXT UNIQUE NOT NULL,
hook_maker_id BIGINT REFERENCES hook_makers(id) ON DELETE CASCADE,

hook_series_name_ja TEXT NOT NULL,
hook_series_name_en TEXT NOT NULL,
hook_model_number TEXT,
hook_size TEXT NOT NULL,
hook_type TEXT, -- 'トレブル', 'シングル', 'ダブル'
hook_main_image TEXT,
hook_ref_url TEXT,
hook_information TEXT,

is_available BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
); 6. lure_hook_relations（ルアー × フック関連）
sqlCREATE TABLE lure_hook_relations (
id BIGSERIAL PRIMARY KEY,
lure_id BIGINT REFERENCES lures(id) ON DELETE CASCADE,
hook_id BIGINT REFERENCES hooks(id) ON DELETE CASCADE,
position INT, -- 1:前, 2:中, 3:後
is_default BOOLEAN DEFAULT false,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(lure_id, hook_id, position)
); 7. アクセス解析テーブル
sql-- ページビュー
CREATE TABLE page_views (
id BIGSERIAL PRIMARY KEY,
lure_id BIGINT REFERENCES lures(id) ON DELETE CASCADE,
maker_id BIGINT REFERENCES lure_makers(id) ON DELETE CASCADE,
viewed_at TIMESTAMPTZ DEFAULT NOW(),
referrer TEXT,
user_agent TEXT,
country TEXT
);

CREATE INDEX idx_page_views_lure ON page_views(lure_id, viewed_at DESC);
CREATE INDEX idx_page_views_maker ON page_views(maker_id, viewed_at DESC);

-- 検索ログ
CREATE TABLE search_logs (
id BIGSERIAL PRIMARY KEY,
query TEXT NOT NULL,
filters JSONB,
result_count INT,
searched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_logs_query ON search_logs(query);
CREATE INDEX idx_search_logs_date ON search_logs(searched_at DESC); 8. 第 2 フェーズ：ユーザー関連テーブル
sql-- ユーザーの閲覧履歴（ログイン後）
CREATE TABLE user_lure_views (
id BIGSERIAL PRIMARY KEY,
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
lure_id BIGINT REFERENCES lures(id) ON DELETE CASCADE,
viewed_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(user_id, lure_id)
);

-- ユーザーの検索履歴（ログイン後）
CREATE TABLE user_search_history (
id BIGSERIAL PRIMARY KEY,
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
query TEXT NOT NULL,
result_count INT,
searched_at TIMESTAMPTZ DEFAULT NOW()
);

-- お気に入りルアー
CREATE TABLE user_favorite_lures (
id BIGSERIAL PRIMARY KEY,
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
lure_id BIGINT REFERENCES lures(id) ON DELETE CASCADE,
notify_on_update BOOLEAN DEFAULT false,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(user_id, lure_id)
);

-- モバイルデバイス管理
CREATE TABLE user_devices (
id BIGSERIAL PRIMARY KEY,
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
device_token TEXT NOT NULL,
platform TEXT NOT NULL, -- 'ios' or 'android'
app_version TEXT,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

```

### 画像ストレージ構造
```

Supabase Storage - public bucket:
├── makers/
│ └── logos/
│ ├── maker_logo_1.webp
│ ├── maker_logo_2.webp
│ └── ...
├── lures/
│ ├── main/
│ │ ├── lure_main_1.webp (1200x1200)
│ │ └── ...
│ └── thumbnails/
│ ├── lure_tmb_1.webp (400x400)
│ ├── lure_tmb_1_small.webp (100x100) ← モバイル用
│ ├── lure_tmb_1_medium.webp (200x200) ← タブレット用
│ └── ...
└── hooks/
├── hook_main_1.webp
└── ...

URL 設計とセキュリティ
URL 構造
typescript// ルアー
/lures/123-a3k9x
└─┬┘ └─┬─┘
レコード ID ランダム 5 文字

// メーカー
/makers/ima
/makers/ima/lures

// フック（将来）
/hooks/456-k7m2p

// 検索
/search?q=iborn&category=floating-minnow&maker=ima

// API
/api/v1/lures
/api/v1/lures/123-a3k9x
/api/v1/makers
/api/v1/search
URL 生成ロジック
typescript// lib/utils.ts
export function generateUrlCode(): string {
const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
return Array.from(
{ length: 5 },
() => chars[Math.floor(Math.random() * chars.length)]
).join('')
}

export function generateLureUrl(id: number, urlCode: string): string {
return `/lures/${id}-${urlCode}`
}

export function parseLureUrl(slug: string): { id: number, code: string } | null {
const match = slug.match(/^(\d+)-([a-z0-9]{5})$/)
if (!match) return null

return {
id: parseInt(match[1]),
code: match[2]
}
}
セキュリティ（多層防御）
レイヤー 1: Cloudflare Protection
typescript 設定項目:
✅ Bot Fight Mode: ON
✅ Security Level: High
✅ Firewall Rules (5 個):

1.  高頻度アクセスをチャレンジ
2.  怪しい User-Agent をブロック
3.  特定国からのアクセス制限（オプション）
4.  API 保護
5.  管理画面保護

✅ Rate Limiting:

- 一般: 100 リクエスト/分
- API: 10 リクエスト/分

✅ Page Rules (3 個):

1.  画像キャッシュ（1 ヶ月）
2.  API 非キャッシュ
3.  ルアー詳細キャッシュ（1 時間）
    レイヤー 2: Next.js Middleware
    typescript// middleware.ts
    export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || ''

// User-Agent チェック
if (!userAgent) {
return new NextResponse('Forbidden', { status: 403 })
}

// 怪しいパターン検出
const suspiciousPatterns = [
/python-requests/i,
/beautifulsoup/i,
/selenium/i,
]

if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
return new NextResponse('Forbidden', { status: 403 })
}

return NextResponse.next()
}
レイヤー 3: URL 設計
typescript 特徴:
✅ ID とランダムコードの両方で検証
✅ 連番推測を防止
✅ セキュリティと SEO のバランス
レイヤー 4: Supabase RLS
sql-- Row Level Security
ALTER TABLE lures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON lures
FOR SELECT USING (is_available = true);

CREATE POLICY "Admin full access" ON lures
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

機能要件
第 1 フェーズ：基本機能（ローンチ時）
必須機能
ルアー関連

ルアー一覧表示（ページネーション）
ルアー詳細表示
ルアー検索（フリーワード）
詳細フィルター

メーカー（複数選択）
カテゴリー（複数選択）
レングス（範囲指定）
ウェイト（範囲指定）
レンジ（範囲指定）
浮力タイプ

ソート機能（新着順、人気順、名前順）

メーカー関連

メーカー一覧表示
メーカー詳細表示
メーカー別ルアー一覧

ユーザー体験

最近見たルアー（LocalStorage、最大 20 件）
検索履歴（LocalStorage、最大 10 件）
検索バーのオートコンプリート
レスポンシブデザイン

管理機能（最小限）

管理者ログイン
ルアー追加・編集・削除
メーカー管理
画像アップロード
アクセス統計確認

SEO・パフォーマンス

メタタグ設定
OGP 設定
サイトマップ自動生成
構造化データ（JSON-LD）
画像最適化（WebP, AVIF）
Lighthouse Score 95+

シェーダーエフェクト

ルアー詳細ページの背景シェーダー
主要色の自動抽出
モバイルでのフォールバック

中優先（ローンチ直後）

人気ルアーランキング
新着ルアー表示
関連ルアー表示
パンくずリスト

低優先（後回し OK）

フックページ実装
高度な管理機能
多言語対応

第 2 フェーズ：ユーザー機能

ユーザー登録・ログイン
お気に入りルアー
マイページ
閲覧履歴のデバイス間共有
コメント・レビュー機能

第 3 フェーズ：サブスクリプション

Stripe 決済統合
サブスクプラン管理
有料会員限定機能
詳細な分析データ提供

第 4 フェーズ：モバイルアプリ

React Native + Expo 環境構築
iOS/Android アプリ開発
プッシュ通知
オフライン対応
アプリストア公開

パフォーマンス最適化
目標指標
typescriptLighthouse Score:
✅ Performance: 95+
✅ Accessibility: 95+
✅ Best Practices: 95+
✅ SEO: 100

Core Web Vitals:
✅ LCP: < 2.5 秒
✅ FID: < 100ms
✅ CLS: < 0.1

その他:
✅ First Contentful Paint: < 1.5 秒
✅ Time to Interactive: < 3.5 秒
✅ Total Bundle Size: < 200KB (gzipped)
最適化戦略

1. Next.js 設定
   typescript// next.config.js
   const nextConfig = {
   images: {
   formats: ['image/webp', 'image/avif'],
   deviceSizes: [640, 750, 828, 1080, 1200, 1920],
   minimumCacheTTL: 60 _ 60 _ 24 \* 365,
   },
   experimental: {
   optimizePackageImports: ['lucide-react'],
   turbo: {},
   },
   compiler: {
   removeConsole: process.env.NODE_ENV === 'production',
   },
   compress: true,
   }
2. Server Components 優先
   typescript// デフォルトは Server Component
   export default async function LuresPage() {
   const lures = await getLures() // サーバー側でフェッチ
   return <LureList lures={lures} />
   }

// Client Component は必要最小限
'use client'
export function SearchBar() {
const [query, setQuery] = useState('')
// ...
} 3. 動的インポート
typescript// 重いコンポーネントは遅延ロード
const ShaderBackground = dynamic(
() => import('./ShaderBackground'),
{
ssr: false,
loading: () => <SimpleGradientBg />
}
) 4. キャッシング
typescript// ISR: 1 時間ごとに再検証
export const revalidate = 3600

// または On-Demand Revalidation
import { revalidatePath } from 'next/cache'
revalidatePath('/lures/123-a3k9x') 5. 画像最適化
typescript<Image
  src={lure.lure_main_image}
  alt={lure.lure_name_ja}
  width={1200}
  height={1200}
  quality={85}
  priority={false}
  loading="lazy"
  placeholder="blur"
/> 6. バンドルサイズ削減
typescript 依存関係の選択:
✅ clsx (軽量な classname 管理)
✅ zustand (軽量な状態管理)
✅ swr (軽量なデータフェッチ)
❌ moment.js → date-fns
❌ lodash → 必要な関数のみインポート

UI/UX 設計
デザインシステム
typescript カラーパレット:

- Primary: Blue (#3b82f6)
- Secondary: Slate (#64748b)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)

タイポグラフィ:

- Font Family: システムフォント
- Heading: Bold, 2xl-4xl
- Body: Regular, base-lg
- Caption: Regular, sm-xs

間隔:

- Spacing Scale: 4px ベース
- Container: max-w-7xl
- Section Padding: py-12 md:py-16
  コンポーネント設計
  typescript 基本コンポーネント:
- Button
- Input
- Select
- Card
- Badge
- Modal
- Dropdown
- Skeleton

複合コンポーネント:

- LureCard
- MakerCard
- SearchBar
- FilterPanel
- LureDetail
- RecentLures
- ShaderBackground
  レスポンシブデザイン
  typescript ブレークポイント:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

グリッド:

- モバイル: 1 列
- タブレット: 2-3 列
- デスクトップ: 3-4 列

モバイル展開計画
技術選定
typescript 推奨: React Native + Expo

理由:
✅ Web コードの 70-80%再利用
✅ TypeScript 共有
✅ 1 人で全プラットフォーム開発可能
✅ Supabase 完全対応

```

### プロジェクト構造（モノレポ）
```

lure-database/
├── web/ # Next.js
├── mobile/ # React Native
├── shared/ # 共有コード
│ ├── types/
│ ├── api/
│ ├── utils/
│ └── constants/
└── supabase/ # DB 設定
共有可能なコード
typescript✅ 型定義（100%）
✅ API 関数（100%）
✅ ビジネスロジック（90%）
✅ ユーティリティ関数（100%）
✅ 定数（100%）
❌ UI コンポーネント（0%）
モバイル固有の考慮事項
typescript 追加機能:

- オフラインキャッシュ
- プッシュ通知
- カメラ連携（将来）
- 位置情報（釣り場マップ用、将来）

最適化:

- 小サイズ画像の使用
- API レスポンスの軽量化
- ページネーション必須

```

---

## 実装フェーズ

### Phase 1: Web版基盤構築（2-3週間）
```

Week 1:
□ Next.js + Supabase 初期設定
□ データベース構築
□ 画像ストレージ設定
□ 認証基盤（管理者のみ）
□ 基本レイアウト

Week 2:
□ ルアー一覧・詳細ページ
□ メーカー一覧・詳細ページ
□ 検索機能
□ フィルター機能
□ ページネーション

Week 3:
□ 閲覧履歴・検索履歴
□ SEO 最適化
□ パフォーマンス最適化
□ Cloudflare 設定
□ 動作確認・バグ修正

```

### Phase 2: 高度な機能（2-3週間）
```

Week 4:
□ シェーダーエフェクト実装
□ 管理画面（基本）
□ アクセス統計
□ 人気ルアーランキング

Week 5-6:
□ スクレイピング連携
□ データ投入
□ テスト・調整
□ ローンチ準備

```

### Phase 3: ユーザー機能（3-4週間）
```

□ ユーザー登録・ログイン
□ お気に入り機能
□ マイページ
□ コメント・レビュー
□ 通知機能

```

### Phase 4: サブスクリプション（2-3週間）
```

□ Stripe 統合
□ プラン管理
□ 有料機能実装
□ 決済フロー

```

### Phase 5: モバイルアプリ（2-3ヶ月）
```

Month 1:
□ React Native 環境構築
□ 共有コード分離
□ 基本画面実装

Month 2:
□ 全機能実装
□ オフライン対応
□ プッシュ通知

Month 3:
□ テスト
□ App Store 申請
□ Google Play 申請
□ リリース

```

---

## コスト試算

### 開発コスト
```

Web 版開発: 2-3 ヶ月
モバイル版開発: 2-3 ヶ月
合計: 5-6 ヶ月

人件費: $0（自己開発 + Claude）
ツール: Claude Pro $20/月

```

### 運用コスト（月額）

#### ローンチ時（無料〜小規模）
```

Vercel Hobby: $0
Supabase Free: $0
Cloudflare Free: $0
独自ドメイン: 約 ¥100/月（¥1,200/年）

合計: 約 ¥100/月

```

#### 本格運用時（1,000ユーザー想定）
```

Vercel Pro: $20/月
Supabase Pro: $25/月
Cloudflare Pro: $20/月（オプション）
独自ドメイン: 約 ¥100/月

合計: 約$45-65/月（約 ¥7,000-10,000/月）

```

#### モバイルアプリ公開時
```

上記 +
Apple Developer Program: $99/年
Google Play 登録: $25（一回のみ）
Expo EAS Build: $0-29/月

合計: 約$50-100/月

```

### スケーリング時（10,000ユーザー想定）
```

Vercel Pro: $20/月
Supabase Team: $599/月
Cloudflare Pro: $20/月

合計: 約$640/月（約 ¥96,000/月）

```

---

## リスクと対策

### 技術的リスク

| リスク | 影響 | 対策 |
|--------|------|------|
| スクレイピング先サイトの構造変更 | 高 | 定期的な監視、柔軟な設計 |
| パフォーマンス低下 | 中 | 継続的な監視、最適化 |
| Cloudflareの誤検知 | 中 | ホワイトリスト管理 |
| データベース容量超過 | 低 | 定期的なクリーンアップ |

### ビジネスリスク

| リスク | 影響 | 対策 |
|--------|------|------|
| 著作権問題 | 高 | 利用規約の明記、削除対応 |
| 競合サービス出現 | 中 | 差別化要素の強化 |
| ユーザー獲得難航 | 中 | SEO・SNS戦略 |

---

## 付録

### 参考リンク
```

Next.js: https://nextjs.org/
Supabase: https://supabase.com/
Vercel: https://vercel.com/
Cloudflare: https://www.cloudflare.com/
React Native: https://reactnative.dev/
Expo: https://expo.dev/

```

### 開発環境
```

Node.js: 18.x 以上
Package Manager: npm / yarn / pnpm
IDE: VS Code + Claude Code
Git: GitHub
チェックリスト
markdown□ Supabase プロジェクト作成
□ Vercel アカウント作成
□ Cloudflare アカウント作成
□ 独自ドメイン取得
□ GitHub リポジトリ作成
□ 環境変数設定
□ データベースマイグレーション
□ 画像ストレージ設定
□ Cloudflare DNS 設定
□ SSL 証明書設定

ドキュメントバージョン: 2.0
最終更新: 2025 年 11 月 12 日
