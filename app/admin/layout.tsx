import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: {
    default: "管理画面 | SLS",
    template: "%s | SLS 管理画面",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ログインページは認証不要
  // layout.tsxでは現在のパスが取得できないため、
  // 未認証時はchildrenをそのまま表示（login/page.tsxが表示される）
  if (!user) {
    return <div className="admin-reset">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex admin-reset">
      <AdminSidebar userEmail={user.email || ""} />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
