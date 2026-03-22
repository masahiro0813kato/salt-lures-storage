import { useEffect } from 'react';
import { sendGAEvent } from '@/lib/ga';

// セッション内の重複送信を防ぐ
const trackedIds = new Set<number>();

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
    sendGAEvent('view_lure', {
      lure_id: lureId,
      lure_name: options?.lureName || '',
      maker_name: options?.makerName || '',
    });
  }, [lureId, options?.lureName, options?.makerName]);
}
