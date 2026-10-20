// ============================================================
// Axios Client — tái sử dụng instance duy nhất
// Đọc cấu hình từ biến môi trường Vite
// ============================================================

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 15000);

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Request Interceptor ----
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response Interceptor ----
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn — xóa token, redirect về login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
