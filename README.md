# Lure Database (ルアーデータベース)

釣具メーカーの公式サイトから製品情報（ルアー・フック）を自動収集し、統一されたデータベースとして提供するWebサービス。

## 技術スタック

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **UI**: shadcn/ui
- **Deployment**: Vercel
- **Storage**: Supabase Storage
- **CDN**: Cloudflare

## 開発環境セットアップ

### 必要要件

- Node.js 20.9.0以上
- npm / yarn / pnpm

### インストール

```bash
# 依存パッケージのインストール
npm install

# 環境変数の設定
cp .env.local.example .env.local
# .env.localを編集してSupabaseの認証情報を設定
```

### Supabase設定

1. [Supabase](https://supabase.com/)でプロジェクトを作成
2. プロジェクトの設定から以下の情報を取得:
   - Project URL
   - Anon Key
   - Service Role Key
3. `.env.local`に認証情報を設定

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## プロジェクト構造

```
sls-web/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── v1/           # API v1エンドポイント
│   ├── lures/            # ルアーページ
│   ├── makers/           # メーカーページ
│   ├── hooks/            # フックページ（将来）
│   ├── search/           # 検索ページ
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # ホームページ
│   └── globals.css       # グローバルスタイル
├── components/            # Reactコンポーネント
│   └── ui/               # shadcn/ui コンポーネント
├── lib/                   # ユーティリティ関数
│   ├── supabase/         # Supabase クライアント
│   ├── utils.ts          # 共通ユーティリティ
│   └── constants.ts      # 定数定義
├── types/                 # TypeScript型定義
│   ├── database.ts       # データベース型
│   └── api.ts            # API型
├── hooks/                 # カスタムフック
├── public/                # 静的ファイル
├── middleware.ts          # Next.js Middleware（セキュリティ）
├── next.config.ts         # Next.js設定
├── tailwind.config.ts     # Tailwind CSS設定
├── tsconfig.json          # TypeScript設定
└── components.json        # shadcn/ui設定
```

## 主要機能

### Phase 1: 基本機能（現在）

- ✅ Next.js 15 + App Router セットアップ
- ✅ TypeScript + Tailwind CSS + shadcn/ui
- ✅ Supabase統合
- ✅ 環境変数設定
- ✅ セキュリティMiddleware
- ⏳ ルアー一覧・詳細表示
- ⏳ メーカー一覧・詳細表示
- ⏳ 検索・フィルター機能

### Phase 2: 高度な機能

- シェーダーエフェクト
- 管理画面
- アクセス統計
- スクレイピング連携

### Phase 3: ユーザー機能

- ユーザー登録・ログイン
- お気に入り機能
- マイページ

## スクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# Linting
npm run lint
```

## データベース

詳細なデータベース設計は [REQUIREMENTS_V2.md](./REQUIREMENTS_V2.md) を参照。

### 主要テーブル

- `lure_makers` - ルアーメーカー
- `lure_categories` - ルアーカテゴリー
- `lures` - ルアー
- `hook_makers` - フックメーカー
- `hooks` - フック
- `page_views` - ページビュー統計
- `search_logs` - 検索ログ

## デプロイ

### Vercel

```bash
# Vercelにデプロイ
vercel

# 本番デプロイ
vercel --prod
```

環境変数をVercelのプロジェクト設定で設定してください。

## ライセンス

Private Project

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
