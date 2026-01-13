"use client";

import { useEffect } from "react";

export default function ScrollReset() {
  useEffect(() => {
    // ページ読み込み時にスクロール位置を0にリセット
    window.scrollTo(0, 0);
  }, []);

  return null;
}
