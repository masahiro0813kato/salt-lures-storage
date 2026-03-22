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
  const limit = parseInt(searchParams.get("limit") || "10", 10);

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

  const [makersRes, seriesRes] = await Promise.all([
    supabase.rpc("get_maker_rankings", {
      since_date: since.toISOString(),
      result_limit: limit,
    }),
    supabase.rpc("get_series_rankings", {
      since_date: since.toISOString(),
      result_limit: limit,
    }),
  ]);

  return NextResponse.json({
    makers: makersRes.data || [],
    series: seriesRes.data || [],
  });
}
