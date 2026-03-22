import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get("days") || "30", 10);

  const now = new Date();
  const since = new Date(now);
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase.rpc("get_daily_views", {
    since_date: since.toISOString(),
    until_date: now.toISOString(),
  });

  if (error) {
    console.error("Daily views error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 日付が抜けている日を0で埋める
  const viewMap = new Map<string, number>();
  (data || []).forEach((d: { view_date: string; view_count: number }) => {
    viewMap.set(d.view_date, d.view_count);
  });

  const filled: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    filled.push({
      date: dateStr,
      count: viewMap.get(dateStr) || 0,
    });
  }

  return NextResponse.json({ daily: filled });
}
