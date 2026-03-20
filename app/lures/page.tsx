import { createStaticClient } from "@/lib/supabase/static";
import LuresPageClient from "@/components/organisms/LuresPageClient";

// ISR設定: 1時間ごとに再生成
export const revalidate = 3600;

export default async function LuresPage() {
  // サーバーサイドで全ルアーのリンクを取得（SEO用）
  const supabase = createStaticClient();
  const { data: lures } = await supabase
    .from("lures")
    .select("id, url_code, lure_name_ja")
    .eq("is_available", true)
    .order("lure_name_ja", { ascending: true });

  return (
    <>
      <LuresPageClient />
      {/* Googlebot向け: SSRされた全ルアーへの内部リンク一覧 */}
      <nav aria-label="ルアー一覧" className="sr-only">
        <ul>
          {lures?.map((lure) => (
            <li key={lure.id}>
              <a href={`/lures/${lure.id}-${lure.url_code}`}>
                {lure.lure_name_ja}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
