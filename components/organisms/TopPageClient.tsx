"use client";

import SearchBar from "@/components/organisms/SearchBar";
import { StickyHeaderProvider } from "@/components/organisms/StickyHeader";
import RankingSection from "@/components/organisms/RankingSection";

export default function TopPageClient() {
  return (
    <StickyHeaderProvider>
      <div className="max-w-3xl mx-auto">
        {/* 検索バー */}
        <div className="px-4 pt-4 pb-8">
          <SearchBar />
        </div>

        {/* ランキングセクション */}
        <RankingSection title="月間閲覧ランキング" period="monthly" />
        <RankingSection title="年間閲覧ランキング" period="yearly" />
      </div>
    </StickyHeaderProvider>
  );
}
