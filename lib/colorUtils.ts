import * as THREE from 'three';

// 値を0-1にクランプ
export function clamp01(val: number): number {
  return Math.max(0, Math.min(1, val));
}

// RGB (0-1) → HSL (h: 0-1, s: 0-1, l: 0-1)
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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

// HSL → RGB (0-1)
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s === 0) {
    return { r: l, g: l, b: l };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: hue2rgb(p, q, h + 1 / 3),
    g: hue2rgb(p, q, h),
    b: hue2rgb(p, q, h - 1 / 3),
  };
}

// 色補正を適用してTHREE.Vector3を返す
export function adjustColor(
  rgb: [number, number, number],
  params: { saturation: number; lightness: number; contrast: number; hueShift: number }
): THREE.Vector3 {
  let [r, g, b] = rgb;

  // HSLに変換
  let { h, s, l } = rgbToHsl(r, g, b);

  // 彩度調整
  s = clamp01(s + params.saturation);

  // 明度調整
  l = clamp01(l + params.lightness);

  // 色相シフト（hueShiftは度数で来るので360で割って0-1に正規化）
  h = (h + params.hueShift / 360) % 1;
  if (h < 0) h += 1;

  // RGBに戻す
  const adjusted = hslToRgb(h, s, l);
  r = adjusted.r;
  g = adjusted.g;
  b = adjusted.b;

  // コントラスト調整
  const contrast = params.contrast;
  r = clamp01((r - 0.5) * contrast + 0.5);
  g = clamp01((g - 0.5) * contrast + 0.5);
  b = clamp01((b - 0.5) * contrast + 0.5);

  return new THREE.Vector3(r, g, b);
}
