import Header from "@/components/organisms/Header";
import SearchBar from "@/components/organisms/SearchBar";
import StickyHeader, { StickyHeaderProvider } from "@/components/organisms/StickyHeader";
import LureList from "@/components/organisms/LureList";
import ScrollToTop from "@/components/organisms/ScrollToTop";
import { createClient } from "@/lib/supabase/server";
import type { LureWithRelations } from "@/types/database";

interface SearchParams {
  search?: string;
  page?: string;
}

export default async function LuresPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);

  // Supabaseから直接データ取得
  const supabase = await createClient();

  const limit = 20;
  const offset = (page - 1) * limit;

  // メーカー名でも検索できるように
  let makerIds: number[] = [];
  if (search) {
    const { data: makers } = await supabase
      .from("lure_makers")
      .select("id")
      .or(
        `lure_maker_name_ja.ilike.%${search}%,lure_maker_name_en.ilike.%${search}%`
      )
      .eq("is_available", true);

    makerIds = makers?.map((m) => m.id) || [];
  }

  let query = supabase
    .from("lures")
    .select(
      `
      *,
      lure_maker:lure_makers(id, lure_maker_name_ja, lure_maker_name_en, lure_maker_logo_image),
      lure_category:lure_categories(id, category_name_ja, category_name_en)
      `,
      { count: "exact" }
    )
    .eq("is_available", true);

  if (search) {
    if (makerIds.length > 0) {
      // メーカー名またはルアー名で検索
      query = query.or(
        `lure_name_ja.ilike.%${search}%,lure_name_en.ilike.%${search}%,lure_maker_id.in.(${makerIds.join(
          ","
        )})`
      );
    } else {
      // ルアー名のみで検索
      query = query.or(
        `lure_name_ja.ilike.%${search}%,lure_name_en.ilike.%${search}%`
      );
    }
  }

  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data: lures, error, count } = await query;

  if (error) {
    console.error("Failed to fetch lures:", error);
  }

  return (
    <StickyHeaderProvider>
      <StickyHeader>
        <Header />
        <SearchBar latestSearchKey={search} />
        {count !== null && count > 0 && (
          <div className="px-4 pb-2">
            <div className="text-text-secondary text-sm">全{count}件</div>
          </div>
        )}
      </StickyHeader>

      <main className="pt-[200px]">
        <div className="px-4">
          <LureList
            lures={(lures as LureWithRelations[]) || []}
            total={count || 0}
          />
        </div>
      </main>

      <ScrollToTop />
    </StickyHeaderProvider>
  );
}

export const metadata = {
  title: "ルアー検索 | Lure Database",
  description: "ルアーを検索・閲覧できます",
};
