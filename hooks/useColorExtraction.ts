import { useState, useEffect } from 'react';
import { isDefaultImage } from '@/constants/images';
import { rgbToHsl, hslToRgb } from '@/lib/colorUtils';
import { ColorExtractionParams } from '@/types/shader';

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
  params: ColorExtractionParams = DEFAULT_PARAMS
): UseColorExtractionResult {
  const [palette, setPalette] = useState<ExtractedColor[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // デフォルト画像チェック - 即座にnullを返す
    if (isDefaultImage(imageUrl)) {
      setPalette(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!imageUrl) {
      setPalette(null);
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

        // 画像読み込み
        const img = new Image();
        img.crossOrigin = 'Anonymous';

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = imageUrl;
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

        // 上位4色を取得
        let final = processed.slice(0, 4);

        // 明度順に並び替え（明るい→暗い）
        final.sort((a, b) => {
          const lA = rgbToHsl(a.baseRgb[0], a.baseRgb[1], a.baseRgb[2]).l;
          const lB = rgbToHsl(b.baseRgb[0], b.baseRgb[1], b.baseRgb[2]).l;
          return lB - lA; // 降順（明るい→暗い）
        });

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
      } catch (err) {
        console.error('Color extraction failed:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setPalette(null);
      } finally {
        setIsLoading(false);
      }
    };

    extractColors();
  }, [imageUrl, params.minLightness, params.muddyThreshold, params.accentThreshold]);

  return { palette, isLoading, error };
}
