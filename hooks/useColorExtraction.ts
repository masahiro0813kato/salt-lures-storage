import { useState, useEffect } from 'react';
import { isDefaultImage } from '@/constants/images';
import { rgbToHsl, hslToRgb } from '@/lib/colorUtils';
import { ColorExtractionParams } from '@/types/shader';
import { colorCache } from '@/lib/colorCache';

interface ExtractedColor {
  baseRgb: [number, number, number]; // 0-1 正規化
  weight: number;
  score: number;
  isNeutral: boolean;
}

interface UseColorExtractionResult {
  palette: ExtractedColor[] | null;
  isLoading: boolean;
  error: Error | null;
}

const DEFAULT_PARAMS: ColorExtractionParams = {
  minLightness: 0.2,
  muddyThreshold: 0.25,
  accentThreshold: 0.5,
};

export function useColorExtraction(
  imageUrl: string | null,
  params: ColorExtractionParams = DEFAULT_PARAMS,
  weightMultipliers: [number, number, number, number] = [0.7, 1.5, 1.5, 0.7]
): UseColorExtractionResult {
  const [palette, setPalette] = useState<ExtractedColor[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // デフォルト画像チェック - 即座にnullを返す
    if (isDefaultImage(imageUrl)) {
      console.log('⏭️ Skipping color extraction: default image');
      setPalette(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!imageUrl) {
      console.log('⏭️ Skipping color extraction: no image URL');
      setPalette(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // キャッシュチェック
    const cacheKey = `${imageUrl}_${params.minLightness}_${params.muddyThreshold}_${params.accentThreshold}`;
    const cached = colorCache.get(cacheKey);

    if (cached) {
      console.log('✅ Using cached palette for:', imageUrl);
      setPalette(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    const extractColors = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // ColorThiefを動的インポート
        const ColorThief = (await import('color-thief-browser')).default;

        // プロキシAPI経由で画像を読み込み（CORS問題を回避）
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
        console.log('🔄 Loading image via proxy:', proxyUrl);

        const img = new Image();
        img.crossOrigin = 'anonymous';

        // 画像読み込み（失敗時はデフォルト画像にフォールバック）
        await new Promise<void>((resolve, reject) => {
          let attemptedFallback = false;

          img.onload = () => {
            console.log('✅ Image loaded successfully via proxy');
            resolve();
          };

          img.onerror = async (e) => {
            // まだフォールバックを試していない場合、デフォルト画像を試す
            if (!attemptedFallback) {
              attemptedFallback = true;
              console.warn('⚠️ Original image failed, trying default image');

              // デフォルト画像のパスを取得（絶対パスに変換）
              const defaultImageUrl = `${window.location.origin}/images/common/lure_main_default.webp`;
              img.src = defaultImageUrl;
            } else {
              // デフォルト画像も失敗した場合はエラー
              console.error('❌ Both original and default image failed to load');
              console.error('Original URL:', imageUrl);
              console.error('Proxy URL:', proxyUrl);
              reject(new Error(`Failed to load image: ${imageUrl}`));
            }
          };

          img.src = proxyUrl;
        });

        // ColorThiefで20色抽出（テストコードと同じ）
        const colorThief = new ColorThief();
        const rawPalette = colorThief.getPalette(img, 20);

        if (!rawPalette || rawPalette.length === 0) {
          throw new Error('No colors extracted from image');
        }

        // ウェイト計算（テストコードのcalculateWeights関数を再現）
        const calculateWeights = (
          imgElement: HTMLImageElement,
          palette: number[][]
        ): number[] => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return new Array(palette.length).fill(1 / palette.length);

          const size = 50;
          canvas.width = size;
          canvas.height = size;
          ctx.drawImage(imgElement, 0, 0, size, size);

          const data = ctx.getImageData(0, 0, size, size).data;
          const counts = new Array(palette.length).fill(0);

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            let minDist = Infinity;
            let closeIdx = 0;

            palette.forEach((p, idx) => {
              const dist =
                Math.pow(r - p[0], 2) +
                Math.pow(g - p[1], 2) +
                Math.pow(b - p[2], 2);
              if (dist < minDist) {
                minDist = dist;
                closeIdx = idx;
              }
            });

            counts[closeIdx]++;
          }

          return counts.map((c) => c / (size * size));
        };

        const rawWeights = calculateWeights(img, rawPalette);

        // 色処理（テストコードのprocessVisualPaletteを完全再現）
        const processed: ExtractedColor[] = rawPalette
          .map((rgb: number[], i: number) => {
            // 0-1に正規化
            let r = rgb[0] / 255;
            let g = rgb[1] / 255;
            let b = rgb[2] / 255;

            // HSLに変換
            let { h, s, l } = rgbToHsl(r, g, b);
            const weight = rawWeights[i];

            // 暗すぎる色を除外
            if (l < params.minLightness) {
              return null;
            }

            // 濁った色を除外（低彩度かつ中間明度）
            if (l > params.minLightness && l < 0.85 && s < params.muddyThreshold) {
              return null;
            }

            // スコアリング（テストコードの完全再現）
            let score = weight;

            // 白に近い色は最高スコア
            if (l > 0.85) {
              score += 2.0;
              r = g = b = 1.0;
              l = 1.0;
              s = 0.0;
            }

            // 高彩度のアクセントカラーにボーナス
            if (s > params.accentThreshold && l > 0.3) {
              score += 5.0;
            } else if (s > 0.3) {
              score *= 1.0 + s * 3.0;
            }

            // 赤系の色相補正
            if ((h < 0.06 || h > 0.95) && s > 0.3) {
              h = 0.0;
              s = Math.max(s, 0.8);
              // HSLを変更したのでRGBに戻す
              const adjusted = hslToRgb(h, s, l);
              r = adjusted.r;
              g = adjusted.g;
              b = adjusted.b;
            }

            const isNeutral = s < 0.1;

            return {
              baseRgb: [r, g, b] as [number, number, number],
              weight,
              score,
              isNeutral,
            };
          })
          .filter((color): color is ExtractedColor => color !== null);

        // 4色に満たない場合は白で埋める
        while (processed.length < 4) {
          processed.push({
            baseRgb: [1.0, 1.0, 1.0],
            weight: 0.05,
            score: -1,
            isNeutral: true,
          });
        }

        // スコアでソート（降順）
        processed.sort((a, b) => b.score - a.score);

        // 色の多様性を確保しながら4色を選択
        let final: ExtractedColor[] = [];
        const minColorDistance = 0.15; // RGB空間での最小距離（0-1スケール）
        const minHueDistance = 0.08; // 色相の最小距離（0-1スケール、0.08 ≈ 29度）

        // 色同士の距離を計算する関数
        const getColorDistance = (c1: ExtractedColor, c2: ExtractedColor): number => {
          const [r1, g1, b1] = c1.baseRgb;
          const [r2, g2, b2] = c2.baseRgb;
          return Math.sqrt(
            Math.pow(r1 - r2, 2) +
            Math.pow(g1 - g2, 2) +
            Math.pow(b1 - b2, 2)
          );
        };

        // 色相の距離を計算（円環上の最短距離）
        const getHueDistance = (h1: number, h2: number): number => {
          const diff = Math.abs(h1 - h2);
          return Math.min(diff, 1.0 - diff); // 0.0-0.5の範囲
        };

        // 色相が近い場合、より鮮やかで明るい色を優先
        const isBetterColor = (candidate: ExtractedColor, existing: ExtractedColor): boolean => {
          const candidateHsl = rgbToHsl(candidate.baseRgb[0], candidate.baseRgb[1], candidate.baseRgb[2]);
          const existingHsl = rgbToHsl(existing.baseRgb[0], existing.baseRgb[1], existing.baseRgb[2]);

          // 色相が近い場合（29度以内）
          if (getHueDistance(candidateHsl.h, existingHsl.h) < minHueDistance) {
            // 彩度優先、次に明度で判定
            if (Math.abs(candidateHsl.s - existingHsl.s) > 0.05) {
              return candidateHsl.s > existingHsl.s; // より鮮やか
            }
            return candidateHsl.l > existingHsl.l; // より明るい
          }

          return false; // 色相が離れている場合は置き換えない
        };

        // スコアが高い順に、既存の色と十分に離れている色だけを追加
        for (const candidate of processed) {
          if (final.length >= 4) break;

          // 同一色チェック（完全一致）
          const isDuplicate = final.some(existing =>
            existing.baseRgb[0] === candidate.baseRgb[0] &&
            existing.baseRgb[1] === candidate.baseRgb[1] &&
            existing.baseRgb[2] === candidate.baseRgb[2]
          );

          if (isDuplicate) continue;

          // 既存の色との距離チェック
          let shouldAdd = true;
          let replaceIndex = -1;

          for (let i = 0; i < final.length; i++) {
            const existing = final[i];
            const distance = getColorDistance(existing, candidate);

            if (distance < minColorDistance) {
              // 色相が近く、候補の方が優れている場合は置き換え
              if (isBetterColor(candidate, existing)) {
                replaceIndex = i;
                break;
              } else {
                shouldAdd = false;
                break;
              }
            }
          }

          if (replaceIndex >= 0) {
            // より良い色で置き換え
            final[replaceIndex] = candidate;
          } else if (shouldAdd) {
            final.push(candidate);
          }
        }

        // 4色に満たない場合のみ白で埋める（距離チェックを緩和しても足りない場合）
        if (final.length < 4) {
          // より緩い距離制限で再試行
          const relaxedMinDistance = 0.08;
          for (const candidate of processed) {
            if (final.length >= 4) break;

            const isDuplicate = final.some(existing =>
              existing.baseRgb[0] === candidate.baseRgb[0] &&
              existing.baseRgb[1] === candidate.baseRgb[1] &&
              existing.baseRgb[2] === candidate.baseRgb[2]
            );

            if (isDuplicate) continue;

            const isTooClose = final.some(existing =>
              getColorDistance(existing, candidate) < relaxedMinDistance
            );

            if (!isTooClose && !final.includes(candidate)) {
              final.push(candidate);
            }
          }
        }

        // それでも足りない場合は白で埋める
        while (final.length < 4) {
          final.push({
            baseRgb: [1.0, 1.0, 1.0],
            weight: 0.05,
            score: -1,
            isNeutral: true,
          });
        }

        // 明度順に並び替え（明るい→暗い）
        final.sort((a, b) => {
          const lA = rgbToHsl(a.baseRgb[0], a.baseRgb[1], a.baseRgb[2]).l;
          const lB = rgbToHsl(b.baseRgb[0], b.baseRgb[1], b.baseRgb[2]).l;
          return lB - lA; // 降順（明るい→暗い）
        });

        // 重みを調整して2番目、3番目の色を強調
        // インデックス0: 1番目（明るい）、1: 2番目、2: 3番目、3: 4番目（暗い）
        final = final.map((c, i) => ({
          ...c,
          weight: c.weight * weightMultipliers[i],
        }));

        // 重みを正規化（合計1.0になるように）
        const totalWeight = final.reduce((sum, c) => sum + c.weight, 0);
        if (totalWeight > 0) {
          final = final.map((c) => ({
            ...c,
            weight: c.weight / totalWeight,
          }));
        } else {
          // フォールバック: 全て均等
          final = final.map((c) => ({
            ...c,
            weight: 0.25,
          }));
        }

        setPalette(final);

        // 結果をキャッシュに保存
        colorCache.set(cacheKey, final);
        console.log('💾 Cached palette for:', imageUrl);
      } catch (err) {
        console.error('Color extraction failed:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setPalette(null);
      } finally {
        setIsLoading(false);
      }
    };

    extractColors();
  }, [imageUrl, params.minLightness, params.muddyThreshold, params.accentThreshold, weightMultipliers]);

  return { palette, isLoading, error };
}
