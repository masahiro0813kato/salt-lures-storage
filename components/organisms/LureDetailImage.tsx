"use client";

import { useState } from "react";
import Image from "next/image";
import LureDetailBackground from "./LureDetailBackground";
import { generateBlurDataURL } from "@/lib/imageUtils";

interface LureDetailImageProps {
  lureId: string;
  lureName: string;
  showDebugUI?: boolean;
}

const DEFAULT_IMAGE = "/images/common/lure_main_default.png";

export default function LureDetailImage({
  lureId,
  lureName,
  showDebugUI = false,
}: LureDetailImageProps) {
  const supabaseImageUrl = `https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/main/${lureId}_main.png`;
  const [imageSrc, setImageSrc] = useState(supabaseImageUrl);
  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  // 動的にblurDataURLを生成
  const blurDataURL = generateBlurDataURL(800, 600, '#e5e7eb');

  const handleImageError = () => {
    setImageSrc(DEFAULT_IMAGE);
    setIsDefaultImage(true);
    setImageKey(prev => prev + 1); // 強制的に再レンダリング
  };

  return (
    <section className="relative w-full flex justify-center overflow-hidden">
      {/* 背景（Canvas） - デフォルト画像の場合は白背景のみ */}
      <LureDetailBackground
        imageUrl={isDefaultImage ? null : supabaseImageUrl}
        showDebugUI={showDebugUI}
      />

      {/* メイン画像 */}
      <Image
        key={imageKey}
        src={imageSrc}
        alt={lureName}
        width={800}
        height={600}
        className="relative z-10 w-4/5 h-auto"
        priority
        placeholder="blur"
        blurDataURL={blurDataURL}
        onError={handleImageError}
      />
    </section>
  );
}
