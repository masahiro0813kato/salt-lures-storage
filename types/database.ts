// Database types based on Supabase schema

export interface LureMaker {
  id: number;
  slug: string;
  lure_maker_name_ja: string;
  lure_maker_name_en: string;
  lure_maker_logo_image: string | null;
  lure_maker_ref_url: string | null;
  description: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface LureCategory {
  id: number;
  slug: string;
  category_name_ja: string;
  category_name_en: string;
  description: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Lure {
  id: number;
  lure_id: string;
  url_code: string;
  scraping_source_id: string | null;
  lure_maker_id: number;
  lure_category_id: number;
  lure_name_ja: string;
  lure_name_en: string;
  lure_main_image: string | null;
  lure_tmb_image: string | null;
  lure_tmb_small: string | null;
  lure_tmb_medium: string | null;
  attached_hook_size_1: string | null;
  attached_hook_size_2: string | null;
  attached_hook_size_3: string | null;
  attached_hook_size_4: string | null;
  attached_hook_size_5: string | null;
  attached_ring_size: string | null;
  lure_buoyancy: string | null;
  lure_shape: string | null;
  lure_action: string | null;
  lure_length: number | null;
  lure_weight: number | null;
  lure_range_min: number | null;
  lure_range_max: number | null;
  lure_ref_url: string | null;
  target_fish_1: string | null;
  target_fish_2: string | null;
  target_fish_3: string | null;
  target_fish_4: string | null;
  target_fish_5: string | null;
  lure_information: string | null;
  view_count: number;
  data_version: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface LureWithRelations extends Lure {
  lure_maker?: LureMaker;
  lure_category?: LureCategory;
}

export interface HookMaker {
  id: number;
  slug: string;
  hook_maker_name_ja: string;
  hook_maker_name_en: string;
  hook_maker_logo_image: string | null;
  hook_maker_ref_url: string | null;
  description: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Hook {
  id: number;
  url_code: string;
  hook_maker_id: number;
  hook_series_name_ja: string;
  hook_series_name_en: string;
  hook_model_number: string | null;
  hook_size: string;
  hook_type: string | null;
  hook_main_image: string | null;
  hook_ref_url: string | null;
  hook_information: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageView {
  id: number;
  lure_id: number | null;
  maker_id: number | null;
  viewed_at: string;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
}

export interface SearchLog {
  id: number;
  query: string;
  filters: Record<string, any> | null;
  result_count: number | null;
  searched_at: string;
}
