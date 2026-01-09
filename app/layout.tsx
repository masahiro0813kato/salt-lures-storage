import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
// ▼ 追加: GTMのインポート
import { GoogleTagManager } from "@next/third-parties/google";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Salt Lure Storage - ソルトルアーデータベース",
    template: "%s | Salt Lure Storage",
  },
  description:
    "釣具メーカーの公式サイトから製品情報を自動収集し、統一されたデータベースとして提供する",
  verification: {
    google: "mPXec5_5rqm6q715I0yzarx6oRGaDDqc4LRsMpsDnKI",
  },
  keywords: [
    "ソルトルアー",
    "ルアー",
    "フックサイズ",
    "釣り",
    "シーバス",
    "データベース",
    "検索",
  ],
  authors: [{ name: "Salt Lure Storage" }],
  creator: "Salt Lure Storage",
  publisher: "Salt Lure Storage",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    title: "Salt Lure Storage - ソルトルアーデータベース",
    description:
      "釣具メーカーの公式サイトから製品情報を自動収集し、統一されたデータベースとして提供する",
    siteName: "Salt Lure Storage",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salt Lure Storage - ソルトルアーデータベース",
    description:
      "釣具メーカーの公式サイトから製品情報を自動収集し、統一されたデータベースとして提供する",
    creator: "@yourtwitterhandle",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* ▼ 追加: GTMコンポーネント (bodyタグの前に配置するのが一般的です) */}
      <GoogleTagManager gtmId="GTM-M2P73Z58" />

      <body className="antialiased" suppressHydrationWarning>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
