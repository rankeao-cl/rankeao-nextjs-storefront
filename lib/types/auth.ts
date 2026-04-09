export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface RefreshPayload {
  refresh_token: string;
}

export interface AuthApiResponse {
  data?: {
    user?: Record<string, unknown>;
    tokens?: { access_token?: string; refresh_token?: string };
  };
  user?: Record<string, unknown>;
  tokens?: { access_token?: string; refresh_token?: string };
  message?: string;
}

export interface AuthMessageResponse {
  message?: string;
}
