import { useInfiniteQuery } from '@tanstack/react-query';
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

  // 全ページのluresを結合（APIの順序をそのまま使用）
  const lures = data?.pages.flatMap((page) => page.lures) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const hasMore = hasNextPage ?? false;

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
