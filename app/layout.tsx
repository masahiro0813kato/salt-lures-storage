import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import MobileFooter from "@/components/organisms/MobileFooter";
import LazyGTM from "@/components/organisms/LazyGTM";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://salt-lure-storage.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SLS - Salt Lure Storage | ルアーのフックサイズがすぐわかる",
    template: "%s | SLS - Salt Lure Storage",
  },
  description:
    "フック交換のときフックサイズがわからない、探すのが大変。シーバス用ソルトルアーのフックサイズ・リングサイズ・スペックをメーカー横断で検索できるデータベースサイトです。",
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
    title: "SLS - Salt Lure Storage | ルアーのフックサイズがすぐわかる",
    description:
      "フック交換のときフックサイズがわからない、探すのが大変。シーバス用ソルトルアーのフックサイズ・リングサイズ・スペックをメーカー横断で検索できるデータベースサイトです。",
    siteName: "SLS - Salt Lure Storage",
  },
  twitter: {
    card: "summary_large_image",
    title: "SLS - Salt Lure Storage | ルアーのフックサイズがすぐわかる",
    description:
      "フック交換のときフックサイズがわからない、探すのが大変。シーバス用ソルトルアーのフックサイズ・リングサイズ・スペックをメーカー横断で検索できるデータベースサイトです。",
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
      <body className="antialiased" suppressHydrationWarning>
        <LazyGTM gtmId="GTM-M2P73Z58" />
        <ReactQueryProvider>
          {children}
          <MobileFooter />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
