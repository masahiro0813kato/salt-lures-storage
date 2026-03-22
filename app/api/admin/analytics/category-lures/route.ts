import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const categoryName = searchParams.get("category");
  const period = searchParams.get("period") || "monthly";
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  if (!categoryName) {
    return NextResponse.json({ error: "category is required" }, { status: 400 });
  }

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

  const { data, error } = await supabase.rpc("get_lure_rankings_by_category", {
    category_name_param: categoryName,
    since_date: since.toISOString(),
    result_limit: limit,
  });

  if (error) {
    console.error("Category lures error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lures: data || [] });
}
