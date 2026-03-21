"use client";

import { useEffect } from "react";

export default function LazyGTM({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    // ページ表示完了後にGTMを遅延読み込み
    const timer = setTimeout(() => {
      // dataLayer初期化
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });

      // GTMスクリプト挿入
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      script.async = true;
      document.head.appendChild(script);
    }, 3000); // 3秒後に読み込み

    return () => clearTimeout(timer);
  }, [gtmId]);

  return null;
}
