"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LureWithRelations } from "@/types/database";

interface LureCardProps {
  lure: LureWithRelations;
  priority?: boolean;
}

function LureCardComponent({ lure, priority = false }: LureCardProps) {
  return (
    <Link
      href={`/lures/${lure.id}-${lure.url_code}`}
      className="flex justify-between items-center bg-white rounded-lg opacity-100
                 active:opacity-80 transition-opacity duration-50"
    >
      {/* テキストエリア */}
      <div className="flex-auto p-4">
        <div>
          {/* タイトルエリア */}
          <div className="pb-2 border-b-[0.5px] border-text-tertiary">
            <div className="text-sm leading-none mb-2 text-dark">
              {lure.lure_maker?.lure_maker_name_en}
            </div>
            <h2 className="text-base leading-tight mb-1 text-dark">
              {lure.lure_name_ja}
            </h2>
            <div className="text-xs text-text-tertiary leading-tight">
              {lure.lure_name_en}
            </div>
          </div>

          {/* フック・リング情報 */}
          <div className="mt-2 flex flex-row gap-4 leading-none">
            {/* フックエリア */}
            <div className="text-sm text-dark">
              <span className="text-xs font-bold text-text-tertiary">H：</span>
              {lure.attached_hook_size_1 && (
                <span>{lure.attached_hook_size_1}</span>
              )}
              {lure.attached_hook_size_2 && (
                <>
                  <span className="text-xs font-bold text-text-tertiary">
                    ・
                  </span>
                  <span>{lure.attached_hook_size_2}</span>
                </>
              )}
              {lure.attached_hook_size_3 && (
                <>
                  <span className="text-xs font-bold text-text-tertiary">
                    ・
                  </span>
                  <span>{lure.attached_hook_size_3}</span>
                </>
              )}
              {lure.attached_hook_size_4 && (
                <>
                  <span className="text-xs font-bold text-text-tertiary">
                    ・
                  </span>
                  <span>{lure.attached_hook_size_4}</span>
                </>
              )}
              {lure.attached_hook_size_5 && (
                <>
                  <span className="text-xs font-bold text-text-tertiary">
                    ・
                  </span>
                  <span>{lure.attached_hook_size_5}</span>
                </>
              )}
            </div>

            {/* リングエリア */}
            {lure.attached_ring_size && (
              <div className="text-sm text-dark">
                <span className="text-xs font-bold text-text-tertiary">
                  R：
                </span>
                <span>{lure.attached_ring_size}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 画像エリア */}
      <div className="w-1/3 min-w-[120px] flex items-center justify-center">
        <Image
          src={`https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/thumbnails/${lure.lure_id}_thumb.png`}
          alt={lure.lure_name_ja}
          width={120}
          height={80}
          className="w-full h-auto object-cover"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          unoptimized
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/common/lure_tmb_default.webp";
          }}
        />
      </div>
    </Link>
  );
}

// React.memoでメモ化してパフォーマンス最適化
// lure.idが同じ場合は再レンダリングをスキップ
export default memo(LureCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.lure.id === nextProps.lure.id &&
    prevProps.priority === nextProps.priority
  );
});
