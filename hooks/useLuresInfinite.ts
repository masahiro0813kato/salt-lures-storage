import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { LureWithRelations } from '@/types/database';

interface UseLuresInfiniteParams {
  searchKey?: string;
  pageSize?: number;
}

interface LuresResponse {
  lures: LureWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseLuresInfiniteResult {
  lures: LureWithRelations[];
  total: number;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => void;
  reset: () => void;
}

// 日本語対応のソート関数
function sortLures(lures: LureWithRelations[]): LureWithRelations[] {
  // 日本語のCollator（あいうえお順）
  const jaCollator = new Intl.Collator('ja-JP', {
    numeric: true,
    sensitivity: 'base',
  });

  return [...lures].sort((a, b) => {
    const nameA = a.lure_name_ja || '';
    const nameB = b.lure_name_ja || '';

    // 先頭文字の種別を判定
    const getCharType = (str: string): 'japanese' | 'alphabet' | 'number' => {
      if (!str) return 'japanese';
      const firstChar = str.charAt(0);

      // 数字チェック
      if (/[0-9]/.test(firstChar)) return 'number';

      // アルファベットチェック
      if (/[A-Za-z]/.test(firstChar)) return 'alphabet';

      // それ以外は日本語とみなす（ひらがな、カタカナ、漢字など）
      return 'japanese';
    };

    const typeA = getCharType(nameA);
    const typeB = getCharType(nameB);

    // 異なる種別の場合：日本語 < アルファベット < 数字
    if (typeA !== typeB) {
      const order = { japanese: 0, alphabet: 1, number: 2 };
      return order[typeA] - order[typeB];
    }

    // 同じ種別の場合は日本語Collatorで比較
    return jaCollator.compare(nameA, nameB);
  });
}

async function fetchLures({
  searchKey,
  pageSize,
  pageParam = 1,
}: {
  searchKey: string;
  pageSize: number;
  pageParam: number;
}): Promise<LuresResponse> {
  const params = new URLSearchParams({
    limit: pageSize.toString(),
    page: pageParam.toString(),
  });

  if (searchKey) {
    params.append('search', searchKey);
  }

  const response = await fetch(`/api/v1/lures?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch lures: ${response.statusText}`);
  }

  return response.json();
}

export function useLuresInfinite({
  searchKey = '',
  pageSize = 20,
}: UseLuresInfiniteParams = {}): UseLuresInfiniteResult {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['lures', searchKey],
    queryFn: ({ pageParam }) =>
      fetchLures({ searchKey, pageSize, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page;
      const totalPages = lastPage.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    // キャッシュ設定はProviderでグローバルに設定済み
  });

  // 全ページのluresを結合
  const rawLures = data?.pages.flatMap((page) => page.lures) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const hasMore = hasNextPage ?? false;

  // ソート適用（useMemoでパフォーマンス最適化）
  const lures = useMemo(() => sortLures(rawLures), [rawLures]);

  return {
    lures,
    total,
    isLoading,
    isFetchingMore: isFetchingNextPage,
    hasMore,
    error: error as Error | null,
    loadMore: () => {
      if (hasMore && !isFetching) {
        fetchNextPage();
      }
    },
    reset: () => {
      refetch();
    },
  };
}
