import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const lureId = formData.get("lureId") as string;
  const type = formData.get("type") as string; // "main" or "thumb"

  if (!file || !lureId || !type) {
    return NextResponse.json({ error: "file, lureId, type are required" }, { status: 400 });
  }

  // ファイル名とパスを決定
  const fileName = `${lureId}_${type}.png`;
  const folder = type === "main" ? "main" : "thumbnails";
  const filePath = `lures/${folder}/${fileName}`;

  // 画像をBufferに変換
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  // Supabase Storageにアップロード（既存ファイルは上書き）
  const { error } = await supabase.storage
    .from("lure-images")
    .upload(filePath, buffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("lure-images")
    .getPublicUrl(filePath);

  return NextResponse.json({
    url: urlData.publicUrl,
    path: filePath,
    fileName,
  });
}
