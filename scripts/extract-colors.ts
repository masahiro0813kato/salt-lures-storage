/**
 * ルアー画像から背景色を抽出してDBに保存するスクリプト
 *
 * 使用方法:
 *   npx tsx scripts/extract-colors.ts
 *   npm run extract:colors
 *
 * bg_colors が null のルアーのみ処理します（安全に再実行可能）
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import * as ColorThief from "colorthief";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// 環境変数
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Error: NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- 色処理ユーティリティ（useColorExtraction.ts / colorUtils.ts から移植） ---

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h, s, l };
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s === 0) return { r: l, g: l, b: l };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: hue2rgb(p, q, h + 1 / 3),
    g: hue2rgb(p, q, h),
    b: hue2rgb(p, q, h - 1 / 3),
  };
}

// --- 色抽出パラメータ（useColorExtraction.ts と同一） ---

const MIN_LIGHTNESS = 0.2;
const MUDDY_THRESHOLD = 0.25;
const ACCENT_THRESHOLD = 0.5;
const MIN_COLOR_DISTANCE = 0.15;
const MIN_HUE_DISTANCE = 0.08;
const WEIGHT_MULTIPLIERS: [number, number, number, number] = [0.7, 1.5, 1.5, 0.7];

interface ExtractedColor {
  baseRgb: [number, number, number];
  weight: number;
  score: number;
  isNeutral: boolean;
}

// --- 色処理ロジック（useColorExtraction.ts から移植） ---

interface ColorThiefColor {
  _r: number;
  _g: number;
  _b: number;
  population: number;
}

function processAndSelectColors(
  rawPalette: ColorThiefColor[]
): Array<{ baseRgb: [number, number, number]; weight: number }> {
  const totalPopulation = rawPalette.reduce((sum, c) => sum + c.population, 0);

  // 色処理・フィルタリング
  const processed: ExtractedColor[] = rawPalette
    .map((color) => {
      let r = color._r / 255;
      let g = color._g / 255;
      let b = color._b / 255;

      let { h, s, l } = rgbToHsl(r, g, b);
      const weight = totalPopulation > 0 ? color.population / totalPopulation : 1 / rawPalette.length;

      // 暗すぎる色を除外
      if (l < MIN_LIGHTNESS) return null;

      // 濁った色を除外
      if (l > MIN_LIGHTNESS && l < 0.85 && s < MUDDY_THRESHOLD) return null;

      let score = weight;

      // 白に近い色は最高スコア
      if (l > 0.85) {
        score += 2.0;
        r = g = b = 1.0;
        l = 1.0;
        s = 0.0;
      }

      // 高彩度のアクセントカラーにボーナス
      if (s > ACCENT_THRESHOLD && l > 0.3) {
        score += 5.0;
      } else if (s > 0.3) {
        score *= 1.0 + s * 3.0;
      }

      // 赤系の色相補正
      if ((h < 0.06 || h > 0.95) && s > 0.3) {
        h = 0.0;
        s = Math.max(s, 0.8);
        const adjusted = hslToRgb(h, s, l);
        r = adjusted.r;
        g = adjusted.g;
        b = adjusted.b;
      }

      return {
        baseRgb: [r, g, b] as [number, number, number],
        weight,
        score,
        isNeutral: s < 0.1,
      };
    })
    .filter((c): c is ExtractedColor => c !== null);

  // 白で埋める
  while (processed.length < 4) {
    processed.push({
      baseRgb: [1.0, 1.0, 1.0],
      weight: 0.05,
      score: -1,
      isNeutral: true,
    });
  }

  // スコア降順ソート
  processed.sort((a, b) => b.score - a.score);

  // 多様性を確保しながら4色選択
  const getColorDistance = (c1: ExtractedColor, c2: ExtractedColor): number => {
    const [r1, g1, b1] = c1.baseRgb;
    const [r2, g2, b2] = c2.baseRgb;
    return Math.sqrt(
      Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
    );
  };

  const getHueDistance = (h1: number, h2: number): number => {
    const diff = Math.abs(h1 - h2);
    return Math.min(diff, 1.0 - diff);
  };

  const isBetterColor = (
    candidate: ExtractedColor,
    existing: ExtractedColor
  ): boolean => {
    const cHsl = rgbToHsl(candidate.baseRgb[0], candidate.baseRgb[1], candidate.baseRgb[2]);
    const eHsl = rgbToHsl(existing.baseRgb[0], existing.baseRgb[1], existing.baseRgb[2]);

    if (getHueDistance(cHsl.h, eHsl.h) < MIN_HUE_DISTANCE) {
      if (Math.abs(cHsl.s - eHsl.s) > 0.05) return cHsl.s > eHsl.s;
      return cHsl.l > eHsl.l;
    }
    return false;
  };

  let final: ExtractedColor[] = [];

  for (const candidate of processed) {
    if (final.length >= 4) break;

    const isDuplicate = final.some(
      (e) =>
        e.baseRgb[0] === candidate.baseRgb[0] &&
        e.baseRgb[1] === candidate.baseRgb[1] &&
        e.baseRgb[2] === candidate.baseRgb[2]
    );
    if (isDuplicate) continue;

    let shouldAdd = true;
    let replaceIndex = -1;

    for (let i = 0; i < final.length; i++) {
      const distance = getColorDistance(final[i], candidate);
      if (distance < MIN_COLOR_DISTANCE) {
        if (isBetterColor(candidate, final[i])) {
          replaceIndex = i;
          break;
        } else {
          shouldAdd = false;
          break;
        }
      }
    }

    if (replaceIndex >= 0) {
      final[replaceIndex] = candidate;
    } else if (shouldAdd) {
      final.push(candidate);
    }
  }

  // 緩和した距離で再試行
  if (final.length < 4) {
    for (const candidate of processed) {
      if (final.length >= 4) break;
      const isDuplicate = final.some(
        (e) =>
          e.baseRgb[0] === candidate.baseRgb[0] &&
          e.baseRgb[1] === candidate.baseRgb[1] &&
          e.baseRgb[2] === candidate.baseRgb[2]
      );
      if (isDuplicate) continue;

      const isTooClose = final.some(
        (e) => getColorDistance(e, candidate) < 0.08
      );
      if (!isTooClose && !final.includes(candidate)) {
        final.push(candidate);
      }
    }
  }

  // 白で埋める
  while (final.length < 4) {
    final.push({
      baseRgb: [1.0, 1.0, 1.0],
      weight: 0.05,
      score: -1,
      isNeutral: true,
    });
  }

  // 明度順ソート（明→暗）
  final.sort((a, b) => {
    const lA = rgbToHsl(a.baseRgb[0], a.baseRgb[1], a.baseRgb[2]).l;
    const lB = rgbToHsl(b.baseRgb[0], b.baseRgb[1], b.baseRgb[2]).l;
    return lB - lA;
  });

  // 重み調整
  final = final.map((c, i) => ({
    ...c,
    weight: c.weight * WEIGHT_MULTIPLIERS[i],
  }));

  const totalWeight = final.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight > 0) {
    final = final.map((c) => ({ ...c, weight: c.weight / totalWeight }));
  } else {
    final = final.map((c) => ({ ...c, weight: 0.25 }));
  }

  // DB保存用に必要なフィールドのみ返す
  return final.map((c) => ({
    baseRgb: c.baseRgb,
    weight: c.weight,
  }));
}

// --- メイン処理 ---

async function main() {
  console.log("bg_colors が未設定のルアーを取得中...");

  const { data: lures, error } = await supabase
    .from("lures")
    .select("id, lure_id, lure_name_ja")
    .eq("is_available", true)
    .is("bg_colors", null);

  if (error) {
    console.error("DBエラー:", error.message);
    process.exit(1);
  }

  if (!lures || lures.length === 0) {
    console.log("処理対象のルアーはありません（全てbg_colors設定済み）");
    return;
  }

  console.log(`${lures.length} 件のルアーを処理します\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const lure of lures) {
    const imageUrl = `https://acnvuvzuswsyrbczxzko.supabase.co/storage/v1/object/public/lure-images/lures/main/${lure.lure_id}_main.png`;

    try {
      // 画像の存在確認
      const headRes = await fetch(imageUrl, { method: "HEAD" });
      if (!headRes.ok) {
        console.log(`⏭️ ${lure.lure_name_ja} - 画像なし（スキップ）`);
        skipCount++;
        continue;
      }

      // 画像をダウンロードして一時ファイルに保存
      const imgRes = await fetch(imageUrl);
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
      const tmpFile = path.join(os.tmpdir(), `lure_${lure.id}.png`);
      fs.writeFileSync(tmpFile, imgBuffer);

      try {
        // ColorThiefで20色抽出（フロントエンドのcolor-thief-browserと同一アルゴリズム）
        const rawPalette = await ColorThief.getPalette(tmpFile, 20);

        if (!rawPalette || rawPalette.length === 0) {
          console.log(`⏭️ ${lure.lure_name_ja} - 色抽出失敗（スキップ）`);
          skipCount++;
          fs.unlinkSync(tmpFile);
          continue;
        }

      // 色処理
      const colors = processAndSelectColors(rawPalette);

      // DBに保存
      const { error: updateError } = await supabase
        .from("lures")
        .update({ bg_colors: { colors } })
        .eq("id", lure.id);

      if (updateError) {
        throw updateError;
      }

      const colorPreview = colors
        .map((c) => {
          const r = Math.round(c.baseRgb[0] * 255);
          const g = Math.round(c.baseRgb[1] * 255);
          const b = Math.round(c.baseRgb[2] * 255);
          return `rgb(${r},${g},${b})`;
        })
        .join(" | ");

      console.log(`✓ ${lure.lure_name_ja} → ${colorPreview}`);
      successCount++;
      } finally {
        fs.unlinkSync(tmpFile);
      }
    } catch (err: any) {
      console.error(`✗ ${lure.lure_name_ja} - エラー: ${err.message}`);
      errorCount++;
    }
  }

  console.log("\n--- 結果 ---");
  console.log(`成功: ${successCount} 件`);
  console.log(`スキップ: ${skipCount} 件（画像なし）`);
  console.log(`失敗: ${errorCount} 件`);
}

main().catch((error) => {
  console.error("予期せぬエラー:", error);
  process.exit(1);
});
