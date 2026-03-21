"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { generateBlurDataURL } from "@/lib/imageUtils";

const LureDetailBackground = dynamic(
  () => import("./LureDetailBackground"),
  { ssr: false }
);

interface LureDetailImageProps {
  lureId: string;
  lureName: string;
  showDebugUI?: boolean;
  bgColors?: { colors: Array<{ baseRgb: [number, number, number]; weight: number }> } | null;
}

const DEFAULT_IMAGE = "/images/common/lure_main_default.png";

export default function LureDetailImage({
  lureId,
  lureName,
  showDebugUI = false,
  bgColors,
}: LureDetailImageProps) {
  const supabaseImageUrl = `https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/main/${lureId}_main.png`;
  const [imageSrc, setImageSrc] = useState(supabaseImageUrl);
  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  // 動的にblurDataURLを生成
  const blurDataURL = generateBlurDataURL(800, 600, '#e5e7eb');

  const handleImageError = () => {
    if (imageSrc === DEFAULT_IMAGE) return;
    setImageSrc(DEFAULT_IMAGE);
    setIsDefaultImage(true);
    setImageKey(prev => prev + 1);
  };

  return (
    <section className="relative w-full flex justify-center overflow-hidden" style={{ height: '400px', minHeight: '300px' }}>
      {/* 背景（Canvas） - デフォルト画像の場合は白背景のみ */}
      <LureDetailBackground
        imageUrl={isDefaultImage ? null : supabaseImageUrl}
        showDebugUI={showDebugUI}
        bgColors={isDefaultImage ? null : bgColors}
      />

      {/* メイン画像 */}
      <Image
        key={imageKey}
        src={imageSrc}
        alt={lureName}
        width={800}
        height={600}
        className="relative z-10 w-4/5 h-auto object-contain"
        style={{
          maxHeight: '400px',
          filter: 'drop-shadow(4px 8px 8px rgba(0, 0, 0, 0.25))'
        }}
        priority
        fetchPriority="high"
        placeholder="blur"
        blurDataURL={blurDataURL}
        unoptimized={isDefaultImage}
        onError={handleImageError}
      />
    </section>
  );
}
