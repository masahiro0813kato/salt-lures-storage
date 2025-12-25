// Pagination
export const DEFAULT_PAGE_SIZE = 24;
export const MAX_PAGE_SIZE = 100;

// Local Storage Keys
export const RECENT_LURES_KEY = 'lure-db-recent-lures';
export const SEARCH_HISTORY_KEY = 'lure-db-search-history';
export const MAX_RECENT_LURES = 20;
export const MAX_SEARCH_HISTORY = 10;

// Image Paths
export const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`
  : '';

export const IMAGE_PATHS = {
  makers: {
    logos: `${STORAGE_BASE_URL}/makers/logos`,
  },
  lures: {
    main: `${STORAGE_BASE_URL}/lures/main`,
    thumbnails: `${STORAGE_BASE_URL}/lures/thumbnails`,
  },
  hooks: {
    main: `${STORAGE_BASE_URL}/hooks`,
  },
};

// Lure Categories (initial data)
export const LURE_CATEGORIES = [
  { slug: 'floating-minnow', ja: 'フローティングミノー', en: 'Floating Minnow' },
  { slug: 'topwater', ja: 'トップウォーター', en: 'Topwater' },
  { slug: 'sinking-pencil', ja: 'シンキングペンシル', en: 'Sinking Pencil' },
  { slug: 'spintail-jig', ja: 'スピンテールジグ', en: 'Spintail Jig' },
  { slug: 'metal-vibration', ja: 'メタルバイブレーション', en: 'Metal Vibration' },
  { slug: 'lipless-minnow', ja: 'リップレスミノー', en: 'Lipless Minnow' },
  { slug: 'suspend-shad', ja: 'サスペンドシャッド', en: 'Suspend Shad' },
  { slug: 'vibration', ja: 'バイブレーション', en: 'Vibration' },
];

// Buoyancy types
export const BUOYANCY_TYPES = [
  'フローティング',
  'シンキング',
  'サスペンド',
  'スローシンキング',
  'ファストシンキング',
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: '新着順' },
  { value: 'popular', label: '人気順' },
  { value: 'name_asc', label: '名前順 (昇順)' },
  { value: 'name_desc', label: '名前順 (降順)' },
];

// SEO
export const SITE_NAME = 'Lure Database';
export const SITE_DESCRIPTION =
  '釣具メーカーの公式サイトから製品情報を自動収集し、統一されたデータベースとして提供する';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Social Media
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const TWITTER_HANDLE = '@lure_database';
