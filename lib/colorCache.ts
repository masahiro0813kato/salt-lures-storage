interface ExtractedColor {
  baseRgb: [number, number, number];
  weight: number;
  score: number;
  isNeutral: boolean;
}

class ColorCache {
  private cache = new Map<string, ExtractedColor[]>();
  private maxSize = 50; // 最大50件までキャッシュ

  get(key: string): ExtractedColor[] | null {
    return this.cache.get(key) || null;
  }

  set(key: string, value: ExtractedColor[]): void {
    // LRU: 上限超えたら最も古いものを削除
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const colorCache = new ColorCache();
