import type { Lure, LureMaker, LureCategory, LureWithRelations } from './database';

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  error: string | null;
}

// Search and Filter types
export interface LureFilters {
  makers?: string[];
  categories?: string[];
  length_min?: number;
  length_max?: number;
  weight_min?: number;
  weight_max?: number;
  range_min?: number;
  range_max?: number;
  buoyancy?: string[];
  query?: string;
}

export interface LureSearchParams extends LureFilters {
  page?: number;
  per_page?: number;
  sort?: 'newest' | 'popular' | 'name_asc' | 'name_desc';
}

// Local Storage types
export interface RecentLure {
  id: number;
  url_code: string;
  lure_name_ja: string;
  lure_tmb_small: string | null;
  viewed_at: string;
}

export interface SearchHistory {
  query: string;
  searched_at: string;
  result_count?: number;
}
