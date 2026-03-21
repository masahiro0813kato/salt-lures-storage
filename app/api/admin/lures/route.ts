import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// 認証チェック
async function checkAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { supabase: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { supabase, error: null };
}

// GET: ルアー一覧
export async function GET(request: NextRequest) {
  const { supabase, error: authError } = await checkAuth();
  if (authError) return authError;

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = (page - 1) * limit;

  let query = supabase!
    .from("lures")
    .select(
      `*, lure_maker:lure_makers(id, lure_maker_name_ja, lure_maker_name_en), lure_category:lure_categories(id, category_name_ja)`,
      { count: "exact" }
    )
    .order("id", { ascending: false });

  if (search) {
    query = query.or(
      `lure_name_ja.ilike.%${search}%,lure_name_en.ilike.%${search}%`
    );
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    lures: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

// POST: ルアー作成
export async function POST(request: NextRequest) {
  const { supabase, error: authError } = await checkAuth();
  if (authError) return authError;

  const body = await request.json();

  // lure_idが未入力の場合は自動生成
  if (!body.lure_id) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    body.lure_id = `lure-${timestamp}-${random}`;
  }

  // url_code自動生成
  if (!body.url_code) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let urlCode = "";
    for (let i = 0; i < 8; i++) {
      urlCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    body.url_code = urlCode;
  }

  // デフォルト値
  body.is_available = body.is_available ?? true;
  body.view_count = body.view_count ?? 0;
  body.data_version = body.data_version ?? 1;

  const { data, error } = await supabase!
    .from("lures")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
