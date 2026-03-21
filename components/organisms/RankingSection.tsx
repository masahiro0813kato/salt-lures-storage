"use client";

import { useEffect, useState } from "react";
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

interface RankingSectionProps {
  title: string;
  period: "monthly" | "yearly";
}

export default function RankingSection({ title, period }: RankingSectionProps) {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await fetch(`/api/v1/rankings?period=${period}&limit=10`);
        const data = await res.json();
        setRankings(data.rankings || []);
      } catch {
        setRankings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, [period]);

  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-white px-4 mb-4">{title}</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-text-secondary text-sm">読み込み中...</div>
        </div>
      ) : rankings.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-text-tertiary text-sm">
            まだランキングデータがありません
          </div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
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
            />
          ))}
        </div>
      )}
    </section>
  );
}
