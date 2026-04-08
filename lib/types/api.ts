export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface FetchOptions {
  revalidate?: number | false;
  cache?: RequestCache;
  token?: string;
}

export type Params = Record<string, string | number | boolean | undefined>;

export type ApiResponse<T = unknown> = {
  success?: boolean;
  data?: T;
  meta?: PaginationMeta;
  message?: string;
} & Partial<T extends Record<string, unknown> ? T : Record<string, never>>;

export interface ApiMessage {
  message: string;
}
