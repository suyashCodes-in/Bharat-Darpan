/**
 * AuthContext.tsx — Global authentication state for Bharat Darpan.
 *
 * Provides:
 *  - user: UserProfile | null
 *  - token: string | null
 *  - isLoading: boolean (true while re-hydrating from localStorage)
 *  - login(email, password) → throws ApiError on failure
 *  - register(name, email, password) → throws ApiError on failure
 *  - logout()
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import * as authApi from '../lib/auth';
import type { UserProfile } from '../lib/auth';
import { saveToken, clearToken, apiFetch } from '../lib/api';

// ── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session from localStorage on first mount.
  useEffect(() => {
    const stored = localStorage.getItem('bd_token');
    if (!stored) {
      setIsLoading(false);
      return;
    }
    setToken(stored);
    // Validate the token is still good by fetching the current user.
    apiFetch<{ user: UserProfile }>('/api/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => {
        // Token expired or invalid — clear it silently.
        clearToken();
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    saveToken(res.token);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password);
    saveToken(res.token);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
