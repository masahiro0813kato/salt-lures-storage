import { useEffect } from 'react';

// セッション内の重複送信を防ぐ
const trackedIds = new Set<number>();

export function useTrackView(lureId: number | undefined) {
  useEffect(() => {
    if (!lureId || trackedIds.has(lureId)) return;

    trackedIds.add(lureId);

    fetch('/api/v1/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lureId }),
    }).catch(() => {
      // トラッキング失敗はユーザー体験に影響しないので無視
    });
  }, [lureId]);
}
