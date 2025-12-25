import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lure Database - ルアーデータベース',
  description: '釣具メーカーの公式サイトから製品情報を自動収集し、統一されたデータベースとして提供する',
  keywords: ['ルアー', 'フック', '釣り', 'データベース', '検索'],
  authors: [{ name: 'Lure Database' }],
  openGraph: {
    title: 'Lure Database - ルアーデータベース',
    description: '釣具メーカーの公式サイトから製品情報を自動収集し、統一されたデータベースとして提供する',
    type: 'website',
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
        {children}
      </body>
    </html>
  );
}
