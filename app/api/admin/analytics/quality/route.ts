import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 画像なしルアー（bg_colorsがnull = 画像が存在しない可能性が高い）
  const { data: noImage } = await supabase
    .from("lures")
    .select("id, lure_name_ja, lure_id, lure_maker:lure_makers(lure_maker_name_ja)")
    .eq("is_available", true)
    .is("bg_colors", null)
    .order("lure_name_ja");

  // シリーズ未設定ルアー
  const { data: noSeries } = await supabase
    .from("lures")
    .select("id, lure_name_ja, lure_id, lure_maker:lure_makers(lure_maker_name_ja)")
    .eq("is_available", true)
    .is("lure_series_ja", null)
    .order("lure_name_ja");

  // スペック未入力ルアー（フックサイズまたは重さが未入力）
  const { data: noSpecs } = await supabase
    .from("lures")
    .select("id, lure_name_ja, lure_id, attached_hook_size_1, attached_ring_size, lure_weight, lure_length, lure_maker:lure_makers(lure_maker_name_ja)")
    .eq("is_available", true)
    .or("attached_hook_size_1.is.null,attached_ring_size.is.null,lure_weight.is.null,lure_length.is.null")
    .order("lure_name_ja");

  return NextResponse.json({
    noImage: noImage || [],
    noSeries: noSeries || [],
    noSpecs: (noSpecs || []).map((l: Record<string, unknown>) => ({
      ...l,
      missing: [
        !l.attached_hook_size_1 && "フックサイズ",
        !l.attached_ring_size && "リングサイズ",
        !l.lure_weight && "重さ",
        !l.lure_length && "長さ",
      ].filter(Boolean),
    })),
  });
}
