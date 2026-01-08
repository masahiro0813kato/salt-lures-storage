"use client";

import { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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
  const parentRef = useRef<HTMLDivElement>(null);

  // TanStack Virtual の設定
  const rowVirtualizer = useVirtualizer({
    count: lures.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140, // カードの推定高さ
    overscan: 3, // 上下3件分を事前レンダリング
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // 無限スクロール: 最下部到達検知
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) return;

    // 最後のアイテムが表示され、まだデータがある場合は追加読み込み
    if (
      lastItem.index >= lures.length - 1 &&
      hasMore &&
      !isLoading &&
      !isFetchingMore
    ) {
      onLoadMore();
    }
  }, [virtualItems, lures.length, hasMore, isLoading, isFetchingMore, onLoadMore]);

  // ローディング中の表示
  if (isLoading && lures.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-text-secondary">読み込み中...</div>
      </div>
    );
  }

  // 検索結果0件
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
      {/* 仮想スクロールコンテナ */}
      <div
        ref={parentRef}
        className="relative"
        style={{
          height: "100%",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
        }}
      >
        {/* 全体の高さを確保 */}
        <div
          style={{
            height: `${totalSize}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {/* 仮想化されたアイテム */}
          {virtualItems.map((virtualItem) => {
            const lure = lures[virtualItem.index];
            const isFirst = virtualItem.index === 0;
            const isSecond = virtualItem.index === 1;

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
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
      </div>

      {/* 追加読み込み中のインジケーター */}
      {isFetchingMore && (
        <div className="flex justify-center items-center py-4">
          <div className="text-text-secondary text-sm">読み込み中...</div>
        </div>
      )}

      {/* すべて読み込み済み */}
      {!hasMore && lures.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <div className="text-text-secondary text-sm">
            すべて読み込みました（{lures.length}件 / 全{total}件）
          </div>
        </div>
      )}

      {/* 現在の表示件数 */}
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
