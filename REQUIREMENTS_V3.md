# ルアーデータベース - 要件定義書 v3.0

**最終更新**: 2025 年 11 月 14 日  
**プロジェクト名**: Lure Database（ルアーデータベース）  
**バージョン**: 3.0（既存デザイン完全再現版）

---

## 📋 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [既存プロジェクト（移植元）](#既存プロジェクト移植元)
3. [デザイン完全再現の原則](#デザイン完全再現の原則)
4. [技術スタック](#技術スタック)
5. [Vue.js vs Next.js 実装差異](#vuejs-vs-nextjs-実装差異)
6. [コンポーネント設計](#コンポーネント設計)
7. [データベース設計](#データベース設計)
8. [URL 設計とセキュリティ](#url設計とセキュリティ)
9. [機能要件](#機能要件)
10. [パフォーマンス最適化](#パフォーマンス最適化)
11. [UI/UX 設計](#uiux設計)
12. [モバイル展開計画](#モバイル展開計画)
13. [実装フェーズ](#実装フェーズ)
14. [コスト試算](#コスト試算)

---

## プロジェクト概要

### 目的

釣具メーカーの公式サイトから製品情報（ルアー・フック）を自動収集し、統一されたデータベースとして提供する。ユーザーがルアーを簡単に検索・比較できる Web サービス、および将来的にモバイルアプリを構築する。

**🎯 最重要目標：既存 Vue.js プロジェクトのデザイン・UI/UX を Next.js でピクセルパーフェクトに完全再現**

### 主要機能

- ルアー・メーカーの検索と閲覧
- 詳細フィルター機能（カテゴリー、サイズ、重量、レンジ）
- 閲覧履歴と検索履歴の管理
- フックデータベース（将来実装）
- ユーザーアカウント機能（第 2 フェーズ）
- サブスクリプション機能（第 3 フェーズ）

### 差別化要素

- **ビジュアル体験**: シェーダーエフェクトを使った独自の背景演出
- **高速パフォーマンス**: Lighthouse Score 95+目標
- **スクレイピング対策**: 多層防御による堅牢なシステム
- **クロスプラットフォーム**: Web・iOS・Android で同一データベース
- **既存デザインの完全継承**: 使い慣れた UI をそのまま提供

---

## 既存プロジェクト（移植元）

### ローカルパス（最優先参照）

```
/Applications/MAMP/htdocs/Laravel/sll_web
```

### GitHub リポジトリ（バックアップ参照）

```
https://github.com/masahiro0813kato/sll_web
```

### 技術スタック

- **フレームワーク**: Laravel + Inertia.js
- **フロントエンド**: Vue 3 + Composition API
- **スタイリング**: Tailwind CSS + SCSS (Scoped Styles)
- **データベース**: MySQL (MAMP)

### デザインコンセプト

- **ダークテーマ**: 背景色 `#2a262f`
- **モバイルファースト**: スマートフォン専用デザイン
- **シンプル UI**: 直感的で迷わないナビゲーション
- **mix-blend-mode 効果**: ヘッダーの反転エフェクト
- **滑らかなアニメーション**: 背景ズーム、トランジション

### 参照すべき主要ファイル

```
📁 /Applications/MAMP/htdocs/Laravel/sll_web/resources/js/

主要ページ（最重要）:
├── Pages/
│   ├── Lures/
│   │   ├── Index.vue          # ルアー一覧ページ ⭐⭐⭐⭐⭐
│   │   └── Show.vue           # ルアー詳細ページ ⭐⭐⭐⭐⭐
│   └── LureMakers/
│       └── Index.vue          # メーカー一覧ページ ⭐⭐⭐

主要コンポーネント（最重要）:
├── Components/
│   ├── LureList.vue           # ルアーカードリスト ⭐⭐⭐⭐⭐
│   ├── InputSearch.vue        # 検索バー・サジェスト ⭐⭐⭐⭐⭐
│   └── Pagination.vue         # ページネーション ⭐⭐⭐

レイアウト（最重要）:
└── Layouts/
    └── Header.vue             # ヘッダー ⭐⭐⭐⭐⭐

スタイル:
└── app.css                    # Tailwind設定
```

---

## デザイン完全再現の原則

### 🎨 最重要要件

**CRITICAL: すべての実装は既存 Vue.js プロジェクトのデザインを 100%再現することを最優先とします。**

#### デザイン再現の優先順位

```
1. 既存Vue.jsデザイン（最優先）
   ↓
2. 本要件定義書（REQUIREMENTS_V3.md）の仕様
   ↓
3. Next.js/Reactのベストプラクティス
   ↓
4. パフォーマンス最適化
```

**重要**: デザイン再現とベストプラクティスが競合する場合、**デザイン再現を優先**。ただし、セキュリティに関わる部分は例外。

---

### 再現すべき要素（優先度順）

#### 1. レイアウト構造 ⭐⭐⭐⭐⭐

- HTML 構造の忠実な移植
- 要素の配置・サイズ・スペーシング（ピクセル単位）
- Flexbox・Grid レイアウトの完全一致
- レスポンシブブレークポイント

#### 2. ビジュアルデザイン ⭐⭐⭐⭐⭐

- **カラーパレット**（完全一致）
  - 背景: `#2a262f`（メイン）、`#3b3541`（セカンダリ）
  - テキスト: `#ffffff`、`#bdbdbd`、`#828282`
  - ボーダー: `rgba(130, 130, 130, 0.5)`
- **フォントサイズ・行間**（完全一致）
- **ボーダー・角丸・シャドウ**

#### 3. アニメーション・トランジション ⭐⭐⭐⭐

- ホバー効果（`active:opacity-80`）
- ページ遷移
- 背景ズーム効果（ルアー詳細の 20 秒アニメーション）
- サジェストオーバーレイの表示/非表示（0.2s ease）
- スクロール制御

#### 4. インタラクション ⭐⭐⭐⭐⭐

- クリック・タップのフィードバック
- スクロール動作
- フォーム入力体験
- 検索サジェストの挙動
- More View ボタンの無限スクロール

#### 5. レスポンシブ動作 ⭐⭐⭐⭐

- モバイル表示（最優先、既存は完全モバイル専用）
- タブレット表示（追加実装）
- デスクトップ表示（追加実装）

---

### 再現方法

#### 推奨ワークフロー

```typescript
// ステップ1: 既存Vue.jsファイルを開く
// /Applications/MAMP/htdocs/Laravel/sll_web/resources/js/Components/LureList.vue

// ステップ2: HTML構造を確認
<div class="card card_lure">
  <div class="card_lure__textArea">...</div>
  <div class="card_lure__imgArea">...</div>
</div>

// ステップ3: スタイルを確認
<style scoped lang="scss">
.card_lure {
  background-color: #fff;
  border-radius: 0.5rem;

  &__textArea {
    padding: 1rem;
  }
}
</style>

// ステップ4: Next.jsで忠実に再現
export default function LureCard() {
  return (
    <div className="bg-white rounded-lg">
      <div className="p-4">...</div>
      <div className="w-1/3">...</div>
    </div>
  )
}
```

---

### 検証方法

#### スクリーンショット比較

```bash
# 1. 既存Vue.jsアプリのスクリーンショットを撮影
# - http://localhost:8000/lures （一覧ページ）
# - http://localhost:8000/lures/1 （詳細ページ）

# 2. 新Next.jsアプリのスクリーンショットを撮影
# - http://localhost:3000/lures
# - http://localhost:3000/lures/1-a3k9x

# 3. 画像比較ツールで重ねて確認
# - ピクセル単位での差異をチェック
# - レイアウトのずれを確認
# - 色の違いを確認
```

---

## 技術スタック

### フロントエンド

```typescript
- Next.js 15 (App Router)
- TypeScript
- React 18
- Tailwind CSS
- shadcn/ui (UIコンポーネント)
- Three.js + React Three Fiber (シェーダー用)
```

### バックエンド

```typescript
- Next.js API Routes
- Supabase (PostgreSQL)
- Supabase Auth (認証)
- Supabase Storage (画像保存)
```

### インフラ

```typescript
- Vercel (ホスティング)
- Cloudflare (CDN + セキュリティ)
- Supabase Cloud (データベース)
```

### 開発ツール

```typescript
- Claude Code (AI開発支援)
- Git + GitHub
- ESLint + Prettier
```

### 将来のモバイル開発

```typescript
- React Native + Expo
- 共有コードベース (70-80%)
```

---

## Vue.js vs Next.js 実装差異

### 完全再現可能な機能 ✅

| 機能               | Vue.js 実装           | Next.js 実装             | 難易度  |
| ------------------ | --------------------- | ------------------------ | ------- |
| **レイアウト**     | `<template>`          | JSX                      | 🟢 簡単 |
| **スタイリング**   | Scoped CSS            | Tailwind CSS             | 🟢 簡単 |
| **状態管理**       | `ref()`, `reactive()` | `useState()`             | 🟢 簡単 |
| **ルーティング**   | Inertia.js `<Link>`   | Next.js `<Link>`         | 🟢 簡単 |
| **画像表示**       | `<img>`               | Next.js `<Image>`        | 🟢 簡単 |
| **アニメーション** | CSS Keyframes         | CSS Keyframes / Tailwind | 🟢 簡単 |

---

### 実装差異の詳細と代替案

#### 1. `mix-blend-mode: difference`（ヘッダー）

**Vue.js 実装:**

```vue
<style>
header {
  mix-blend-mode: difference;
}
</style>
```

**Next.js 実装:**

```typescript
// ✅ 完全再現可能
<header className="mix-blend-difference">...</header>
```

**結論**: 🟢 完全再現可能（CSS プロパティはそのまま使用可能）

---

#### 2. 背景ズームアニメーション（ルアー詳細）

**Vue.js 実装:**

```vue
<style>
@keyframes zoom {
  0% {
    background-size: 400%;
    background-position: 20% 48%;
  }
  50% {
    background-size: 600%;
    background-position: 40% 52%;
  }
  100% {
    background-size: 400%;
    background-position: 20% 48%;
  }
}

.lureShow_image::after {
  animation: zoom 20s linear infinite;
}
</style>
```

**Next.js 実装（推奨: CSS Keyframes）:**

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      keyframes: {
        zoom: {
          '0%, 100%': {
            backgroundSize: '400%',
            backgroundPosition: '20% 48%'
          },
          '50%': {
            backgroundSize: '600%',
            backgroundPosition: '40% 52%'
          },
        },
      },
      animation: {
        zoom: 'zoom 20s linear infinite',
      },
    },
  },
}

// Component
<div className="animate-zoom" style={{ backgroundImage: `url(...)` }} />
```

**結論**: 🟢 完全再現可能（既存実装に最も近い方法）

---

#### 3. サジェストオーバーレイのスクロール制御

**Vue.js 実装:**

```vue
<script setup>
const scroll_control = (event) => {
  event.preventDefault();
};

const toggleStatus = () => {
  if (isShow.value === true) {
    document.addEventListener("mousewheel", scroll_control, { passive: false });
    document.addEventListener("touchmove", scroll_control, { passive: false });
  } else {
    document.removeEventListener("mousewheel", scroll_control);
    document.removeEventListener("touchmove", scroll_control);
  }
};
</script>
```

**Next.js 実装:**

```typescript
'use client';
import { useEffect } from 'react';

function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // スクロール無効化
      document.body.style.overflow = 'hidden';
    } else {
      // スクロール有効化
      document.body.style.overflow = 'unset';
    }

    // クリーンアップ
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (...)
}
```

**結論**: 🟢 完全再現可能（方法は異なるが、結果は同じ）

---

#### 4. `v-html`（改行を含むテキスト表示）

**Vue.js 実装:**

```vue
<script setup>
import nl2br from "@/common";
const lure_info = props.lure.lure_infomation;
</script>

<template>
  <div v-html="nl2br(lure_info)"></div>
</template>
```

**Next.js 実装:**

```typescript
function nl2br(text: string): string {
  return text.replace(/\n/g, "<br />");
}

export default function LureDetail({ lure }: { lure: Lure }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: nl2br(lure.lure_information),
      }}
    />
  );
}
```

**セキュリティ注意**:

- データベースから取得したデータのみ使用
- ユーザー入力は使用しない（XSS 対策）

**結論**: 🟢 完全再現可能

---

#### 5. Inertia.js の `<Link>` コンポーネント

**Vue.js 実装:**

```vue
<Link :href="route('lures.show', { lure: lure.id })" class="card">
  ...
</Link>
```

**Next.js 実装:**

```typescript
import Link from "next/link";

<Link
  href={`/lures/${lure.id}-${lure.url_code}`}
  className="card"
  prefetch={true} // ← Inertia.jsと同等の効果
>
  ...
</Link>;
```

**差異**:

- URL を直接指定する必要がある
- `prefetch={true}` でプリフェッチング可能
- パフォーマンスは同等以上

**結論**: 🟡 代替案で完全カバー可能

---

#### 6. Scoped CSS → Tailwind CSS

**Vue.js 実装:**

```vue
<style scoped lang="scss">
.card_lure {
  background-color: #fff;
  border-radius: 0.5rem;

  &__textArea {
    padding: 1rem;
  }

  &__makerName {
    font-size: 0.875rem;
  }
}
</style>
```

**Next.js 実装（Tailwind CSS）:**

```typescript
<div className="bg-white rounded-lg">
  <div className="p-4">
    <div className="text-sm">...</div>
  </div>
</div>
```

**Tailwind 設定で既存の値を完全一致**:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        "background-primary": "#2a262f",
        "background-secondary": "#3b3541",
        "text-tertiary": "#828282",
      },
      fontSize: {
        "maker-sm": "0.875rem",
      },
    },
  },
};
```

**結論**: 🟢 Tailwind CSS で完全再現可能

---

#### 7. `v-for` ディレクティブ

**Vue.js 実装:**

```vue
<div v-for="lure in luresArray" :key="lure.id">
  <LureCard :lure="lure" />
</div>
```

**Next.js 実装:**

```typescript
{
  lures.map((lure) => <LureCard key={lure.id} lure={lure} />);
}
```

**結論**: 🟢 完全再現可能

---

### 実装差異まとめ

| 機能             | 再現性  | 方法          |
| ---------------- | ------- | ------------- |
| テンプレート構文 | 🟢 100% | JSX に変換    |
| Scoped CSS       | 🟢 100% | Tailwind CSS  |
| リアクティブ     | 🟢 100% | `useState()`  |
| ライフサイクル   | 🟢 100% | `useEffect()` |
| ルーティング     | 🟡 95%  | URL 直接指定  |
| アニメーション   | 🟢 100% | CSS Keyframes |

**結論: すべての機能を Next.js で完全再現可能です！**

---

## コンポーネント設計

### 設計原則

#### 1. Atomic Design（推奨）

```
src/components/
├── atoms/          # 最小単位
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Image.tsx
├── molecules/      # atoms の組み合わせ
│   ├── SearchInput.tsx
│   ├── LureSpecItem.tsx
│   └── HookDisplay.tsx
├── organisms/      # molecules + atoms の組み合わせ
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   ├── LureCard.tsx
│   └── LureDetailPanel.tsx
└── templates/      # organisms のレイアウト
    ├── LureListTemplate.tsx
    └── LureDetailTemplate.tsx
```

#### 2. 責任の分離

**原則**:

- 1 コンポーネント = 1 責務
- ビジネスロジックと UI の分離
- 再利用可能な粒度で設計

#### 3. Props 設計

**原則**:

- 必要最小限の Props のみ渡す
- 複雑なオブジェクトは型定義
- デフォルト値を設定

---

### 既存 Vue.js コンポーネントの対応表

| Vue.js コンポーネント | Next.js コンポーネント             | 粒度     | 分割方針       |
| --------------------- | ---------------------------------- | -------- | -------------- |
| `Header.vue`          | `organisms/Header.tsx`             | Organism | そのまま移植   |
| `InputSearch.vue`     | `organisms/SearchBar.tsx`          | Organism | 以下に分割：   |
|                       | `molecules/SearchInput.tsx`        | Molecule | 入力フィールド |
|                       | `molecules/SearchSuggest.tsx`      | Molecule | サジェスト一覧 |
|                       | `atoms/SearchIcon.tsx`             | Atom     | アイコン       |
| `LureList.vue`        | `organisms/LureList.tsx`           | Organism | コンテナ       |
|                       | `organisms/LureCard.tsx`           | Organism | カード 1 枚    |
|                       | `molecules/LureInfo.tsx`           | Molecule | テキスト情報   |
|                       | `molecules/HookDisplay.tsx`        | Molecule | フック表示     |
| `Show.vue`            | `templates/LureDetailTemplate.tsx` | Template | レイアウト     |
|                       | `organisms/LureDetailImage.tsx`    | Organism | 画像セクション |
|                       | `organisms/LureDetailInfo.tsx`     | Organism | 情報セクション |

---

### 詳細コンポーネント設計

#### 1. Header（ヘッダー）

**参照**: `/Applications/MAMP/htdocs/Laravel/sll_web/resources/js/Layouts/Header.vue`

**実装**:

```typescript
// components/organisms/Header.tsx
export default function Header() {
  return (
    <header className="fixed top-0 w-full p-4 z-[1000] mix-blend-difference">
      <div className="logo">
        <Link href="/lures">
          <Image
            src="/images/common/logo-sll.svg"
            alt="SLL Logo"
            width={120}
            height={40}
            priority
          />
        </Link>
      </div>
    </header>
  );
}
```

---

#### 2. SearchBar（検索バー）

**参照**: `/Applications/MAMP/htdocs/Laravel/sll_web/resources/js/Components/InputSearch.vue`

**分割**:

```
SearchBar (Organism)
├── SearchInput (Molecule)
└── SearchSuggest (Molecule)
    └── SuggestItem (Molecule)
```

**実装**:

```typescript
// components/organisms/SearchBar.tsx
"use client";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Lure[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // スクロール制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length === 0) {
      setSuggestions([]);
      return;
    }
    const { data } = await suggestLures(value);
    setSuggestions(data || []);
  };

  return (
    <div className="relative w-full px-4 py-4">
      <SearchInput
        value={query}
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
        onClear={() => setQuery("")}
      />

      {isOpen && (
        <SearchSuggest
          suggestions={suggestions}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
```

---

#### 3. LureCard（ルアーカード）

**参照**: `/Applications/MAMP/htdocs/Laravel/sll_web/resources/js/Components/LureList.vue`（LureCard 部分）

**実装**:

```typescript
// components/organisms/LureCard.tsx
interface LureCardProps {
  lure: Lure & { lure_makers: LureMaker };
}

export default function LureCard({ lure }: LureCardProps) {
  return (
    <Link
      href={`/lures/${lure.id}-${lure.url_code}`}
      className="flex justify-between items-center bg-white rounded-lg p-4 
                 active:opacity-80 transition-opacity"
    >
      <div className="flex-1">
        {/* タイトルエリア */}
        <div className="pb-2 border-b border-[#828282]/50">
          <div className="text-sm leading-none mb-2">
            {lure.lure_makers.lure_maker_name_en}
          </div>
          <h2 className="text-base leading-tight mb-1">{lure.lure_name_ja}</h2>
          <div className="text-xs text-[#828282] leading-tight">
            {lure.lure_name_en}
          </div>
        </div>

        {/* フック・リング情報 */}
        <div className="mt-2 flex gap-4 text-sm leading-none">
          <div>
            <span className="text-xs font-bold text-[#828282]">H：</span>
            {lure.attached_hook_size_1}
          </div>
          {lure.attached_ring_size && (
            <div>
              <span className="text-xs font-bold text-[#828282]">R：</span>
              {lure.attached_ring_size}
            </div>
          )}
        </div>
      </div>

      {/* 画像エリア */}
      <div className="w-1/3 min-w-[120px]">
        <Image
          src={`/images/lures_tmb/${lure.lure_tmb_image}.webp`}
          alt={lure.lure_name_ja}
          width={120}
          height={80}
          className="w-full h-auto object-cover"
        />
      </div>
    </Link>
  );
}
```

---

#### 4. LureDetail（ルアー詳細）

**参照**: `/Applications/MAMP/htdocs/Laravel/sll_web/resources/js/Pages/Lures/Show.vue`

**実装**:

```typescript
// app/lures/[slug]/page.tsx (Server Component)
export default async function LureDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const parsed = parseLureUrl(params.slug);
  if (!parsed) notFound();

  const { data: lure } = await getLureById(parsed.id, parsed.code);
  if (!lure) notFound();

  return (
    <main>
      {/* 画像セクション */}
      <section className="relative w-full flex justify-center bg-white">
        {/* ぼかし背景 */}
        <div className="absolute inset-0 z-[1] backdrop-blur-[30px]" />
        <div
          className="absolute inset-0 z-[1] opacity-35 
                     animate-zoom brightness-[130%] saturate-[400%]"
          style={{
            backgroundImage: `url(/images/lures_main/${lure.lure_main_image}.webp)`,
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* メイン画像 */}
        <Image
          src={`/images/lures_main/${lure.lure_main_image}.webp`}
          alt={lure.lure_name_ja}
          width={800}
          height={600}
          className="relative z-10 w-4/5 h-auto"
          priority
        />
      </section>

      {/* データセクション */}
      <section className="relative bg-[#2a262f] z-50 p-8 text-white">
        {/* タイトル */}
        <div className="pb-8">
          <div className="text-xl leading-none mb-6">
            {lure.lure_makers.lure_maker_name_en}
          </div>
          <h1 className="text-[1.6rem] leading-tight">{lure.lure_name_ja}</h1>
          <div className="text-base text-[#bdbdbd] leading-tight">
            {lure.lure_name_en}
          </div>
        </div>

        {/* スペックエリア */}
        <div className="border-y border-[#828282]/50 py-8 mb-8">
          {/* Type */}
          <div className="mb-8">
            <h2 className="text-sm text-[#828282] mb-2">Type</h2>
            <div className="text-xl">
              {lure.lure_categories?.category_name_ja}
            </div>
            <div className="text-sm text-[#bdbdbd]">{lure.lure_action}</div>
          </div>

          {/* スペックグリッド */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-8">
            <div>
              <h2 className="text-sm text-[#828282] mb-2">Length</h2>
              <div className="text-xl">
                {lure.lure_length}
                <span className="text-sm">mm</span>
              </div>
            </div>
            {/* 他のスペック項目... */}
          </div>
        </div>

        {/* 説明文 */}
        <div
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: lure.lure_information.replace(/\n/g, "<br />"),
          }}
        />
      </section>
    </main>
  );
}
```

---

### ディレクトリ構造

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── lures/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── makers/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
│
├── components/
│   ├── atoms/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── SearchIcon.tsx
│   ├── molecules/
│   │   ├── SearchInput.tsx
│   │   ├── SearchSuggest.tsx
│   │   ├── LureInfo.tsx
│   │   └── HookDisplay.tsx
│   ├── organisms/
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── LureCard.tsx
│   │   └── LureList.tsx
│   └── templates/
│       ├── LureListTemplate.tsx
│       └── LureDetailTemplate.tsx
│
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── types.ts
│
└── public/
    └── images/
```

---

## データベース設計

### テーブル構成

#### 1. lure_makers（ルアーメーカー）

```sql
CREATE TABLE lure_makers (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,                -- 'ima', 'daiwa'
  lure_maker_name_ja TEXT NOT NULL,
  lure_maker_name_en TEXT NOT NULL,
  lure_maker_logo_image TEXT,               -- 'maker_logo_1.webp'
  lure_maker_ref_url TEXT,
  description TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lure_makers_slug ON lure_makers(slug);
```

#### 2. lure_categories（ルアーカテゴリー）

```sql
CREATE TABLE lure_categories (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,                -- 'floating-minnow'
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

#### 3. lures（ルアー）

```sql
CREATE TABLE lures (
  id BIGSERIAL PRIMARY KEY,
  url_code TEXT UNIQUE NOT NULL,            -- 'a3k9x' (ランダム5文字)
  scraping_source_id TEXT,                  -- 'ima-product-62' (内部管理用)

  lure_maker_id BIGINT REFERENCES lure_makers(id) ON DELETE CASCADE,
  lure_category_id BIGINT REFERENCES lure_categories(id),

  lure_name_ja TEXT NOT NULL,
  lure_name_en TEXT NOT NULL,
  lure_main_image TEXT,                     -- 'lure_main_1.webp'
  lure_tmb_image TEXT,                      -- 'lure_tmb_1.webp'
  lure_tmb_small TEXT,                      -- モバイル用
  lure_tmb_medium TEXT,                     -- タブレット用

  attached_hook_size_1 TEXT,
  attached_hook_size_2 TEXT,
  attached_hook_size_3 TEXT,
  attached_hook_size_4 TEXT,
  attached_hook_size_5 TEXT,
  attached_ring_size TEXT,

  lure_buoyancy TEXT,
  lure_shape TEXT,
  lure_action TEXT,

  lure_length NUMERIC(4,1),                 -- mm
  lure_weight NUMERIC(5,2),                 -- g
  lure_range_min NUMERIC(5,1),              -- cm
  lure_range_max NUMERIC(5,1),              -- cm

  lure_ref_url TEXT UNIQUE,

  target_fish_1 TEXT,
  target_fish_2 TEXT,
  target_fish_3 TEXT,
  target_fish_4 TEXT,
  target_fish_5 TEXT,

  lure_information TEXT,

  -- シェーダー用の主要色はクライアント側で動的に抽出（DBには保存しない）

  view_count INT DEFAULT 0,
  data_version INT DEFAULT 1,               -- モバイルキャッシュ管理用

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

#### 4-7. その他のテーブル

- **hook_makers**: フックメーカー
- **hooks**: フック商品
- **lure_hook_relations**: ルアー × フック関連
- **アクセス解析テーブル**: ページビュー、検索ログ
- **ユーザー関連テーブル**（第 2 フェーズ）

※詳細は元の REQUIREMENTS_V2.md を参照

---

## データ移行（マイグレーション）

### 概要

スクレイピングプロジェクトで収集した Google スプレッドシートのデータを、Web アプリ用の Supabase PostgreSQL データベースに移行します。

### 移行元：Google スプレッドシート

**スプレッドシート URL:**

```
https://docs.google.com/spreadsheets/d/1hpoRN7SQIEt-2rZ6LPeLQgWTY3YtMfjxGchn7tz2Jwk/edit?usp=sharing
```

**シート構成:**

1. `lure` - ルアーデータ
2. `lure_maker` - メーカーデータ
3. `lure_category` - カテゴリーデータ

---

### フィールドマッピング

#### 1. lure_makers（メーカー）

| スプレッドシート        | Supabase                | 変換処理                                 |
| ----------------------- | ----------------------- | ---------------------------------------- |
| `id` (bigInt)           | `id` (BIGSERIAL)        | そのまま                                 |
| （なし）                | `slug` (TEXT)           | `lure_maker_name_en`から生成（小文字化） |
| `lure_maker_name_ja`    | `lure_maker_name_ja`    | そのまま                                 |
| `lure_maker_name_en`    | `lure_maker_name_en`    | そのまま                                 |
| `lure_maker_logo_image` | `lure_maker_logo_image` | `.webp`拡張子を追加                      |
| `lure_maker_ref_url`    | `lure_maker_ref_url`    | そのまま                                 |
| （なし）                | `description`           | NULL                                     |
| `is_available`          | `is_available`          | そのまま                                 |
| `created_at`            | `created_at`            | そのまま                                 |
| `updated_at`            | `updated_at`            | そのまま                                 |

**変換例:**

```typescript
// slug生成
const slug = row.lure_maker_name_en.toLowerCase().replace(/\s+/g, "-");
// 例: "ima" → "ima", "DAIWA" → "daiwa"
```

---

#### 2. lure_categories（カテゴリー）

| スプレッドシート        | Supabase           | 変換処理                   |
| ----------------------- | ------------------ | -------------------------- |
| `id` (bigInt)           | `id` (BIGSERIAL)   | そのまま                   |
| （なし）                | `slug` (TEXT)      | `category_name_ja`から生成 |
| `lure_category_name_ja` | `category_name_ja` | そのまま                   |
| `lure_category_name_en` | `category_name_en` | そのまま                   |
| （なし）                | `description`      | NULL                       |
| （なし）                | `display_order`    | ID をそのまま使用          |
| `is_visible`            | `is_visible`       | そのまま                   |
| `created_at`            | `created_at`       | そのまま                   |

**変換例:**

```typescript
// slug生成ルール
const slugMap = {
  フローティングミノー: "floating-minnow",
  トップウォーター: "topwater",
  シンキングペンシル: "sinking-pencil",
  スピンテールジグ: "spintail-jig",
  メタルバイブレーション: "metal-vibration",
  リップレスミノー: "lipless-minnow",
  サスペンドシャッド: "suspend-shad",
  バイブレーション: "vibration",
};
```

---

#### 3. lures（ルアー）

| スプレッドシート         | Supabase                    | 変換処理                     |
| ------------------------ | --------------------------- | ---------------------------- |
| `id` (bigInt)            | `id` (BIGSERIAL)            | そのまま                     |
| `external_id` (string)   | `scraping_source_id` (TEXT) | そのまま（例: "ima-62"）     |
| （なし）                 | `url_code` (TEXT)           | ランダム 5 文字生成          |
| `lure_maker_id` (string) | `lure_maker_id` (BIGINT)    | メーカー slug から ID に変換 |
| `lure_category` (string) | `lure_category_id` (BIGINT) | カテゴリー名から ID に変換   |
| `lure_name_ja`           | `lure_name_ja`              | そのまま                     |
| `lure_name_en`           | `lure_name_en`              | そのまま                     |
| `lure_main_image`        | `lure_main_image`           | `.webp`拡張子を追加          |
| `lure_tmb_image`         | `lure_tmb_image`            | `.webp`拡張子を追加          |
| （なし）                 | `lure_tmb_small`            | NULL（後で生成）             |
| （なし）                 | `lure_tmb_medium`           | NULL（後で生成）             |
| `attached_hook_size_1`   | `attached_hook_size_1`      | そのまま                     |
| `attached_hook_size_2`   | `attached_hook_size_2`      | そのまま                     |
| `attached_hook_size_3`   | `attached_hook_size_3`      | そのまま                     |
| `attached_hook_size_4`   | `attached_hook_size_4`      | そのまま                     |
| `attached_hook_size_5`   | `attached_hook_size_5`      | そのまま                     |
| `attached_ring_size`     | `attached_ring_size`        | そのまま                     |
| `lure_buoyancy`          | `lure_buoyancy`             | そのまま                     |
| `lure_shape`             | `lure_shape`                | そのまま                     |
| `lure_action`            | `lure_action`               | そのまま                     |
| `lure_length`            | `lure_length`               | そのまま                     |
| `lure_weight`            | `lure_weight`               | そのまま                     |
| `lure_range_min`         | `lure_range_min`            | そのまま                     |
| `lure_range_max`         | `lure_range_max`            | そのまま                     |
| `lure_ref_url`           | `lure_ref_url`              | そのまま                     |
| `target_fish_1`          | `target_fish_1`             | そのまま                     |
| `target_fish_2`          | `target_fish_2`             | そのまま                     |
| `target_fish_3`          | `target_fish_3`             | そのまま                     |
| `target_fish_4`          | `target_fish_4`             | そのまま                     |
| `target_fish_5`          | `target_fish_5`             | そのまま                     |
| `lure_information`       | `lure_information`          | そのまま                     |
| （なし）                 | `view_count`                | 0 で初期化                   |
| （なし）                 | `data_version`              | 1 で初期化                   |
| `is_available`           | `is_available`              | そのまま                     |
| `created_at`             | `created_at`                | そのまま                     |
| `updated_at`             | `updated_at`                | そのまま                     |

---

### マイグレーションスクリプト

#### 実装例（TypeScript + Node.js）

```typescript
// scripts/migrate-from-sheets.ts
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Googleスプレッドシート認証
const auth = new google.auth.GoogleAuth({
  keyFile: "./config/credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = "1hpoRN7SQIEt-2rZ6LPeLQgWTY3YtMfjxGchn7tz2Jwk";

// URL Code生成
function generateUrlCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 5 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// Slug生成
function generateSlug(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-");
}

async function main() {
  console.log("🚀 マイグレーション開始...");

  // ===================================
  // 1. メーカーデータの移行
  // ===================================
  console.log("\n📦 1/3: メーカーデータを移行中...");

  const makersResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "lure_maker!A2:Z",
  });

  const makersData = makersResponse.data.values || [];
  const makerIdMap = new Map<string, number>(); // slug → id

  for (const row of makersData) {
    const [
      id,
      name_ja,
      name_en,
      logo_image,
      ref_url,
      is_available,
      created_at,
      updated_at,
    ] = row;

    const slug = generateSlug(name_en);

    const { data: maker, error } = await supabase
      .from("lure_makers")
      .insert({
        slug: slug,
        lure_maker_name_ja: name_ja,
        lure_maker_name_en: name_en,
        lure_maker_logo_image: logo_image ? `${logo_image}.webp` : null,
        lure_maker_ref_url: ref_url || null,
        description: null,
        is_available: is_available === "TRUE",
        created_at: created_at,
        updated_at: updated_at,
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ メーカー挿入エラー: ${name_en}`, error);
      continue;
    }

    makerIdMap.set(slug, maker.id);
    console.log(`✅ ${name_en} (slug: ${slug}) → ID: ${maker.id}`);
  }

  // ===================================
  // 2. カテゴリーデータの移行
  // ===================================
  console.log("\n📦 2/3: カテゴリーデータを移行中...");

  const categorySlugMap = {
    フローティングミノー: "floating-minnow",
    トップウォーター: "topwater",
    シンキングペンシル: "sinking-pencil",
    スピンテールジグ: "spintail-jig",
    メタルバイブレーション: "metal-vibration",
    リップレスミノー: "lipless-minnow",
    サスペンドシャッド: "suspend-shad",
    バイブレーション: "vibration",
  };

  const categoriesResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "lure_category!A2:Z",
  });

  const categoriesData = categoriesResponse.data.values || [];
  const categoryIdMap = new Map<string, number>(); // name_ja → id

  for (const row of categoriesData) {
    const [id, name_ja, name_en, is_visible, created_at, updated_at] = row;

    const slug = categorySlugMap[name_ja as keyof typeof categorySlugMap];

    const { data: category, error } = await supabase
      .from("lure_categories")
      .insert({
        slug: slug,
        category_name_ja: name_ja,
        category_name_en: name_en,
        description: null,
        display_order: parseInt(id),
        is_visible: is_visible === "TRUE",
        created_at: created_at,
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ カテゴリー挿入エラー: ${name_ja}`, error);
      continue;
    }

    categoryIdMap.set(name_ja, category.id);
    console.log(`✅ ${name_ja} (slug: ${slug}) → ID: ${category.id}`);
  }

  // ===================================
  // 3. ルアーデータの移行
  // ===================================
  console.log("\n📦 3/3: ルアーデータを移行中...");

  const luresResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "lure!A2:Z",
  });

  const luresData = luresResponse.data.values || [];
  let successCount = 0;
  let errorCount = 0;

  for (const row of luresData) {
    const [
      id,
      external_id,
      maker_slug,
      name_ja,
      name_en,
      main_image,
      tmb_image,
      hook_1,
      hook_2,
      hook_3,
      hook_4,
      hook_5,
      ring_size,
      category_name,
      buoyancy,
      shape,
      action,
      length,
      weight,
      range_min,
      range_max,
      ref_url,
      target_1,
      target_2,
      target_3,
      target_4,
      target_5,
      information,
      is_available,
      created_at,
      updated_at,
    ] = row;

    const url_code = generateUrlCode();
    const maker_id = makerIdMap.get(maker_slug);
    const category_id = categoryIdMap.get(category_name);

    if (!maker_id) {
      console.error(`❌ メーカーが見つかりません: ${maker_slug}`);
      errorCount++;
      continue;
    }

    if (!category_id) {
      console.error(`❌ カテゴリーが見つかりません: ${category_name}`);
      errorCount++;
      continue;
    }

    const { error } = await supabase.from("lures").insert({
      url_code: url_code,
      scraping_source_id: external_id,
      lure_maker_id: maker_id,
      lure_category_id: category_id,
      lure_name_ja: name_ja,
      lure_name_en: name_en,
      lure_main_image: main_image ? `${main_image}.webp` : null,
      lure_tmb_image: tmb_image ? `${tmb_image}.webp` : null,
      lure_tmb_small: null,
      lure_tmb_medium: null,
      attached_hook_size_1: hook_1 || null,
      attached_hook_size_2: hook_2 || null,
      attached_hook_size_3: hook_3 || null,
      attached_hook_size_4: hook_4 || null,
      attached_hook_size_5: hook_5 || null,
      attached_ring_size: ring_size || null,
      lure_buoyancy: buoyancy || null,
      lure_shape: shape || null,
      lure_action: action || null,
      lure_length: length ? parseFloat(length) : null,
      lure_weight: weight ? parseFloat(weight) : null,
      lure_range_min: range_min ? parseFloat(range_min) : null,
      lure_range_max: range_max ? parseFloat(range_max) : null,
      lure_ref_url: ref_url || null,
      target_fish_1: target_1 || null,
      target_fish_2: target_2 || null,
      target_fish_3: target_3 || null,
      target_fish_4: target_4 || null,
      target_fish_5: target_5 || null,
      lure_information: information || null,
      view_count: 0,
      data_version: 1,
      is_available: is_available === "TRUE",
      created_at: created_at,
      updated_at: updated_at,
    });

    if (error) {
      console.error(`❌ ルアー挿入エラー: ${name_ja}`, error);
      errorCount++;
      continue;
    }

    successCount++;
    if (successCount % 10 === 0) {
      console.log(`✅ ${successCount}件のルアーを移行...`);
    }
  }

  console.log("\n🎉 マイグレーション完了！");
  console.log(`✅ 成功: ${successCount}件`);
  console.log(`❌ エラー: ${errorCount}件`);
}

main().catch(console.error);
```

---

### 実行手順

#### 1. 環境準備

```bash
# プロジェクトフォルダに移動
cd /Users/katoushougen/Documents/00_Develop/16-lure_scraper

# 依存関係インストール
npm install @supabase/supabase-js googleapis dotenv

# または
yarn add @supabase/supabase-js googleapis dotenv
```

#### 2. 環境変数設定

```bash
# .env ファイル作成
cat > .env << EOF
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EOF
```

#### 3. Google 認証情報配置

```bash
# config/credentials.json を配置
# （スクレイピングプロジェクトで使用しているものと同じ）
```

#### 4. マイグレーション実行

```bash
# TypeScriptを直接実行
npx tsx scripts/migrate-from-sheets.ts

# または、トランスパイル後に実行
npx tsc scripts/migrate-from-sheets.ts
node scripts/migrate-from-sheets.js
```

---

### マイグレーション後の確認

```sql
-- Supabaseダッシュボードで確認

-- メーカー数
SELECT COUNT(*) FROM lure_makers;

-- カテゴリー数
SELECT COUNT(*) FROM lure_categories;

-- ルアー数
SELECT COUNT(*) FROM lures;

-- 各メーカーのルアー数
SELECT
  lm.lure_maker_name_en,
  COUNT(l.id) as lure_count
FROM lure_makers lm
LEFT JOIN lures l ON l.lure_maker_id = lm.id
GROUP BY lm.id, lm.lure_maker_name_en
ORDER BY lure_count DESC;

-- 各カテゴリーのルアー数
SELECT
  lc.category_name_ja,
  COUNT(l.id) as lure_count
FROM lure_categories lc
LEFT JOIN lures l ON l.lure_category_id = lc.id
GROUP BY lc.id, lc.category_name_ja
ORDER BY lure_count DESC;
```

---

### 注意事項

#### 1. 重複防止

マイグレーション実行前に既存データを削除：

```sql
-- 既存データをすべて削除（注意！）
TRUNCATE TABLE lures CASCADE;
TRUNCATE TABLE lure_makers CASCADE;
TRUNCATE TABLE lure_categories CASCADE;
```

#### 2. 画像ファイルの移行

スプレッドシートにはファイル名のみ保存されているため、実際の画像ファイルは別途移行が必要：

```bash
# ローカルの画像をSupabase Storageにアップロード
# （別途スクリプト作成が必要）
```

#### 3. エラーハンドリング

- メーカーやカテゴリーが見つからない場合はスキップ
- エラーログを確認して手動で修正

---

## URL 設計とセキュリティ

### URL 構造

```typescript
// ルアー
/lures/123-a3k9x
  └─┬┘ └─┬─┘
  レコードID  ランダム5文字

// メーカー
/makers/ima
/makers/ima/lures

// フック（将来）
/hooks/456-k7m2p

// 検索
/search?q=iborn&category=floating-minnow&maker=ima
```

### URL 生成ロジック

```typescript
// lib/utils.ts
export function generateUrlCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 5 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export function generateLureUrl(id: number, urlCode: string): string {
  return `/lures/${id}-${urlCode}`;
}

export function parseLureUrl(
  slug: string
): { id: number; code: string } | null {
  const match = slug.match(/^(\d+)-([a-z0-9]{5})$/);
  if (!match) return null;

  return {
    id: parseInt(match[1]),
    code: match[2],
  };
}
```

### セキュリティ（多層防御）

#### レイヤー 1: Cloudflare Protection

- Bot Fight Mode: ON
- Security Level: High
- Rate Limiting: 一般 100req/分、API10req/分

#### レイヤー 2: Next.js Middleware

```typescript
export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  if (!userAgent) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const suspiciousPatterns = [
    /python-requests/i,
    /beautifulsoup/i,
    /selenium/i,
  ];

  if (suspiciousPatterns.some((pattern) => pattern.test(userAgent))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}
```

#### レイヤー 3: URL 設計

- ID とランダムコードの両方で検証
- 連番推測を防止

#### レイヤー 4: Supabase RLS

```sql
ALTER TABLE lures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON lures
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admin full access" ON lures
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 機能要件

### 第 1 フェーズ：基本機能（ローンチ時）

#### 必須機能

**ルアー関連**:

- ルアー一覧表示（ページネーション）
- ルアー詳細表示
- ルアー検索（フリーワード）
- 詳細フィルター（メーカー、カテゴリー、サイズ範囲）
- ソート機能（新着順、人気順、名前順）

**メーカー関連**:

- メーカー一覧表示
- メーカー詳細表示
- メーカー別ルアー一覧

**ユーザー体験**:

- 最近見たルアー（LocalStorage、最大 20 件）
- 検索履歴（LocalStorage、最大 10 件）
- 検索バーのオートコンプリート
- レスポンシブデザイン

**管理機能（最小限）**:

- 管理者ログイン
- ルアー追加・編集・削除
- メーカー管理
- 画像アップロード
- アクセス統計確認

**SEO・パフォーマンス**:

- メタタグ設定
- OGP 設定
- サイトマップ自動生成
- 構造化データ（JSON-LD）
- 画像最適化（WebP, AVIF）
- Lighthouse Score 95+

**シェーダーエフェクト**:

- ルアー詳細ページの背景シェーダー
- 主要色のクライアント側での自動抽出
- モバイルでのフォールバック

---

## パフォーマンス最適化

### 目標指標

```typescript
Lighthouse Score:
✅ Performance: 95+
✅ Accessibility: 95+
✅ Best Practices: 95+
✅ SEO: 100

Core Web Vitals:
✅ LCP: < 2.5秒
✅ FID: < 100ms
✅ CLS: < 0.1
```

### 最適化戦略

1. **Next.js 設定**

```typescript
// next.config.js
const nextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    turbo: {},
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  compress: true,
};
```

2. **Server Components 優先**
3. **動的インポート**
4. **キャッシング（ISR: 1 時間ごと）**
5. **画像最適化**
6. **バンドルサイズ削減**

---

## UI/UX 設計

### シェーダーエフェクト

#### 主要色の抽出（クライアント側）

ルアー詳細ページの背景シェーダーで使用する主要色は、データベースに保存せず、クライアント側で動的に抽出します。

**実装方法:**

```typescript
// hooks/useDominantColor.ts
import { useState, useEffect } from "react";

export function useDominantColor(imageUrl: string) {
  const [color, setColor] = useState("#3b82f6");

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imageData = ctx.getImageData(0, 0, 100, 100);
      const pixels = imageData.data;

      let r = 0,
        g = 0,
        b = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
      }

      const pixelCount = pixels.length / 4;
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);

      const hex = `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

      // LocalStorageにキャッシュ
      localStorage.setItem(`color:${imageUrl}`, hex);
      setColor(hex);
    };

    // キャッシュチェック
    const cached = localStorage.getItem(`color:${imageUrl}`);
    if (cached) {
      setColor(cached);
    } else {
      img.src = imageUrl;
    }
  }, [imageUrl]);

  return color;
}
```

**メリット:**

- DB フィールド不要（シンプル）
- 画像変更時に自動更新
- LocalStorage でキャッシュ（高速）

---

### デザインシステム

**カラーパレット（既存 Vue.js から継承）**:

```typescript
colors: {
  'background-primary': '#2a262f',
  'background-secondary': '#3b3541',
  'background-white': '#ffffff',
  'text-primary': '#ffffff',
  'text-secondary': '#bdbdbd',
  'text-tertiary': '#828282',
  'border-light': 'rgba(130, 130, 130, 0.5)',
}
```

**タイポグラフィ（既存 Vue.js から継承）**:

- Font Family: システムフォント
- Heading: Bold, 1.6rem
- Body: Regular, 1rem
- Caption: Regular, 0.875rem

---

## モバイル展開計画

### 技術選定

```typescript
推奨: React Native + Expo

理由:
✅ Webコードの70-80%再利用
✅ TypeScript共有
✅ 1人で全プラットフォーム開発可能
✅ Supabase完全対応
```

### プロジェクト構造（モノレポ）

```
lure-database/
├── web/        # Next.js
├── mobile/     # React Native
├── shared/     # 共有コード
│   ├── types/
│   ├── api/
│   ├── utils/
│   └── constants/
└── supabase/   # DB設定
```

---

## 実装フェーズ

### Phase 1: Web 版基盤構築（2-3 週間）

**Week 1**:

- Next.js + Supabase 初期設定
- データベース構築
- 画像ストレージ設定
- 認証基盤（管理者のみ）
- 基本レイアウト

**Week 2**:

- ルアー一覧・詳細ページ
- メーカー一覧・詳細ページ
- 検索機能
- フィルター機能
- ページネーション

**Week 3**:

- 閲覧履歴・検索履歴
- SEO 最適化
- パフォーマンス最適化
- Cloudflare 設定
- 動作確認・バグ修正

### Phase 2-5

※詳細は元の REQUIREMENTS_V2.md を参照

---

## コスト試算

### 運用コスト（月額）

#### ローンチ時（無料〜小規模）

```
Vercel Hobby: $0
Supabase Free: $0
Cloudflare Free: $0
独自ドメイン: 約¥100/月

合計: 約¥100/月
```

#### 本格運用時（1,000 ユーザー想定）

```
Vercel Pro: $20/月
Supabase Pro: $25/月
Cloudflare Pro: $20/月（オプション）

合計: 約$45-65/月（約¥7,000-10,000/月）
```

---

## Claude Code への指示例

プロジェクトを Claude Code で実装する際は、以下のように指示してください：

```
プロジェクト概要:
既存のVue.js + Laravelアプリを Next.js 14 + Supabase に移植します。
既存デザインを完全再現することが最優先目標です。

リソース:
1. 最新要件定義書: REQUIREMENTS_V3.md
2. 既存プロジェクト: /Applications/MAMP/htdocs/Laravel/sll_web

デザイン参照（最重要）:
既存Vue.jsプロジェクトのHTML/CSS/UI/UXを可能な限り忠実に再現してください。

特に以下のファイルを参考に実装:
- /Applications/MAMP/htdocs/Laravel/sll_web/resources/js/Pages/Lures/Index.vue
- /Applications/MAMP/htdocs/Laravel/sll_web/resources/js/Pages/Lures/Show.vue
- /Applications/MAMP/htdocs/Laravel/sll_web/resources/js/Components/LureList.vue
- /Applications/MAMP/htdocs/Laravel/sll_web/resources/js/Components/InputSearch.vue
- /Applications/MAMP/htdocs/Laravel/sll_web/resources/js/Layouts/Header.vue

最初のタスク:
1. REQUIREMENTS_V3.md を読んで理解
2. 既存プロジェクトの構造を分析
3. Tailwind CSS設定（デザインシステム）を構築
4. コンポーネントを Atomic Design に基づいて実装

準備完了したら実装を開始してください。
```

---

## 参考資料

### 既存プロジェクト

**ローカルパス**:

```
/Applications/MAMP/htdocs/Laravel/sll_web
```

**GitHub**:

```
https://github.com/masahiro0813kato/sll_web
```

### 公式ドキュメント

- Next.js: https://nextjs.org/
- Supabase: https://supabase.com/
- Vercel: https://vercel.com/
- Cloudflare: https://www.cloudflare.com/
- React Native: https://reactnative.dev/
- Expo: https://expo.dev/

---

**ドキュメントバージョン**: 3.0  
**最終更新**: 2025 年 11 月 14 日  
**作成者**: プロジェクトチーム
