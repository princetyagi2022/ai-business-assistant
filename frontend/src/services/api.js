import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants';
import { storage } from '@/utils/storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = storage.get(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // Only a genuine authentication failure (expired/invalid token) should end the
    // session. A 403 means the user is logged in but lacks permission for this
    // resource — it must NOT log them out (that caused the AI Agents auto-logout).
    if (status === 401 && !error.config?.skipAuthRedirect) {
      storage.clearAuth();
      // Only redirect if we're on a protected page (not already on auth pages)
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  },
);

export const unwrap = (response) => response.data?.data ?? response.data;

export default api;
