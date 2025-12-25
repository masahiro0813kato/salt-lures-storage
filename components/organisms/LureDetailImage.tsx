"use client";

import Image from "next/image";
import LureDetailBackground from "./LureDetailBackground";

interface LureDetailImageProps {
  lureId: number;
  lureName: string;
  showDebugUI?: boolean;
}

export default function LureDetailImage({
  lureId,
  lureName,
  showDebugUI = false,
}: LureDetailImageProps) {
  const imageUrl = `https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/main/lure_${lureId}.png`;

  return (
    <section className="relative w-full flex justify-center overflow-hidden">
      {/* 背景（Canvas） */}
      <LureDetailBackground imageUrl={imageUrl} showDebugUI={showDebugUI} />

      {/* メイン画像 */}
      <Image
        src={imageUrl}
        alt={lureName}
        width={800}
        height={600}
        className="relative z-10 w-4/5 h-auto"
        priority
        unoptimized
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/common/lure_main_default.webp";
        }}
      />
    </section>
  );
}
