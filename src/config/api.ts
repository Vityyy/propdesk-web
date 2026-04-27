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
    LIST: `${API_BASE_URL}/properties`,
    BASE: `${API_BASE_URL}/properties`,
  },
  ADMINS: {
    LIST: `${API_BASE_URL}/admins`,
    GET_MY_OWNERS: `${API_BASE_URL}/admins/me/owners`,
  },
  OWNERS: {
    ASSOCIATE_ADMIN: `${API_BASE_URL}/owners/me/admin`,
  },
  APARTMENTS: {
    CREATE: `${API_BASE_URL}/apartments`,
    LIST: `${API_BASE_URL}/apartments`,
    BASE: `${API_BASE_URL}/apartments`,
  },
  EXPENSES: {
    CREATE: `${API_BASE_URL}/expenses`,
  },
} as const;

export const COMMON_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
