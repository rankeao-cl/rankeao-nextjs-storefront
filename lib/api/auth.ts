import { apiPost, BASE_URL } from "./client";
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

export async function logoutAuth(): Promise<AuthMessageResponse> {
  return apiPost<AuthMessageResponse>("/auth/logout", {});
}

export async function verifyEmail(token: string): Promise<AuthMessageResponse> {
  return apiPost<AuthMessageResponse>("/auth/verify-email", { token });
}

export async function resendVerification(email: string): Promise<AuthMessageResponse> {
  return apiPost<AuthMessageResponse>("/auth/resend-verification", { email });
}

export async function changePassword(current_password: string, new_password: string): Promise<AuthMessageResponse> {
  return apiPost<AuthMessageResponse>("/auth/change-password", { current_password, new_password });
}

// OAuth redirect URLs — point browser directly to these
export const AUTH_GOOGLE_URL = `${BASE_URL}/auth/oauth/google`;
export const AUTH_DISCORD_URL = `${BASE_URL}/auth/oauth/discord`;
export const AUTH_APPLE_URL = `${BASE_URL}/auth/oauth/apple`;
