"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface RankingCardProps {
  rank: number;
  lureId: number;
  urlCode: string;
  lureName: string;
  makerName: string;
  lureImageId: string;
  viewCount: number;
}

export default function RankingCard({
  rank,
  lureId,
  urlCode,
  lureName,
  makerName,
  lureImageId,
  viewCount,
}: RankingCardProps) {
  const originalImageUrl = `https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/thumbnails/${lureImageId}_thumb.png`;
  const defaultImageUrl = "/images/common/lure_tmb_default.webp";
  const [imageSrc, setImageSrc] = useState(originalImageUrl);

  return (
    <Link
      href={`/lures/${lureId}-${urlCode}`}
      className="block min-w-[160px] w-[160px] rounded-lg bg-white hover:scale-105 transition-transform duration-200"
    >
      {/* 画像エリア */}
      <div className="relative w-full h-[120px] bg-white flex items-center justify-end rounded-t-lg overflow-hidden">
        <Image
          src={imageSrc}
          alt={lureName}
          width={150}
          height={100}
          className="object-cover"
          style={{ width: '140px', height: 'auto' }}
          unoptimized
          onError={() => setImageSrc(defaultImageUrl)}
        />
        {/* 順位バッジ */}
        <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-bg-primary text-white text-sm font-bold flex items-center justify-center">
          {rank}
        </div>
      </div>

      {/* 情報エリア */}
      <div className="p-3">
        <div className="text-xs text-text-tertiary leading-none mb-1">
          {makerName}
        </div>
        <div className="text-sm text-dark font-medium leading-tight line-clamp-2">
          {lureName}
        </div>
        {/* <div className="text-xs text-text-tertiary mt-1">
          {viewCount} views
        </div> */}
      </div>
    </Link>
  );
}
