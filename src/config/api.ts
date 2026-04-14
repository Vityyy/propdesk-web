const rawApiUrl = import.meta.env.VITE_API_URL;

if (!rawApiUrl) {
  throw new Error("Missing required env var: VITE_API_URL");
}

export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    REGISTER_ADMIN: `${API_BASE_URL}/auth/register/admin`,
    REGISTER_OWNER: `${API_BASE_URL}/auth/register/owner`,
  },
  PROPERTIES: {
    CREATE: `${API_BASE_URL}/properties`,
  },
  APARTMENTS: {
    CREATE: `${API_BASE_URL}/apartments`,
  },
  EXPENSES: {
    CREATE: `${API_BASE_URL}/expenses`,
  },
} as const;

export const COMMON_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
