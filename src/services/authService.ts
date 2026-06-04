import { API_ENDPOINTS } from "../config/api";
import { ApiError, apiRequest } from "../utils/httpUtils";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access?: string;
  token?: string;
  accessToken?: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export type AccountType = "admin" | "owner";

export interface UserResponse {
  id: string;
  name: string;
}

const ACCESS_TOKEN_STORAGE_KEY = "gdsi_access_token";
const SELECTED_OWNER_STORAGE_KEY = "selectedOwnerId";

function readStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } catch {
    // ignore storage failures and keep in-memory token
  }
}

function clearStoredToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    // ignore storage failures
  }
}

function clearSelectedOwner(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(SELECTED_OWNER_STORAGE_KEY);
  } catch {
    // ignore storage failures
  }
}

let inMemoryAccessToken: string | null = readStoredToken();

function extractAccessToken(response: TokenResponse): string | null {
  return response.access || response.token || response.accessToken || null;
}

function resolveRegisterEndpoint(accountType: AccountType): string {
  return accountType === "admin"
    ? API_ENDPOINTS.AUTH.REGISTER_ADMIN
    : API_ENDPOINTS.AUTH.REGISTER_OWNER;
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

// Reads the current JWT payload to expose session data to the UI layer.
function readTokenPayload(): { sub?: string; role?: string } | null {
  const token = inMemoryAccessToken;
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as { sub?: string; role?: string };
  } catch {
    return null;
  }
}

const authService = {
  setToken(token: string): void {
    inMemoryAccessToken = token;
    writeStoredToken(token);
  },

  getToken(): string | null {
    return inMemoryAccessToken;
  },

  getCurrentUserId(): string | null {
    return readTokenPayload()?.sub ?? null;
  },

  getCurrentUserRole(): string | null {
    return readTokenPayload()?.role ?? null;
  },

  clearToken(): void {
    inMemoryAccessToken = null;
    clearStoredToken();
    clearSelectedOwner();
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
      this.clearToken();
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

    clearSelectedOwner();
    this.setToken(token);
    return response;
  },

  async refresh(): Promise<boolean> {
    const tokenAtStart = inMemoryAccessToken;

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
      // Avoid race condition: if login succeeded while refresh was in flight,
      // don't wipe the freshly stored access token.
      if (inMemoryAccessToken === tokenAtStart) {
        this.clearToken();
      }
      return false;
    }
  },

  register(data: SignUpRequest, accountType: AccountType): Promise<UserResponse> {
    return apiRequest<UserResponse>(resolveRegisterEndpoint(accountType), {
      method: "POST",
      body: data,
      token: null,
      credentials: "include",
    });
  },
};

export default authService;
