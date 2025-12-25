/**
 * カテゴリーデータCSVインポートスクリプト
 *
 * 使用方法:
 *   npx tsx scripts/import-categories.ts
 *
 * または package.json の scripts に追加済みの場合:
 *   npm run import:categories
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// 環境変数から Supabase 設定を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: 環境変数が設定されていません");
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください"
  );
  process.exit(1);
}

// Service Role Key を使用してクライアント作成（RLSをバイパス）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CSV行をパース（カンマ区切り、ダブルクォート対応）
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// CSVファイルを読み込み
function readCSV(filePath: string): Record<string, string>[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    throw new Error("CSVファイルにデータがありません");
  }

  const headers = parseCSVLine(lines[0]);
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    data.push(row);
  }

  return data;
}

// 文字列を適切な型に変換
function convertValue(value: string, key: string): any {
  if (value === "" || value === "null" || value === "NULL") {
    return null;
  }

  // 数値型のカラム
  const numericColumns = ["display_order"];

  if (numericColumns.includes(key)) {
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }

  // 真偽値型のカラム
  const booleanColumns = ["is_visible"];

  if (booleanColumns.includes(key)) {
    return value.toLowerCase() === "true" || value === "1";
  }

  return value;
}

// slugを生成（英語名からケバブケースに変換）
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// メイン処理
async function main() {
  const csvPath = path.join(__dirname, "data", "categories.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSVファイルが見つかりません: ${csvPath}`);
    console.error("scripts/data/categories.csv を作成してください");
    process.exit(1);
  }

  console.log("CSVファイルを読み込み中...");
  const rows = readCSV(csvPath);
  console.log(`${rows.length} 件のデータを検出`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 2; // ヘッダー行 + 0-indexed

    try {
      // slugが空の場合は英語名から自動生成
      let slug = row.slug;
      if (!slug || slug.trim() === "") {
        slug = generateSlug(row.category_name_en || "");
        if (!slug) {
          throw new Error("slugを生成できません（category_name_enが必要です）");
        }
        console.log(`  行${rowNumber}: slug を自動生成: ${slug}`);
      }

      // データを整形
      const categoryData: Record<string, any> = {
        slug,
        category_name_ja: row.category_name_ja,
        category_name_en: row.category_name_en,
        description: convertValue(row.description || "", "description"),
        display_order: convertValue(row.display_order || "0", "display_order"),
        is_visible: convertValue(row.is_visible || "true", "is_visible"),
      };

      // Supabase に挿入
      const { data, error } = await supabase
        .from("lure_categories")
        .insert(categoryData)
        .select("id, slug, category_name_ja")
        .single();

      if (error) {
        throw error;
      }

      console.log(
        `✓ 行${rowNumber}: ID=${data.id}, ${data.category_name_ja} (${data.slug})`
      );
      successCount++;
    } catch (error: any) {
      console.error(`✗ 行${rowNumber}: エラー - ${error.message}`);
      errorCount++;
    }
  }

  console.log("\n--- 結果 ---");
  console.log(`成功: ${successCount} 件`);
  console.log(`失敗: ${errorCount} 件`);
}

main().catch((error) => {
  console.error("予期せぬエラー:", error);
  process.exit(1);
});
