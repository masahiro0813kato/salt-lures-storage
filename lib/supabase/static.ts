import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// ビルド時（generateStaticParams等）で使用するcookie不要のクライアント
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
