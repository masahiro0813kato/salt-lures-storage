import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function checkAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { supabase: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { supabase, error: null };
}

// GET: ルアー詳細
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, error: authError } = await checkAuth();
  if (authError) return authError;

  const { id } = await params;

  const { data, error } = await supabase!
    .from("lures")
    .select(
      `*, lure_maker:lure_makers(id, lure_maker_name_ja, lure_maker_name_en), lure_category:lure_categories(id, category_name_ja)`
    )
    .eq("id", parseInt(id, 10))
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT: ルアー更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, error: authError } = await checkAuth();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();

  // 更新不可フィールドを除外
  delete body.id;
  delete body.created_at;
  delete body.lure_maker;
  delete body.lure_category;

  const { data, error } = await supabase!
    .from("lures")
    .update(body)
    .eq("id", parseInt(id, 10))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE: ルアー削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, error: authError } = await checkAuth();
  if (authError) return authError;

  const { id } = await params;

  const { error } = await supabase!
    .from("lures")
    .delete()
    .eq("id", parseInt(id, 10));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
