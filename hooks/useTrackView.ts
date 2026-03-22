import { useEffect } from 'react';

// セッション内の重複送信を防ぐ
const trackedIds = new Set<number>();

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface UseTrackViewOptions {
  lureName?: string;
  makerName?: string;
}

export function useTrackView(lureId: number | undefined, options?: UseTrackViewOptions) {
  useEffect(() => {
    if (!lureId || trackedIds.has(lureId)) return;

    trackedIds.add(lureId);

    // 自前DB記録
    fetch('/api/v1/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lureId }),
    }).catch(() => {});

    // GA4カスタムイベント送信
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_lure', {
        lure_id: lureId,
        lure_name: options?.lureName || '',
        maker_name: options?.makerName || '',
      });
    }
  }, [lureId, options?.lureName, options?.makerName]);
}
