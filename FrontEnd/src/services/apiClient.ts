import { env } from "@/config/env";
import { ApiError, type ApiResponse } from "@/types/api";

const TOKEN_KEY = "flowpilot.auth.token";

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${env.API_BASE_URL}${path}`, { ...init, headers });
  const body = (await res.json().catch(() => ({
    success: false,
    message: res.statusText,
    data: null,
  }))) as ApiResponse<T>;

  if (!res.ok || !body.success) {
    if (res.status === 401 && onUnauthorized) onUnauthorized();
    throw new ApiError(body.message ?? res.statusText, body.errors, res.status);
  }

  return body.data as T;
}

/** Raw fetch for endpoints that may return non-envelope responses (health checks). */
export async function apiRaw<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.API_BASE_URL}${path}`, init);
  return res.json() as Promise<T>;
}
