import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // 統計情報を取得
  const { count: lureCount } = await supabase
    .from("lures")
    .select("*", { count: "exact", head: true })
    .eq("is_available", true);

  const { count: makerCount } = await supabase
    .from("lure_makers")
    .select("*", { count: "exact", head: true });

  const { count: categoryCount } = await supabase
    .from("lure_categories")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">ルアー数</div>
          <div className="text-3xl font-bold text-gray-900">{lureCount || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">メーカー数</div>
          <div className="text-3xl font-bold text-gray-900">{makerCount || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">カテゴリー数</div>
          <div className="text-3xl font-bold text-gray-900">{categoryCount || 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">クイックアクション</h3>
        <div className="space-y-2">
          <Link
            href="/admin/lures"
            className="block px-4 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
          >
            ルアー管理 →
          </Link>
        </div>
      </div>
    </div>
  );
}
