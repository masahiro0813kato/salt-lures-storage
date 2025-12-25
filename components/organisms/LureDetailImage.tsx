"use client";

import Image from "next/image";

interface LureDetailImageProps {
  lureId: number;
  lureName: string;
}

export default function LureDetailImage({
  lureId,
  lureName,
}: LureDetailImageProps) {
  return (
    <section className="relative w-full flex justify-center bg-white">
      {/* ぼかし背景 */}
      <div className="absolute inset-0 z-[1] backdrop-blur-[30px]" />

      {/* 背景ズームアニメーション */}
      <div
        className="absolute inset-0 z-[1] opacity-35 brightness-[130%] saturate-[400%] animate-zoom"
        style={{
          backgroundColor: "#fff",
          backgroundImage: `url(https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/main/lure_${lureId}.png)`,
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* メイン画像 */}
      <Image
        src={`https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/main/lure_${lureId}.png`}
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
