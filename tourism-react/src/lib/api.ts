/**
 * api.ts — Typed fetch wrapper for the Bharat Darpan backend.
 *
 * Features:
 *  - Reads base URL from VITE_API_BASE_URL env var
 *  - Auto-attaches JWT Bearer token from localStorage
 *  - Throws ApiError (with status + message) on non-2xx responses
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function getToken(): string | null {
  return localStorage.getItem('bd_token');
}

export function saveToken(token: string): void {
  localStorage.setItem('bd_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('bd_token');
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Skip adding the Authorization header (e.g. login / register) */
  public?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!options.public) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  // Parse body regardless — errors also return JSON
  let data: { message?: string; details?: unknown } = {};
  try {
    data = await res.json();
  } catch {
    // If the response body is not JSON (unlikely with this backend), leave data empty
  }

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data.message ?? `Request failed with status ${res.status}`,
      data.details,
    );
  }

  return data as T;
}
