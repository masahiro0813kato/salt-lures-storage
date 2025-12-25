/**
 * ルアーデータCSVインポートスクリプト
 *
 * 使用方法:
 *   npx tsx scripts/import-lures.ts
 *
 * または package.json の scripts に追加済みの場合:
 *   npm run import:lures
 *
 * CSVでは以下の名前で指定可能（自動的にIDに変換されます）:
 *   - lure_maker_name_en: メーカー英語名 → lure_maker_id
 *   - category_name_ja: カテゴリー日本語名 → lure_category_id
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// 環境変数から Supabase 設定を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: 環境変数が設定されていません");
  console.error("NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください");
  process.exit(1);
}

// Service Role Key を使用してクライアント作成（RLSをバイパス）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// メーカー名 → ID のマッピングをキャッシュ
let makerNameToId: Map<string, number> | null = null;

// カテゴリー名 → ID のマッピングをキャッシュ
let categoryNameToId: Map<string, number> | null = null;

// メーカー名からIDを取得
async function getMakerIdByName(name: string): Promise<number | null> {
  if (!makerNameToId) {
    // 初回のみDBから全件取得してキャッシュ
    const { data, error } = await supabase
      .from("lure_makers")
      .select("id, lure_maker_name_en");

    if (error) {
      console.error("メーカー一覧の取得に失敗:", error.message);
      return null;
    }

    makerNameToId = new Map();
    data?.forEach((maker) => {
      makerNameToId!.set(maker.lure_maker_name_en.toLowerCase(), maker.id);
    });
  }

  return makerNameToId.get(name.toLowerCase()) || null;
}

// カテゴリー名からIDを取得
async function getCategoryIdByName(name: string): Promise<number | null> {
  if (!categoryNameToId) {
    // 初回のみDBから全件取得してキャッシュ
    const { data, error } = await supabase
      .from("lure_categories")
      .select("id, category_name_ja");

    if (error) {
      console.error("カテゴリー一覧の取得に失敗:", error.message);
      return null;
    }

    categoryNameToId = new Map();
    data?.forEach((category) => {
      categoryNameToId!.set(category.category_name_ja, category.id);
    });
  }

  return categoryNameToId.get(name) || null;
}

// 5文字のランダム英数字を生成
function generateUrlCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// url_code の重複チェック
async function getUniqueUrlCode(): Promise<string> {
  let urlCode = generateUrlCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const { data } = await supabase
      .from("lures")
      .select("url_code")
      .eq("url_code", urlCode)
      .single();

    if (!data) {
      return urlCode;
    }

    urlCode = generateUrlCode();
    attempts++;
  }

  throw new Error("ユニークなurl_codeを生成できませんでした");
}

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
  const numericColumns = [
    "lure_maker_id",
    "lure_category_id",
    "lure_length",
    "lure_weight",
    "lure_range_min",
    "lure_range_max",
    "view_count",
    "data_version",
  ];

  if (numericColumns.includes(key)) {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  // 真偽値型のカラム
  const booleanColumns = ["is_available"];

  if (booleanColumns.includes(key)) {
    return value.toLowerCase() === "true" || value === "1";
  }

  return value;
}

// メイン処理
async function main() {
  const csvPath = path.join(__dirname, "data", "lures.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSVファイルが見つかりません: ${csvPath}`);
    console.error("scripts/data/lures.csv を作成してください");
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
      // url_code が空の場合は自動生成
      let urlCode = row.url_code;
      if (!urlCode || urlCode.trim() === "") {
        urlCode = await getUniqueUrlCode();
        console.log(`  行${rowNumber}: url_code を自動生成: ${urlCode}`);
      }

      // lure_maker_name_en → lure_maker_id に変換
      let makerId: number | null = null;
      if (row.lure_maker_name_en) {
        makerId = await getMakerIdByName(row.lure_maker_name_en);
        if (!makerId) {
          throw new Error(`メーカーが見つかりません: ${row.lure_maker_name_en}`);
        }
      } else if (row.lure_maker_id) {
        makerId = convertValue(row.lure_maker_id, "lure_maker_id");
      }

      // category_name_ja → lure_category_id に変換
      let categoryId: number | null = null;
      if (row.category_name_ja) {
        categoryId = await getCategoryIdByName(row.category_name_ja);
        if (!categoryId) {
          throw new Error(`カテゴリーが見つかりません: ${row.category_name_ja}`);
        }
      } else if (row.lure_category_id) {
        categoryId = convertValue(row.lure_category_id, "lure_category_id");
      }

      // データを整形
      const lureData: Record<string, any> = {
        url_code: urlCode,
        is_available: convertValue(row.is_available || "true", "is_available"),
        view_count: 0,
        data_version: 1,
      };

      // メーカーID・カテゴリーIDを設定
      if (makerId) {
        lureData.lure_maker_id = makerId;
      }
      if (categoryId) {
        lureData.lure_category_id = categoryId;
      }

      // オプションのカラムを追加（lure_maker_id, lure_category_id は上で処理済み）
      const optionalColumns = [
        "scraping_source_id",
        "lure_name_ja",
        "lure_name_en",
        "lure_main_image",
        "lure_tmb_image",
        "attached_hook_size_1",
        "attached_hook_size_2",
        "attached_hook_size_3",
        "attached_hook_size_4",
        "attached_hook_size_5",
        "attached_ring_size",
        "lure_buoyancy",
        "lure_shape",
        "lure_action",
        "lure_length",
        "lure_weight",
        "lure_range_min",
        "lure_range_max",
        "lure_ref_url",
        "lure_information",
        "target_fish_1",
        "target_fish_2",
        "target_fish_3",
        "target_fish_4",
        "target_fish_5",
      ];

      optionalColumns.forEach((col) => {
        if (row[col] !== undefined) {
          const value = convertValue(row[col], col);
          if (value !== null) {
            lureData[col] = value;
          }
        }
      });

      // Supabase に挿入
      const { data, error } = await supabase
        .from("lures")
        .insert(lureData)
        .select("id, url_code, lure_name_ja")
        .single();

      if (error) {
        throw error;
      }

      console.log(
        `✓ 行${rowNumber}: ID=${data.id}, ${data.lure_name_ja} (${data.url_code})`
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
