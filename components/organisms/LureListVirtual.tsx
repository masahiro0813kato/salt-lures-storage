"use client";

import { useEffect, RefObject } from "react";
import { useWindowVirtualizer, useVirtualizer } from "@tanstack/react-virtual";
import LureCard from "./LureCard";
import type { LureWithRelations } from "@/types/database";

interface LureListVirtualProps {
  lures: LureWithRelations[];
  total: number;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  selectedLureId?: number;
  onSelectLure?: (lure: LureWithRelations) => void;
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
}

// 共通のローディング・空表示・フッター
function ListStatus({
  isLoading,
  luresLength,
  isFetchingMore,
  hasMore,
  total,
}: {
  isLoading: boolean;
  luresLength: number;
  isFetchingMore: boolean;
  hasMore: boolean;
  total: number;
}) {
  if (isLoading && luresLength === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-text-secondary">読み込み中...</div>
      </div>
    );
  }

  if (!isLoading && luresLength === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-text-secondary">
          検索条件に該当するルアーはありません
        </div>
      </div>
    );
  }

  return null;
}

function ListFooter({
  isFetchingMore,
  hasMore,
  luresLength,
  total,
}: {
  isFetchingMore: boolean;
  hasMore: boolean;
  luresLength: number;
  total: number;
}) {
  return (
    <>
      {isFetchingMore && (
        <div className="flex justify-center items-center py-4">
          <div className="text-text-secondary text-sm">読み込み中...</div>
        </div>
      )}

      {!hasMore && luresLength > 0 && (
        <div className="flex justify-center items-center py-4">
          <div className="text-text-secondary text-sm">
            すべて読み込みました（{luresLength}件 / 全{total}件）
          </div>
        </div>
      )}

      {luresLength > 0 && hasMore && (
        <div className="flex justify-center items-center py-2">
          <div className="text-text-tertiary text-xs">
            {luresLength}件を表示中 / 全{total}件
          </div>
        </div>
      )}
    </>
  );
}

// ウィンドウスクロール版（モバイル）
function WindowVirtualList({
  lures,
  total,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
  selectedLureId,
  onSelectLure,
}: Omit<LureListVirtualProps, 'scrollContainerRef'>) {
  const rowVirtualizer = useWindowVirtualizer({
    count: lures.length,
    estimateSize: () => 140,
    overscan: 5,
    measureElement: (element) => element?.getBoundingClientRect().height ?? 140,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;
    if (lastItem.index >= lures.length - 1 && hasMore && !isLoading && !isFetchingMore) {
      onLoadMore();
    }
  }, [virtualItems, lures.length, hasMore, isLoading, isFetchingMore, onLoadMore]);

  if (isLoading && lures.length === 0) {
    return <ListStatus isLoading={isLoading} luresLength={lures.length} isFetchingMore={isFetchingMore} hasMore={hasMore} total={total} />;
  }

  if (!isLoading && lures.length === 0) {
    return <ListStatus isLoading={isLoading} luresLength={lures.length} isFetchingMore={isFetchingMore} hasMore={hasMore} total={total} />;
  }

  return (
    <div>
      <div style={{ height: `${totalSize}px`, width: "100%", position: "relative" }}>
        {virtualItems.map((virtualItem) => {
          const lure = lures[virtualItem.index];
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
                priority={virtualItem.index < 2}
                isSelected={selectedLureId === lure.id}
                onSelect={onSelectLure}
              />
            </div>
          );
        })}
      </div>
      <ListFooter isFetchingMore={isFetchingMore} hasMore={hasMore} luresLength={lures.length} total={total} />
    </div>
  );
}

// コンテナスクロール版（デスクトップ）
function ContainerVirtualList({
  lures,
  total,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
  selectedLureId,
  onSelectLure,
  scrollContainerRef,
}: LureListVirtualProps & { scrollContainerRef: RefObject<HTMLDivElement | null> }) {
  const rowVirtualizer = useVirtualizer({
    count: lures.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 140,
    overscan: 5,
    measureElement: (element) => element?.getBoundingClientRect().height ?? 140,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;
    if (lastItem.index >= lures.length - 1 && hasMore && !isLoading && !isFetchingMore) {
      onLoadMore();
    }
  }, [virtualItems, lures.length, hasMore, isLoading, isFetchingMore, onLoadMore]);

  if (isLoading && lures.length === 0) {
    return <ListStatus isLoading={isLoading} luresLength={lures.length} isFetchingMore={isFetchingMore} hasMore={hasMore} total={total} />;
  }

  if (!isLoading && lures.length === 0) {
    return <ListStatus isLoading={isLoading} luresLength={lures.length} isFetchingMore={isFetchingMore} hasMore={hasMore} total={total} />;
  }

  return (
    <div>
      <div style={{ height: `${totalSize}px`, width: "100%", position: "relative" }}>
        {virtualItems.map((virtualItem) => {
          const lure = lures[virtualItem.index];
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
                priority={virtualItem.index < 2}
                isSelected={selectedLureId === lure.id}
                onSelect={onSelectLure}
              />
            </div>
          );
        })}
      </div>
      <ListFooter isFetchingMore={isFetchingMore} hasMore={hasMore} luresLength={lures.length} total={total} />
    </div>
  );
}

export default function LureListVirtual(props: LureListVirtualProps) {
  if (props.scrollContainerRef) {
    return <ContainerVirtualList {...props} scrollContainerRef={props.scrollContainerRef} />;
  }
  return <WindowVirtualList {...props} />;
}
