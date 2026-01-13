import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://salt-lure-storage.com';

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/lures`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // 動的ページ（ルアー詳細）
  const supabase = await createClient();
  const { data: lures } = await supabase
    .from('lures')
    .select('id, url_code, updated_at')
    .eq('is_available', true);

  const lurePages: MetadataRoute.Sitemap = lures?.map((lure) => ({
    url: `${baseUrl}/lures/${lure.id}-${lure.url_code}`,
    lastModified: lure.updated_at ? new Date(lure.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  return [...staticPages, ...lurePages];
}
