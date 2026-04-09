import type { FetchOptions } from "@/lib/types/api";
import { ApiError, mapErrorMessage, parseErrorResponse } from "./errors";
import { useAuthStore } from "@/lib/stores/auth-store";

export const API_TARGET = process.env.NEXT_PUBLIC_API_URL || "https://api.rankeao.cl/api/v1";
export const BASE_URL = API_TARGET;

async function showToast(title: string, description: string) {
  if (typeof window === "undefined") return;
  const { toast } = await import("@heroui/react");
  toast.danger(title, { description });
}

export function showErrorToast(err: unknown) {
  showToast("Error", mapErrorMessage(err));
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      const clean = token.startsWith("Bearer ") ? token.substring(7) : token;
      return { Authorization: `Bearer ${clean}` };
    }
  } catch {
    // ignore
  }
  return {};
}

function cleanToken(token: string): string {
  return token.startsWith("Bearer ") ? token.substring(7) : token;
}

function buildHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { ...getAuthHeaders() };
  if (token) headers.Authorization = `Bearer ${cleanToken(token)}`;
  return headers;
}

function buildMutationHeaders(token?: string): Record<string, string> {
  return { "Content-Type": "application/json", ...buildHeaders(token) };
}

let refreshPromise: Promise<string | null> | null = null;

function forceLogout() {
  if (typeof window === "undefined") return;
  useAuthStore.getState().logout();
  showToast("Error", "Tu sesion ha expirado. Inicia sesion nuevamente.");
  window.location.href = "/login";
}

async function tryRefreshToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) return null;
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const tokens = data?.data?.tokens || data?.tokens || data;
    const newAccessToken = tokens?.access_token || tokens?.accessToken || tokens?.token;
    const newRefreshToken = tokens?.refresh_token || tokens?.refreshToken;
    if (!newAccessToken) return null;
    const clean = newAccessToken.startsWith("Bearer ") ? newAccessToken.substring(7) : newAccessToken;
    useAuthStore.getState().setTokens({
      accessToken: clean,
      ...(newRefreshToken ? { refreshToken: newRefreshToken } : {}),
    });
    return clean;
  } catch {
    return null;
  }
}

async function handle401(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const newToken = await tryRefreshToken();
      if (!newToken) { forceLogout(); return null; }
      return newToken;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function handleError(res: Response, endpoint: string): Promise<never> {
  if (res.status !== 401 && res.status !== 404 && res.status !== 409) {
    console.error(`API ERROR ${res.status} to ${endpoint}`);
  }
  const { code, message } = await parseErrorResponse(res);
  const error = new ApiError(code, message, res.status);
  if (res.status !== 401 && res.status !== 404 && res.status !== 409) {
    showErrorToast(error);
  }
  throw error;
}

export async function apiFetch<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate = 60, cache, token } = options;
  let finalToken = token;
  if (params && params.token && typeof params.token === "string") {
    finalToken = params.token as string;
    delete params.token;
  }
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    });
  }
  const headers = buildHeaders(finalToken);
  const fetchOptions: RequestInit & { next?: { revalidate: number } } = { headers };
  if (cache) {
    fetchOptions.cache = cache;
  } else if (revalidate !== undefined && revalidate !== false) {
    fetchOptions.next = { revalidate };
  }
  const res = await fetch(url.toString(), fetchOptions);
  if (res.status === 401 && typeof window !== "undefined") {
    const newToken = await handle401();
    if (newToken) {
      const retryRes = await fetch(url.toString(), { ...fetchOptions, headers: { ...headers, Authorization: `Bearer ${newToken}` } });
      if (!retryRes.ok) return handleError(retryRes, endpoint);
      return retryRes.json();
    }
    return handleError(res, endpoint);
  }
  if (!res.ok) return handleError(res, endpoint);
  return res.json();
}

async function mutationWithRetry<T>(
  method: string,
  endpoint: string,
  body: unknown | undefined,
  options?: { token?: string }
): Promise<T> {
  const headers = buildMutationHeaders(options?.token);
  const fetchOpts: RequestInit = {
    method,
    headers,
    cache: "no-store",
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, fetchOpts);
  if (res.status === 401 && typeof window !== "undefined") {
    const newToken = await handle401();
    if (newToken) {
      const retryRes = await fetch(`${BASE_URL}${endpoint}`, { ...fetchOpts, headers: { ...headers, Authorization: `Bearer ${newToken}` } });
      if (!retryRes.ok) return handleError(retryRes, endpoint);
      if (retryRes.status === 204) return {} as T;
      return retryRes.json();
    }
    return handleError(res, endpoint);
  }
  if (!res.ok) return handleError(res, endpoint);
  if (res.status === 204) return {} as T;
  return res.json();
}

export async function apiPost<T>(endpoint: string, body: unknown, options?: { token?: string }): Promise<T> {
  return mutationWithRetry<T>("POST", endpoint, body, options);
}

export async function apiPatch<T>(endpoint: string, body: unknown, options?: { token?: string }): Promise<T> {
  return mutationWithRetry<T>("PATCH", endpoint, body, options);
}

export async function apiPut<T>(endpoint: string, body: unknown, options?: { token?: string }): Promise<T> {
  return mutationWithRetry<T>("PUT", endpoint, body, options);
}

export async function apiDelete<T>(endpoint: string, options?: { token?: string }): Promise<T> {
  return mutationWithRetry<T>("DELETE", endpoint, undefined, options);
}
