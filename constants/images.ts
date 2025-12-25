// デフォルト画像のファイル名（パス末尾で判定に使用）
export const DEFAULT_LURE_IMAGE_FILENAME = 'lure_main_default.webp';

// デフォルト画像かどうかを判定
export function isDefaultImage(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return true;
  return imageUrl.endsWith(DEFAULT_LURE_IMAGE_FILENAME);
}
