"use client";

import { memo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LureWithRelations } from "@/types/database";

interface LureCardProps {
  lure: LureWithRelations;
  priority?: boolean;
  isSelected?: boolean;
  onSelect?: (lure: LureWithRelations) => void;
}

function LureCardComponent({ lure, priority = false, isSelected = false, onSelect }: LureCardProps) {
  const originalImageUrl = `https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/thumbnails/${lure.lure_id}_thumb.png`;
  const defaultImageUrl = "/images/common/lure_tmb_default.webp";

  const [imageSrc, setImageSrc] = useState(originalImageUrl);
  const [imageKey, setImageKey] = useState(0);
  const hasErrorRef = useRef(false);

  useEffect(() => {
    setImageSrc(originalImageUrl);
    hasErrorRef.current = false;
    setImageKey(0);
  }, [lure.lure_id, originalImageUrl]);

  const handleImageError = () => {
    if (hasErrorRef.current) return;
    hasErrorRef.current = true;
    setImageSrc(defaultImageUrl);
    setImageKey(prev => prev + 1);
  };

  const cardClassName = `flex justify-between items-center rounded-lg transition-all duration-150 ${
    isSelected
      ? "bg-bg-secondary ring-2 ring-text-tertiary"
      : "bg-white active:opacity-80"
  }`;

  const textClassName = isSelected ? "text-white" : "text-dark";
  const subTextClassName = isSelected ? "text-text-secondary" : "text-text-tertiary";

  const cardContent = (
    <>
      {/* テキストエリア */}
      <div className="flex-auto p-4">
        <div>
          {/* タイトルエリア */}
          <div className={`pb-2 border-b-[0.5px] ${isSelected ? 'border-text-tertiary' : 'border-text-tertiary'}`}>
            <div className={`text-sm leading-none mb-2 ${textClassName}`}>
              {lure.lure_maker?.lure_maker_name_en}
            </div>
            <h2 className={`text-base leading-tight mb-1 ${textClassName}`}>
              {lure.lure_name_ja}
            </h2>
            <div className={`text-xs leading-tight ${subTextClassName}`}>
              {lure.lure_name_en}
            </div>
          </div>

          {/* フック・リング情報 */}
          <div className="mt-2 flex flex-row gap-4 leading-none">
            <div className={`text-sm ${textClassName}`}>
              <span className={`text-xs font-bold ${subTextClassName}`}>H：</span>
              {lure.attached_hook_size_1 && <span>{lure.attached_hook_size_1}</span>}
              {lure.attached_hook_size_2 && (
                <>
                  <span className={`text-xs font-bold ${subTextClassName}`}>・</span>
                  <span>{lure.attached_hook_size_2}</span>
                </>
              )}
              {lure.attached_hook_size_3 && (
                <>
                  <span className={`text-xs font-bold ${subTextClassName}`}>・</span>
                  <span>{lure.attached_hook_size_3}</span>
                </>
              )}
              {lure.attached_hook_size_4 && (
                <>
                  <span className={`text-xs font-bold ${subTextClassName}`}>・</span>
                  <span>{lure.attached_hook_size_4}</span>
                </>
              )}
              {lure.attached_hook_size_5 && (
                <>
                  <span className={`text-xs font-bold ${subTextClassName}`}>・</span>
                  <span>{lure.attached_hook_size_5}</span>
                </>
              )}
            </div>

            {lure.attached_ring_size && (
              <div className={`text-sm ${textClassName}`}>
                <span className={`text-xs font-bold ${subTextClassName}`}>R：</span>
                <span>{lure.attached_ring_size}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 画像エリア */}
      <div className="w-1/3 min-w-[120px] flex items-center justify-center" style={{ aspectRatio: '3/2' }}>
        <Image
          key={imageKey}
          src={imageSrc}
          alt={lure.lure_name_ja}
          width={120}
          height={80}
          className="w-full h-auto object-cover"
          style={{ width: '100%', height: 'auto' }}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          unoptimized
          onError={handleImageError}
        />
      </div>
    </>
  );

  if (onSelect) {
    return (
      <div
        className={`${cardClassName} cursor-pointer`}
        onClick={() => onSelect(lure)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(lure); }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/lures/${lure.id}-${lure.url_code}`}
      className={cardClassName}
    >
      {cardContent}
    </Link>
  );
}

export default memo(LureCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.lure.id === nextProps.lure.id &&
    prevProps.priority === nextProps.priority &&
    prevProps.isSelected === nextProps.isSelected
  );
});
