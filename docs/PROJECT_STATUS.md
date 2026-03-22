# Salt Lure Storage (SLS) - プロジェクトドキュメント

## 1. プロジェクト概要

**サービス名:** Salt Lure Storage (SLS)
**URL:** https://salt-lure-storage.com
**概要:** シーバス用ソルトルアーのフックサイズ・スペックをメーカー横断で検索できるデータベースサイト
**技術スタック:** Next.js 16 + React 19 + TypeScript + Tailwind CSS + Supabase + Vercel + Cloudflare

## 2. ディレクトリ構成

```
sls-web/
├── app/
│   ├── layout.tsx                    # ルートレイアウト（メタデータ、GTM、フッター）
│   ├── page.tsx                      # TOPページ（ランキング表示、SSR）
│   ├── sitemap.ts                    # 動的サイトマップ生成
│   ├── globals.css                   # グローバルCSS
│   ├── lures/
│   │   ├── page.tsx                  # ルアー一覧（SSR + クライアント）
│   │   └── [slug]/
│   │       ├── page.tsx              # ルアー詳細（静的生成 + ISR 1時間）
│   │       └── loading.tsx           # スケルトンUI
│   ├── admin/
│   │   ├── layout.tsx                # 管理画面レイアウト（認証チェック、noindex）
│   │   ├── page.tsx                  # ダッシュボード
│   │   ├── login/page.tsx            # ログイン
│   │   ├── lures/
│   │   │   ├── page.tsx              # ルアー管理一覧
│   │   │   ├── new/page.tsx          # 新規作成
│   │   │   └── [id]/edit/page.tsx    # 編集
│   │   ├── analytics/page.tsx        # 閲覧ランキング・グラフ・集計
│   │   └── quality/page.tsx          # データ品質チェック
│   └── api/
│       ├── v1/
│       │   ├── lures/route.ts        # GET: ルアー一覧（検索・ページネーション）
│       │   ├── suggest/route.ts      # GET: 検索サジェスト
│       │   ├── rankings/route.ts     # GET: ランキング（月間/年間）
│       │   ├── views/route.ts        # POST: 閲覧記録（IP重複制御）
│       │   └── series/route.ts       # GET: シリーズ内ルアー
│       ├── admin/
│       │   ├── lures/route.ts        # GET/POST: ルアーCRUD
│       │   ├── lures/[id]/route.ts   # GET/PUT/DELETE: ルアー個別操作
│       │   ├── upload/route.ts       # POST: 画像アップロード
│       │   ├── options/              # メーカー・カテゴリー選択肢
│       │   └── analytics/            # 分析API群
│       └── proxy-image/route.ts      # 画像プロキシ（CORS回避）
├── components/
│   ├── organisms/                    # メインコンポーネント群
│   │   ├── Header.tsx                # ヘッダー（PC/モバイル切替）
│   │   ├── DetailPageHeader.tsx      # 詳細・TOPページ用ヘッダー
│   │   ├── SearchBar.tsx             # 検索バー（IME対応、履歴、サジェスト）
│   │   ├── LureCard.tsx              # ルアーカード（選択モード対応）
│   │   ├── LureListVirtual.tsx       # 仮想スクロール（ウィンドウ/コンテナ両対応）
│   │   ├── LureDetailImage.tsx       # 詳細画像（Three.js背景、動的import）
│   │   ├── LureDetailPanel.tsx       # 詳細パネル（横/縦レイアウト）
│   │   ├── LureDetailBackground/     # WebGL液状グラデーション背景
│   │   ├── LuresPageClient.tsx       # 一覧ページクライアント（マスターディテール）
│   │   ├── TopPageClient.tsx         # TOPページクライアント
│   │   ├── RankingCard.tsx           # ランキングカード
│   │   ├── RankingSectionStatic.tsx   # ランキングセクション（SSR）
│   │   ├── SeriesSection.tsx         # シリーズ表示
│   │   ├── MobileFooter.tsx          # モバイルフッター（Home/Lure/Other）
│   │   ├── ViewTracker.tsx           # 閲覧トラッキング（クライアント）
│   │   ├── LazyGTM.tsx              # GTM遅延読み込み（管理画面除外）
│   │   └── StickyHeader.tsx          # スクロール連動ヘッダー
│   ├── admin/                        # 管理画面コンポーネント
│   │   ├── AdminSidebar.tsx          # サイドバーナビ
│   │   ├── LureForm.tsx              # ルアー作成/編集フォーム
│   │   ├── ImageDropZone.tsx         # D&D画像アップロード
│   │   ├── DailyViewsChart.tsx       # 閲覧数推移グラフ（SVG）
│   │   └── BreakdownTables.tsx       # メーカー/シリーズ別集計
│   └── providers/
│       └── ReactQueryProvider.tsx    # TanStack Query設定
├── hooks/
│   ├── useLuresInfinite.ts           # 無限ページネーション
│   ├── useColorExtraction.ts         # 画像色抽出（DB優先、フォールバック）
│   ├── useThreeBackground.ts         # Three.js背景管理
│   ├── useTrackView.ts               # 閲覧トラッキング + GA4イベント
│   ├── useSearchHistory.ts           # 検索履歴（localStorage）
│   ├── useMediaQuery.ts              # レスポンシブ判定
│   └── useScrollDirection.ts         # スクロール方向検出
├── lib/
│   ├── supabase/
│   │   ├── server.ts                 # サーバー用（cookie依存）
│   │   ├── client.ts                 # ブラウザ用
│   │   └── static.ts                # ビルド時用（cookie不要）
│   ├── ga.ts                         # GA4イベント送信ユーティリティ
│   ├── colorUtils.ts                 # RGB/HSL変換
│   ├── colorCache.ts                 # 色データLRUキャッシュ
│   └── utils.ts                      # URL解析等
├── types/
│   └── database.ts                   # DB型定義（全テーブル）
├── scripts/
│   ├── import-lures.ts               # CSVルアーインポート
│   ├── extract-colors.ts             # 背景色バッチ抽出
│   └── ...                           # その他インポートスクリプト
├── supabase/migrations/              # DBマイグレーション
├── shaders/                          # Three.js シェーダー
├── middleware.ts                     # セキュリティ（スクレイパーブロック）
└── docs/
    ├── SEO.md                        # SEO対策まとめ
    └── PROJECT_STATUS.md             # このファイル
```

## 3. データベース設計

### テーブル

| テーブル | 用途 |
|---------|------|
| `lures` | ルアースペック（名前、フック、重さ、長さ等30+カラム） |
| `lure_makers` | メーカー情報 |
| `lure_categories` | カテゴリー（ミノー、バイブレーション等） |
| `page_views` | 閲覧記録（IPハッシュ、1日1回制限） |
| `hooks` | フック情報（将来用） |
| `hook_makers` | フックメーカー（将来用） |

### RPC関数

| 関数 | 用途 |
|------|------|
| `increment_view_count` | view_countインクリメント |
| `get_lure_rankings` | 期間別閲覧ランキング集計 |
| `get_daily_views` | 日別閲覧数集計 |
| `get_maker_rankings` | メーカー別閲覧数集計 |
| `get_series_rankings` | シリーズ別閲覧数集計 |

## 4. レスポンシブ設計（3段階）

| 幅 | レイアウト | 詳細表示 |
|----|-----------|---------|
| 768px未満 | モバイル | カードクリック → ページ遷移 |
| 768-1024px | マスターディテール | 左:一覧 右:詳細（縦並び） |
| 1024px以上 | マスターディテール | 左:一覧 右:詳細（横並び） |

## 5. 主要機能

### 一般ユーザー向け
- ルアー一覧検索（仮想スクロール、無限読み込み）
- ルアー詳細表示（スペック、WebGL背景、シリーズ関連）
- 検索サジェスト + 検索履歴（localStorage）
- 閲覧ランキング（TOPページ、月間/年間）
- モバイルフッター、PCヘッダーナビ

### 管理者向け（`/admin`、Supabase Auth認証）
- ルアーCRUD（作成、編集、削除）
- 画像アップロード（D&D、Supabase Storage）
- 閲覧ランキング・推移グラフ
- メーカー別・シリーズ別集計
- データ品質チェック（画像なし、シリーズ未設定、スペック未入力）

### SEO・パフォーマンス
- 静的生成（generateStaticParams + ISR 1時間）
- メタデータ最適化（title、description、OGP）
- Three.js動的import（初期バンドル分離）
- GTM遅延読み込み（3秒後）
- Vercel画像キャッシュ（1年TTL）

### トラッキング
- 自前page_viewsテーブル（IP重複制御）
- GA4カスタムイベント（view_lure、search_lure、click_series等）
- 管理画面はGA4除外

## 6. 外部サービス

| サービス | 用途 |
|---------|------|
| Supabase | DB、Auth、Storage |
| Vercel | ホスティング、ビルド |
| Cloudflare | DNS、CDN、Email Routing |
| Google Analytics 4 | アクセス分析 |
| Google Tag Manager | GTM-M2P73Z58 |
| Google Search Console | SEO管理 |

## 7. 環境変数

```
NEXT_PUBLIC_SUPABASE_URL        # Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Supabase匿名キー
SUPABASE_SERVICE_ROLE_KEY       # サービスロールキー（スクリプト用）
NEXT_PUBLIC_SITE_URL            # サイトURL
```

## 8. NPMスクリプト

```bash
npm run dev              # 開発サーバー（Turbopack）
npm run build            # 本番ビルド
npm run start            # 本番サーバー
npm run import:lures     # CSVルアーインポート
npm run extract:colors   # 背景色バッチ抽出
```

## 9. パフォーマンススコア（TOPページ）

| 指標 | スコア |
|------|--------|
| FCP | 0.8s |
| LCP | 1.8s |
| TBT | 110ms |
| CLS | 0.006 |

## 10. 今後の作業候補

- CSVインポートUIの管理画面化
- メーカー・カテゴリーのCRUD管理画面
- ルアーデータ登録数の増加（目下の最優先課題）
