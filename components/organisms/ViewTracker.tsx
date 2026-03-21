"use client";

import { useTrackView } from "@/hooks/useTrackView";

export default function ViewTracker({ lureId }: { lureId: number }) {
  useTrackView(lureId);
  return null;
}
