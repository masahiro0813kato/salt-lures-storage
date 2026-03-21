"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LureWithRelations } from "@/types/database";

interface SeriesSectionProps {
  seriesName: string;
  currentLureId: number;
  onSelectLure?: (lure: LureWithRelations) => void;
}

function SeriesCard({
  lure,
  onSelectLure,
}: {
  lure: LureWithRelations;
  onSelectLure?: (lure: LureWithRelations) => void;
}) {
  const originalImageUrl = `https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/thumbnails/${lure.lure_id}_thumb.png`;
  const defaultImageUrl = "/images/common/lure_tmb_default.webp";
  const [imageSrc, setImageSrc] = useState(originalImageUrl);

  const cardContent = (
    <div className="block min-w-[160px] w-[160px] rounded-lg bg-white hover:scale-105 transition-transform duration-200">
      <div className="relative w-full h-[120px] bg-white flex items-center justify-end rounded-t-lg overflow-hidden">
        <Image
          src={imageSrc}
          alt={lure.lure_name_ja}
          width={150}
          height={100}
          className="object-cover"
          style={{ width: '140px', height: 'auto' }}
          loading="lazy"
          unoptimized
          onError={() => setImageSrc(defaultImageUrl)}
        />
      </div>
      <div className="p-3">
        <div className="text-xs text-text-tertiary leading-none mb-1">
          {lure.lure_maker?.lure_maker_name_en}
        </div>
        <div className="text-sm text-dark font-medium leading-tight line-clamp-2 min-h-[2.5rem]">
          {lure.lure_name_ja}
        </div>
      </div>
    </div>
  );

  if (onSelectLure) {
    return (
      <div
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          onSelectLure(lure);
        }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/lures/${lure.id}-${lure.url_code}`}>
      {cardContent}
    </Link>
  );
}

export default function SeriesSection({
  seriesName,
  currentLureId,
  onSelectLure,
}: SeriesSectionProps) {
  const [lures, setLures] = useState<LureWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await fetch(
          `/api/v1/series?name=${encodeURIComponent(seriesName)}&excludeId=${currentLureId}`
        );
        const data = await res.json();
        setLures(data.lures || []);
      } catch {
        setLures([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeries();
  }, [seriesName, currentLureId]);

  if (isLoading) return null;
  if (lures.length === 0) return null;

  return (
    <section className="mt-8">
      <h3 className="text-lg font-bold text-white mb-4">
        {seriesName}シリーズ
      </h3>
      <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
        {lures.map((lure) => (
          <SeriesCard
            key={lure.id}
            lure={lure}
            onSelectLure={onSelectLure}
          />
        ))}
      </div>
    </section>
  );
}
