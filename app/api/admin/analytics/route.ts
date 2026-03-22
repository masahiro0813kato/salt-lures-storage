import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get("period") || "monthly";
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  // 期間の計算
  const now = new Date();
  let since: Date;

  switch (period) {
    case "today":
      since = new Date(now);
      since.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      since = new Date(now);
      since.setDate(since.getDate() - 7);
      break;
    case "monthly":
      since = new Date(now);
      since.setDate(since.getDate() - 30);
      break;
    case "yearly":
      since = new Date(now);
      since.setFullYear(since.getFullYear() - 1);
      break;
    case "all":
      since = new Date(0);
      break;
    default:
      since = new Date(now);
      since.setDate(since.getDate() - 30);
  }

  // ランキング取得
  const { data: rankings, error: rankingsError } = await supabase
    .rpc("get_lure_rankings", {
      since_date: since.toISOString(),
      result_limit: limit,
    });

  if (rankingsError) {
    console.error("Rankings error:", rankingsError);
    return NextResponse.json({ error: rankingsError.message }, { status: 500 });
  }

  // サマリー: 今日の閲覧数
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const { count: todayCount } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .gte("viewed_at", todayStart.toISOString());

  // サマリー: 今月の閲覧数
  const monthStart = new Date(now);
  monthStart.setDate(monthStart.getDate() - 30);
  const { count: monthCount } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .gte("viewed_at", monthStart.toISOString());

  // サマリー: 全期間の閲覧数
  const { count: totalCount } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    rankings: rankings || [],
    summary: {
      today: todayCount || 0,
      month: monthCount || 0,
      total: totalCount || 0,
    },
  });
}
