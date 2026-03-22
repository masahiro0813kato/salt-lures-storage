import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/organisms/PageHeader";
import RankingSectionStatic from "@/components/organisms/RankingSectionStatic";

// ISR: 1時間ごとに再生成
export const revalidate = 3600;

interface RankingItem {
  rank: number;
  view_count: number;
  lure_id: number;
  lure_name_ja: string;
  lure_name_en: string;
  lure_maker_name_en: string;
  url_code: string;
  lure_image_id: string;
}

async function fetchRankings(period: "monthly" | "yearly"): Promise<RankingItem[]> {
  const now = new Date();
  const since = new Date(now);

  if (period === "yearly") {
    since.setFullYear(since.getFullYear() - 1);
  } else {
    since.setDate(since.getDate() - 30);
  }

  const supabase = await createClient();
  const { data } = await supabase.rpc("get_lure_rankings", {
    since_date: since.toISOString(),
    result_limit: 10,
  });

  return data || [];
}

export default async function Home() {
  const [monthlyRankings, yearlyRankings] = await Promise.all([
    fetchRankings("monthly"),
    fetchRankings("yearly"),
  ]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHeader />
      <main className="pt-[200px] pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto">
          <RankingSectionStatic title="月間閲覧ランキング" rankings={monthlyRankings} period="monthly" />
          <RankingSectionStatic title="年間閲覧ランキング" rankings={yearlyRankings} period="yearly" />
        </div>
      </main>
    </div>
  );
}
