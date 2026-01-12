import { notFound } from "next/navigation";
import Header from "@/components/organisms/Header";
import LureDetailImage from "@/components/organisms/LureDetailImage";
import { parseLureUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

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

  // 構造化データ（JSON-LD）
  const imageUrl = `https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/main/${lure.lure_id}_main.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: lure.lure_name_ja + "| Salt Lure Storage",
    description:
      lure.lure_information ||
      `${lure.lure_maker?.lure_maker_name_ja} ${lure.lure_name_ja}`,
    image: imageUrl,
    brand: {
      "@type": "Brand",
      name:
        lure.lure_maker?.lure_maker_name_ja ||
        lure.lure_maker?.lure_maker_name_en,
    },
    offers: {
      "@type": "Offer",
      availability: lure.is_available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    additionalProperty: [
      lure.lure_length && {
        "@type": "PropertyValue",
        name: "全長",
        value: `${lure.lure_length}mm`,
      },
      lure.lure_weight && {
        "@type": "PropertyValue",
        name: "重量",
        value: `${lure.lure_weight}g`,
      },
      lure.attached_hook_size_1 && {
        "@type": "PropertyValue",
        name: "フックサイズ",
        value: lure.attached_hook_size_1,
      },
    ].filter(Boolean),
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header fixed={true} />
      <main className="relative">
        {/* 画像セクション */}
        <LureDetailImage
          lureId={lure.lure_id}
          lureName={lure.lure_name_ja}
          showDebugUI={process.env.NEXT_PUBLIC_SHOW_DEBUG_UI === 'true'}
        />

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const pageUrl = `${siteUrl}/lures/${parsed.id}-${parsed.code}`;
  const imageUrl = `https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/main/${lure.lure_id}_main.png`;

  return {
    title: lure.lure_name_ja,
    description: lure.lure_information || "",
    keywords: [
      lure.lure_name_ja,
      lure.lure_maker?.lure_maker_name_ja || "",
      "ソルトルアー",
      "フックサイズ",
      "釣り",
    ],
    openGraph: {
      title: `${lure.lure_name_ja} | Salt Lure Storage`,
      description: lure.lure_information || "",
      url: pageUrl,
      type: "article",
      locale: "ja_JP",
      siteName: "Salt Lure Storage",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: lure.lure_name_ja,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${lure.lure_name_ja} | Salt Lure Storage`,
      description: lure.lure_information || "",
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}
