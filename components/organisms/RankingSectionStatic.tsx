import RankingCard from "./RankingCard";

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

interface RankingSectionStaticProps {
  title: string;
  rankings: RankingItem[];
  period: string;
}

export default function RankingSectionStatic({ title, rankings, period }: RankingSectionStaticProps) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-white px-4 mb-4">{title}</h2>

      {rankings.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-text-tertiary text-sm">
            まだランキングデータがありません
          </div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto px-4 py-2 scrollbar-hide">
          {rankings.map((item, index) => (
            <RankingCard
              key={item.lure_id}
              rank={item.rank}
              lureId={item.lure_id}
              urlCode={item.url_code}
              lureName={item.lure_name_ja}
              makerName={item.lure_maker_name_en || ""}
              lureImageId={item.lure_image_id}
              viewCount={item.view_count}
              priority={index < 3}
              period={period}
            />
          ))}
        </div>
      )}
    </section>
  );
}
