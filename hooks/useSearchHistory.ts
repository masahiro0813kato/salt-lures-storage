import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'lures_search_history';
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  // 初回マウント時にlocalStorageから読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // localStorage読み込み失敗時は空のまま
    }
  }, []);

  const addHistory = useCallback((keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      // 重複を除去して先頭に追加
      const filtered = prev.filter((item) => item !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage書き込み失敗は無視
      }
      return updated;
    });
  }, []);

  const removeHistory = useCallback((keyword: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item !== keyword);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // 無視
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 無視
    }
  }, []);

  return { history, addHistory, removeHistory, clearHistory };
}
