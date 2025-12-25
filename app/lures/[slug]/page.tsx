import { notFound } from "next/navigation";
import Header from "@/components/organisms/Header";
import LureDetailImage from "@/components/organisms/LureDetailImage";
import { parseLureUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import type { LureWithRelations } from "@/types/database";

// モックデータ
const mockLure: LureWithRelations = {
  id: 1,
  url_code: "a3k9x",
  lure_name_ja: "コモモ SF-125",
  lure_name_en: "komomo SF-125",
  lure_main_image: "komomo_sf125",
  lure_tmb_image: "komomo_sf125",
  attached_hook_size_1: "#6",
  attached_hook_size_2: "#4",
  attached_hook_size_3: null,
  attached_hook_size_4: null,
  attached_hook_size_5: null,
  attached_ring_size: "#2",
  lure_buoyancy: "Floating",
  lure_action: "ローリング",
  lure_length: 125,
  lure_weight: 16,
  lure_range_min: 10,
  lure_range_max: 50,
  lure_information:
    "シーバス向けフローティングミノー。\n水面直下をゆっくりと引くことができる。",
  lure_maker: {
    id: 1,
    slug: "ima",
    lure_maker_name_ja: "アイマ",
    lure_maker_name_en: "ima",
    lure_maker_logo_image: null,
    lure_maker_ref_url: null,
    description: null,
    is_available: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  lure_category: {
    id: 1,
    slug: "floating-minnow",
    category_name_ja: "フローティングミノー",
    category_name_en: "Floating Minnow",
    description: null,
    display_order: 1,
    is_visible: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  lure_maker_id: 1,
  lure_category_id: 1,
  scraping_source_id: null,
  lure_tmb_small: null,
  lure_tmb_medium: null,
  lure_shape: null,
  lure_ref_url: null,
  target_fish_1: null,
  target_fish_2: null,
  target_fish_3: null,
  target_fish_4: null,
  target_fish_5: null,
  view_count: 0,
  data_version: 1,
  is_available: true,
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

// nl2br関数（改行をbrタグに変換）
function nl2br(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(/\n/g, "<br />");
}

export default async function LureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseLureUrl(slug);
  if (!parsed) notFound();

  // Supabaseからデータ取得
  const supabase = await createClient();
  const { data: lure, error } = await supabase
    .from("lures")
    .select(
      `
      *,
      lure_maker:lure_makers(id, slug, lure_maker_name_ja, lure_maker_name_en, lure_maker_logo_image),
      lure_category:lure_categories(id, slug, category_name_ja, category_name_en)
      `
    )
    .eq("id", parsed.id)
    .eq("is_available", true)
    .single();

  if (error || !lure) {
    console.error("Failed to fetch lure:", error);
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <Header fixed={true} />
      <main className="relative">
        {/* 画像セクション */}
        <LureDetailImage lureId={lure.id} lureName={lure.lure_name_ja} showDebugUI={true} />

        {/* データセクション */}
        <section className="relative bg-bg-primary z-50 px-4 py-8 text-white">
          {/* タイトルエリア */}
          <div className="pb-8">
            <div className="text-xl leading-none mb-6">
              {lure.lure_maker?.lure_maker_name_en}
            </div>
            <h1 className="text-2xl leading-tight">{lure.lure_name_ja}</h1>
            <div className="text-base text-text-secondary leading-tight">
              {lure.lure_name_en}
            </div>
          </div>

          {/* スペックエリア */}
          <div className="border-y-[0.5px] border-text-tertiary py-8 mb-8 leading-none text-xl">
            {/* カテゴリー */}
            <div className="mb-8">
              <h2 className="text-sm text-text-tertiary mb-1">Type</h2>
              <div className="text-xl mb-1">
                {lure.lure_category?.category_name_ja}
              </div>
              <div className="text-sm text-text-secondary">
                {lure.lure_action}
              </div>
            </div>

            {/* フックサイズ */}
            <div className="mb-8">
              <h2 className="text-sm text-text-tertiary mb-1">Hook Size</h2>
              <div className="text-base">
                <span className="text-xs font-bold text-text-tertiary">
                  F・
                </span>
                {lure.attached_hook_size_1 && (
                  <span>{lure.attached_hook_size_1}</span>
                )}
                {lure.attached_hook_size_2 && (
                  <>
                    <span className="text-xs font-bold text-text-tertiary">
                      ・
                    </span>
                    <span>{lure.attached_hook_size_2}</span>
                  </>
                )}
                {lure.attached_hook_size_3 && (
                  <>
                    <span className="text-xs font-bold text-text-tertiary">
                      ・
                    </span>
                    <span>{lure.attached_hook_size_3}</span>
                  </>
                )}
                {lure.attached_hook_size_4 && (
                  <>
                    <span className="text-xs font-bold text-text-tertiary">
                      ・
                    </span>
                    <span>{lure.attached_hook_size_4}</span>
                  </>
                )}
                {lure.attached_hook_size_5 && (
                  <>
                    <span className="text-xs font-bold text-text-tertiary">
                      ・
                    </span>
                    <span>{lure.attached_hook_size_5}</span>
                  </>
                )}
                <span className="text-xs font-bold text-text-tertiary">
                  ・R
                </span>
              </div>
            </div>

            {/* その他のスペック */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-8">
              <div>
                <h2 className="text-sm text-text-tertiary mb-1">Ring Size</h2>
                <div className="text-xl">{lure.attached_ring_size}</div>
              </div>
              <div>
                <h2 className="text-sm text-text-tertiary mb-1">Length</h2>
                <div className="text-xl">
                  {lure.lure_length}
                  <span className="text-sm ml-1">mm</span>
                </div>
              </div>
              <div>
                <h2 className="text-sm text-text-tertiary mb-1">Weight</h2>
                <div className="text-xl">
                  {lure.lure_weight}
                  <span className="text-sm ml-1">g</span>
                </div>
              </div>
              <div>
                <h2 className="text-sm text-text-tertiary mb-1">Buoyancy</h2>
                <div className="text-xl">{lure.lure_buoyancy}</div>
              </div>
              <div>
                <h2 className="text-sm text-text-tertiary mb-1">Range</h2>
                <div className="text-xl">
                  {lure.lure_range_min}-{lure.lure_range_max}
                  <span className="text-sm ml-1">cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* 説明文 */}
          <div
            className="whitespace-pre-line text-sm"
            dangerouslySetInnerHTML={{
              __html: nl2br(lure.lure_information),
            }}
          />
        </section>
      </main>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseLureUrl(slug);
  if (!parsed) return {};

  // Supabaseからデータ取得
  const supabase = await createClient();
  const { data: lure } = await supabase
    .from("lures")
    .select(
      `
      *,
      lure_maker:lure_makers(lure_maker_name_ja)
      `
    )
    .eq("id", parsed.id)
    .eq("is_available", true)
    .single();

  if (!lure) return {};

  return {
    title: `${lure.lure_name_ja} | Lure Database`,
    description:
      lure.lure_information ||
      `${lure.lure_maker?.lure_maker_name_ja} ${lure.lure_name_ja}の詳細情報`,
  };
}
