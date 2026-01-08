import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  title: {
    default: 'ソルトルアーデータベース | Salt Lure Storage',
    template: '%s | Salt Lure Storage',
  },
  description: 'ソルトルアーを検索してフックサイズを確認できます。',
  keywords: ['ソルトルアー', 'ルアー一覧', 'フックサイズ', '釣り', 'シーバス', '検索'],
  openGraph: {
    title: 'ソルトルアーデータベース | Salt Lure Storage',
    description: 'ソルトルアーを検索してフックサイズを確認できます。',
    url: `${siteUrl}/lures`,
    type: 'website',
    locale: 'ja_JP',
    siteName: 'Salt Lure Storage',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ソルトルアーデータベース | Salt Lure Storage',
    description: 'ソルトルアーを検索してフックサイズを確認できます。',
  },
  alternates: {
    canonical: `${siteUrl}/lures`,
  },
};

export default function LuresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
