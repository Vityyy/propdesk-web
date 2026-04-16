import { API_ENDPOINTS } from "../config/api";
import { ApiError, apiRequest } from "../utils/httpUtils";

export interface LoginRequest {
  name: string;
  password: string;
}

export interface TokenResponse {
  access?: string;
  token?: string;
  accessToken?: string;
}

export interface SignUpRequest {
  name: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
}

let inMemoryAccessToken: string | null = null;

function extractAccessToken(response: TokenResponse): string | null {
  return response.access || response.token || response.accessToken || null;
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

const authService = {
  setToken(token: string): void {
    inMemoryAccessToken = token;
  },

  getToken(): string | null {
    return inMemoryAccessToken;
  },

  clearToken(): void {
    inMemoryAccessToken = null;
  },

  isSessionValidB(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    try {
      const payload = JSON.parse(decodeBase64Url(parts[1])) as {
        exp?: number;
      };

      if (!payload.exp) {
        return true;
      }

      const nowInSeconds = Math.floor(Date.now() / 1000);
      return payload.exp > nowInSeconds;
    } catch {
      return false;
    }
  },

  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await apiRequest<TokenResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: data,
      token: null,
      credentials: "include",
    });

    const token = extractAccessToken(response);
    if (!token) {
      throw new ApiError("Respuesta de login sin token", 500, response);
    }

    this.setToken(token);
    return response;
  },

  async refresh(): Promise<boolean> {
    try {
      const response = await apiRequest<TokenResponse>(API_ENDPOINTS.AUTH.REFRESH, {
        method: "POST",
        token: null,
        credentials: "include",
      });

      const token = extractAccessToken(response);
      if (!token) {
        this.clearToken();
        return false;
      }

      this.setToken(token);
      return true;
    } catch {
      this.clearToken();
      return false;
    }
  },

  registerAdmin(data: SignUpRequest): Promise<UserResponse> {
    return apiRequest<UserResponse>(API_ENDPOINTS.AUTH.REGISTER_ADMIN, {
      method: "POST",
      body: data,
      token: null,
    });
  },

  registerOwner(data: SignUpRequest): Promise<UserResponse> {
    return apiRequest<UserResponse>(API_ENDPOINTS.AUTH.REGISTER_OWNER, {
      method: "POST",
      body: data,
      token: null,
    });
  },
};

export default authService;


