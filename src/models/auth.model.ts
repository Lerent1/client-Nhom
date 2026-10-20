// ============================================================
// Auth / User TypeScript Models
// ============================================================

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
