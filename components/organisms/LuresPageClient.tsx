"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/organisms/Header";
import SearchBar from "@/components/organisms/SearchBar";
import StickyHeader, { StickyHeaderProvider } from "@/components/organisms/StickyHeader";
import LureListVirtual from "@/components/organisms/LureListVirtual";
import LureDetailPanel from "@/components/organisms/LureDetailPanel";
import ScrollToTop from "@/components/organisms/ScrollToTop";
import { useLuresInfinite } from "@/hooks/useLuresInfinite";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { LureWithRelations } from "@/types/database";

function LuresContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const scrollRestoredRef = useRef(false);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isWideDesktop = useMediaQuery("(min-width: 1024px)");
  const [selectedLure, setSelectedLure] = useState<LureWithRelations | null>(null);
  const isManualSelectRef = useRef(false);

  const handleSelectLure = useCallback((lure: LureWithRelations) => {
    isManualSelectRef.current = true;
    setSelectedLure(lure);
  }, []);

  const {
    lures,
    total,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
  } = useLuresInfinite({
    searchKey: search,
    pageSize: 20,
  });

  // 検索変更を追跡（auto-selectの制御に使用）
  const prevSearchRef = useRef(search);
  const searchChangedRef = useRef(false);

  // 検索変更時に選択をリセット
  useEffect(() => {
    if (prevSearchRef.current !== search) {
      prevSearchRef.current = search;
      searchChangedRef.current = true;
      setSelectedLure(null);
      if (isDesktop) {
        const url = search ? `/lures?search=${search}` : "/lures";
        window.history.replaceState(null, "", url);
      }
    }
  }, [search, isDesktop]);

  // デスクトップ: 自動選択（URLのselectedパラメータ or 最初のルアー）
  useEffect(() => {
    if (!isDesktop || selectedLure || lures.length === 0) return;

    if (searchChangedRef.current) {
      if (!isLoading) {
        searchChangedRef.current = false;
        // URLのselectedパラメータがあればそのルアーを選択
        const selectedId = searchParams.get("selected");
        if (selectedId) {
          const found = lures.find((l) => l.id === parseInt(selectedId, 10));
          if (found) {
            setSelectedLure(found);
            return;
          }
        }
        setSelectedLure(lures[0]);
      }
    } else {
      const selectedId = searchParams.get("selected");
      if (selectedId) {
        const found = lures.find((l) => l.id === parseInt(selectedId, 10));
        if (found) {
          setSelectedLure(found);
          return;
        }
      }
      setSelectedLure(lures[0]);
    }
  }, [isDesktop, lures, selectedLure, isLoading, searchParams]);

  // デスクトップ: 選択ルアー変更時にURLを同期
  useEffect(() => {
    if (isDesktop && selectedLure) {
      if (search) {
        // 検索中: 検索パラメータを維持しつつ選択IDを追加
        const url = `/lures?search=${encodeURIComponent(search)}&selected=${selectedLure.id}`;
        window.history.replaceState(null, "", url);
      } else {
        // 検索なし: ルアー詳細URLに変更
        const lureUrl = `/lures/${selectedLure.id}-${selectedLure.url_code}`;
        window.history.replaceState(null, "", lureUrl);
      }
    }
  }, [isDesktop, selectedLure, search]);

  // モバイル: スクロール位置の保存と復元
  useEffect(() => {
    if (isDesktop) return;

    const savedPosition = sessionStorage.getItem('luresScrollPosition');
    const savedSearch = sessionStorage.getItem('luresSearchKey');

    if (savedSearch !== search) {
      sessionStorage.removeItem('luresScrollPosition');
      sessionStorage.setItem('luresSearchKey', search);
      scrollRestoredRef.current = false;
      window.scrollTo(0, 0);
      return;
    }

    if (savedPosition && lures.length > 0 && !scrollRestoredRef.current) {
      const scrollY = parseInt(savedPosition);
      scrollRestoredRef.current = true;

      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
        sessionStorage.removeItem('luresScrollPosition');
      });
    }
  }, [lures.length, search, isDesktop]);

  // モバイル: スクロール位置の保存
  useEffect(() => {
    if (isDesktop) return;
    if (lures.length === 0) return;

    let isNavigating = false;

    const saveScrollPosition = () => {
      if (isNavigating) return;
      if (lures.length > 0) {
        sessionStorage.setItem('luresScrollPosition', window.scrollY.toString());
      }
    };

    window.addEventListener('scroll', saveScrollPosition);

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="/lures/"]');
      if (link) {
        isNavigating = true;
        const currentScrollY = window.scrollY;
        sessionStorage.setItem('luresScrollPosition', currentScrollY.toString());
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('scroll', saveScrollPosition);
      document.removeEventListener('click', handleClick, true);
    };
  }, [lures.length, isDesktop]);

  return (
    <StickyHeaderProvider>
      <StickyHeader disableHide={isDesktop}>
        <Header />
        <SearchBar latestSearchKey={search} />
        {total > 0 && (
          <div className="px-4 pb-2">
            <div className="text-text-secondary text-sm">全{total}件</div>
          </div>
        )}
      </StickyHeader>

      {isDesktop ? (
        /* デスクトップ: マスター・ディテールレイアウト */
        <main className="fixed top-0 left-0 right-0 bottom-0 pt-[200px] flex">
          {/* 左パネル: 一覧 */}
          <div
            ref={leftPanelRef}
            className="w-[420px] min-w-[420px] overflow-y-auto px-4 pt-1"
          >
            <LureListVirtual
              lures={lures}
              total={total}
              isLoading={isLoading}
              isFetchingMore={isFetchingMore}
              hasMore={hasMore}
              onLoadMore={loadMore}
              selectedLureId={selectedLure?.id}
              onSelectLure={handleSelectLure}
              scrollContainerRef={leftPanelRef}
            />
          </div>
          {/* 右パネル: 詳細 */}
          <div className="flex-1 overflow-y-auto">
            {selectedLure ? (
              <LureDetailPanel key={selectedLure.id} lure={selectedLure} horizontal={isWideDesktop} />
            ) : (
              <div className="flex items-center justify-center h-full text-text-secondary">
                ルアーを選択してください
              </div>
            )}
          </div>
        </main>
      ) : (
        /* モバイル: 従来のレイアウト */
        <main className="pt-[200px] max-w-[420px] mx-auto">
          <div className="px-4">
            <LureListVirtual
              lures={lures}
              total={total}
              isLoading={isLoading}
              isFetchingMore={isFetchingMore}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          </div>
        </main>
      )}

      {!isDesktop && <ScrollToTop />}
    </StickyHeaderProvider>
  );
}

export default function LuresPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LuresContent />
    </Suspense>
  );
}
