---
name: SEO対策まとめ
description: 実施したSEO対策・パフォーマンス改善の全一覧
type: project
---

## インデックス・クロール対策
- metadataBaseフォールバックURLを`salt-lure-storage.com`に修正（3箇所）
- `generateStaticParams`で全ルアー詳細ページをビルド時静的生成
- `/lures`ページSSR化（全ルアーへの内部リンクをHTMLに出力、Googlebot向け）
- `robots.txt`と`sitemap.xml`をミドルウェアの対象から除外（クローラがアクセスできなかった）
- Cloudflare Managed robots.txtを無効化（独自robots.txtを使用）
- 管理画面`/admin`をrobots.txtとnoindexで検索エンジンから除外
- 詳細ページを`createStaticClient`に変更し正しく静的生成されるよう修正

## メタデータ最適化
- title: `SLS - Salt Lure Storage | ルアーのフックサイズがすぐわかる`
- template: `%s | SLS - Salt Lure Storage`
- description: フック交換時の課題訴求 + メーカー横断検索の価値
- 詳細ページdescriptionにスペック情報（フック・リング・長さ・重さ）を先頭配置
- 不要な`lures/layout.tsx`を削除（メタデータ解決の阻害を解消）
- 構造化データ（JSON-LD）を削除（他社製品をProductとしてマークアップは不適切）

## パフォーマンス改善
- Three.jsをdynamic importに変更（初期バンドルから分離）
- `productionBrowserSourceMaps`削除（本番ビルドサイズ削減）
- `optimizePackageImports`に`three`追加（Tree Shaking改善）
- GTMを遅延読み込み化（ページ表示3秒後に読み込み、初期バンドルから~262KB除外）
- CloudflareのRUM（beacon.min.js）を無効化
- Supabaseへのpreconnect/dns-prefetch追加
- TOPページランキングをSSR化（LCP 5.2s → 1.8s）
- ランキングカード画像のNext.js最適化有効化（PNG→WebP変換）
- 最初の3枚にpriority/fetchPriority="high"追加

## CLS改善
- 仮想スクロールをuseWindowVirtualizerに変更（Chrome互換性）
- カード画像にaspect-ratio・style追加
- ロゴ画像を固定サイズに変更
- measureElementで動的高さ測定（カード間隔の均一化）

## 画像最適化
- サムネイル画像を`unoptimized`に変更（400エラー解消）
- 詳細ページメイン画像にfetchPriority="high"追加
- デフォルト画像をWebPに変更
- 背景色をDBに事前保存（クライアント側のリアルタイム色抽出を削減）

## パフォーマンススコア推移（TOPページ）
| 指標 | 初期 | 最終 |
|------|------|------|
| FCP | 2.3s | 0.8s |
| LCP | 5.2s | 1.8s |
| TBT | 200ms | 110ms |
| CLS | 0.049 | 0.006 |

## GA4カスタムイベント
- `view_lure`: ルアー閲覧（lure_id, lure_name, maker_name）
- `search_lure`: 検索実行（search_term）
- `use_search_history`: 検索履歴クリック（search_term）
- `clear_search`: 検索クリア（previous_term）
- `click_series`: シリーズカードクリック（from_lure, to_lure）
- `click_ranking`: ランキングカードクリック（lure_name, rank, period）
