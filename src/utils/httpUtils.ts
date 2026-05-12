import { COMMON_HEADERS } from "../config/api";
import { getMockResponse, isMockEnabled } from "./mockApi";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiRequestOptions = {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string | null;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
  allowNoContent?: boolean;
};

export async function apiRequest<T>(
  url: string,
  { method = "GET", body, headers = {}, token, signal, credentials, allowNoContent = false }: ApiRequestOptions = {},
): Promise<T> {
  if (isMockEnabled()) {
    const mockPayload = getMockResponse<T>(url, method, body);
    if (mockPayload !== undefined) {
      return mockPayload;
    }
  }

  const finalHeaders: Record<string, string> = {
    ...COMMON_HEADERS,
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
    credentials,
  });

  if (response.status === 204 && allowNoContent) {
    return null as T;
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && typeof payload === "object" && payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : response.statusText) || "Request failed";

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
