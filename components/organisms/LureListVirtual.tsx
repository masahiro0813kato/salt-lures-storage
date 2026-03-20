"use client";

import { useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import LureCard from "./LureCard";
import type { LureWithRelations } from "@/types/database";

interface LureListVirtualProps {
  lures: LureWithRelations[];
  total: number;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function LureListVirtual({
  lures,
  total,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
}: LureListVirtualProps) {
  const rowVirtualizer = useWindowVirtualizer({
    count: lures.length,
    estimateSize: () => 140,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // 無限スクロール: 最下部到達検知
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= lures.length - 1 &&
      hasMore &&
      !isLoading &&
      !isFetchingMore
    ) {
      onLoadMore();
    }
  }, [virtualItems, lures.length, hasMore, isLoading, isFetchingMore, onLoadMore]);

  if (isLoading && lures.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-text-secondary">読み込み中...</div>
      </div>
    );
  }

  if (!isLoading && lures.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-text-secondary">
          検索条件に該当するルアーはありません
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          height: `${totalSize}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualItem) => {
          const lure = lures[virtualItem.index];
          const isFirst = virtualItem.index === 0;
          const isSecond = virtualItem.index === 1;

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="pb-2"
            >
              <LureCard
                lure={lure}
                priority={isFirst || isSecond}
              />
            </div>
          );
        })}
      </div>

      {isFetchingMore && (
        <div className="flex justify-center items-center py-4">
          <div className="text-text-secondary text-sm">読み込み中...</div>
        </div>
      )}

      {!hasMore && lures.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <div className="text-text-secondary text-sm">
            すべて読み込みました（{lures.length}件 / 全{total}件）
          </div>
        </div>
      )}

      {lures.length > 0 && hasMore && (
        <div className="flex justify-center items-center py-2">
          <div className="text-text-tertiary text-xs">
            {lures.length}件を表示中 / 全{total}件
          </div>
        </div>
      )}
    </div>
  );
}
