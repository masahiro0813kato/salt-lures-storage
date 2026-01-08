"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/organisms/Header";
import SearchBar from "@/components/organisms/SearchBar";
import StickyHeader, { StickyHeaderProvider } from "@/components/organisms/StickyHeader";
import LureListVirtual from "@/components/organisms/LureListVirtual";
import ScrollToTop from "@/components/organisms/ScrollToTop";
import { useLuresInfinite } from "@/hooks/useLuresInfinite";
import { useEffect, useRef } from "react";

function LuresContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const scrollRestoredRef = useRef(false);

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

  // スクロール位置の保存と復元
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('luresScrollPosition');
    const savedSearch = sessionStorage.getItem('luresSearchKey');

    // 検索条件が変わった場合は位置をクリア
    if (savedSearch !== search) {
      sessionStorage.removeItem('luresScrollPosition');
      sessionStorage.setItem('luresSearchKey', search);
      scrollRestoredRef.current = false;
      window.scrollTo(0, 0);
      return;
    }

    // TanStack Queryがキャッシュからデータを即座に復元するので、
    // luresが存在すれば即座にスクロール位置を復元できる
    if (savedPosition && lures.length > 0 && !scrollRestoredRef.current) {
      const scrollY = parseInt(savedPosition);
      scrollRestoredRef.current = true;

      // 次のフレームでスクロール復元（DOMレンダリング完了を待つ）
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
        sessionStorage.removeItem('luresScrollPosition');
      });
    }
  }, [lures.length, search]);

  // スクロール位置の保存
  useEffect(() => {
    if (lures.length === 0) return;

    let isNavigating = false;

    const saveScrollPosition = () => {
      if (isNavigating) return;

      if (lures.length > 0) {
        sessionStorage.setItem('luresScrollPosition', window.scrollY.toString());
      }
    };

    // スクロール時に保存
    window.addEventListener('scroll', saveScrollPosition);

    // リンククリック時に確実に保存
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
  }, [lures.length]);

  return (
    <StickyHeaderProvider>
      <StickyHeader>
        <Header />
        <SearchBar latestSearchKey={search} />
        {total > 0 && (
          <div className="px-4 pb-2">
            <div className="text-text-secondary text-sm">全{total}件</div>
          </div>
        )}
      </StickyHeader>

      <main className="pt-[200px]">
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

      <ScrollToTop />
    </StickyHeaderProvider>
  );
}

export default function LuresPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LuresContent />
    </Suspense>
  );
}
