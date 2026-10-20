// ============================================================
// Auth Service — Login, Register, Get current user
// ============================================================

import axiosClient from '@/api/axiosClient';
import { ENDPOINTS } from '@/api/endpoints';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/models/auth.model';

const IS_MOCK = import.meta.env.VITE_ENABLE_MOCK_API === 'true';
const mockDelay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

const MOCK_USER: User = {
  id: 1,
  email: 'user@example.com',
  name: 'Người dùng test',
  role: 'customer',
};

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (IS_MOCK) {
      await mockDelay();
      if (payload.email === 'user@example.com' && payload.password === '123456') {
        return { user: MOCK_USER, token: 'mock-jwt-token-12345' };
      }
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    const res = await axiosClient.post<AuthResponse>(ENDPOINTS.AUTH_LOGIN, payload);
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (IS_MOCK) {
      await mockDelay();
      return { user: { ...MOCK_USER, name: payload.name, email: payload.email }, token: 'mock-jwt-token-new' };
    }
    const res = await axiosClient.post<AuthResponse>(ENDPOINTS.AUTH_REGISTER, payload);
    return res.data;
  },

  async getCurrentUser(): Promise<User> {
    if (IS_MOCK) {
      await mockDelay(200);
      return MOCK_USER;
    }
    const res = await axiosClient.get<User>(ENDPOINTS.AUTH_ME);
    return res.data;
  },

  async logout(): Promise<void> {
    if (!IS_MOCK) {
      await axiosClient.post(ENDPOINTS.AUTH_LOGOUT).catch(() => {});
    }
    localStorage.removeItem('auth_token');
  },
};
