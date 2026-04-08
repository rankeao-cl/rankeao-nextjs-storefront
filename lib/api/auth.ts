import { apiPost } from "./client";
import type { LoginPayload, RegisterPayload, RefreshPayload, AuthApiResponse, AuthMessageResponse } from "@/lib/types/auth";

export async function loginAuth(payload: LoginPayload): Promise<AuthApiResponse> {
  return apiPost<AuthApiResponse>("/auth/login", payload);
}

export async function registerAuth(payload: RegisterPayload): Promise<AuthApiResponse> {
  return apiPost<AuthApiResponse>("/auth/register", {
    ...payload,
    name: payload.username,
  });
}

export async function refreshAuth(payload: RefreshPayload): Promise<AuthApiResponse> {
  return apiPost<AuthApiResponse>("/auth/refresh", payload);
}

export async function forgotPassword(email: string): Promise<AuthMessageResponse> {
  return apiPost<AuthMessageResponse>("/auth/forgot-password", { email });
}

export async function resetPassword(token: string, new_password: string): Promise<AuthMessageResponse> {
  return apiPost<AuthMessageResponse>("/auth/reset-password", { token, new_password });
}
