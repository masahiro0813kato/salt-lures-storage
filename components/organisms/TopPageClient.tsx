"use client";

import DetailPageHeader from "@/components/organisms/DetailPageHeader";
import RankingSection from "@/components/organisms/RankingSection";

export default function TopPageClient() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <DetailPageHeader />
      <main className="pt-[170px]">
        <div className="max-w-3xl mx-auto">
          <RankingSection title="月間閲覧ランキング" period="monthly" />
          <RankingSection title="年間閲覧ランキング" period="yearly" />
        </div>
      </main>
    </div>
  );
}
