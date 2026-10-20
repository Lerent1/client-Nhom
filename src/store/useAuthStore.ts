// ============================================================
// useAuthStore — Zustand store quản lý xác thực
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/models/auth.model';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      // Chỉ persist user và isAuthenticated, không persist token vào zustand storage
      // (token đã lưu riêng qua localStorage.setItem để interceptor dùng)
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
