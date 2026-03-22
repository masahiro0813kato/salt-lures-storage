"use client";

import { useTrackView } from "@/hooks/useTrackView";

interface ViewTrackerProps {
  lureId: number;
  lureName?: string;
  makerName?: string;
}

export default function ViewTracker({ lureId, lureName, makerName }: ViewTrackerProps) {
  useTrackView(lureId, { lureName, makerName });
  return null;
}
