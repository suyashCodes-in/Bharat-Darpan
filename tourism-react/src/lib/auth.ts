/**
 * auth.ts — Auth API functions (login, register, getMe).
 * All functions are thin wrappers over apiFetch; they do NOT touch localStorage
 * directly — that is AuthContext's responsibility.
 */

import { apiFetch } from './api';

// ── Response shapes ──────────────────────────────────────────────────────────

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'tourist' | 'guide' | 'admin';
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  experienceYears?: number;
  languages?: string[];
  specialties?: string[];
  digiLocker?: {
    verified: boolean;
    documentType?: string;
    verifiedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: UserProfile;
  token: string;
}

// ── API calls ────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    public: true,
  });
}

export async function register(
  name: string,
  email: string,
  password: string,
  phone?: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: { name, email, password, phone },
    public: true,
  });
}

export async function getMe(): Promise<UserProfile> {
  const res = await apiFetch<{ user: UserProfile }>('/api/auth/me');
  return res.user;
}
