export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AI Business Assistant';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const ML_API_BASE_URL = import.meta.env.VITE_ML_API_BASE_URL || '/api';
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export const STORAGE_KEYS = {
  TOKEN: 'aba_token',
  USER: 'aba_user',
  THEME: 'aba_theme',
};

export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_MANAGER',
  EMPLOYEE: 'ROLE_EMPLOYEE',
  USER: 'ROLE_USER',
};

export const DEMO_CREDENTIALS = {
  email: 'admin@demo.com',
  minPasswordLength: 8,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
  },
  USERS: '/users',
  EMPLOYEES: '/employees',
  CUSTOMERS: '/customers',
  PRODUCTS: '/products',
  INVENTORY: '/inventory',
  SALES: '/sales',
  ORDERS: '/orders',
  FINANCE: '/finance',
  MARKETING: '/marketing',
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  CHATBOT: '/chatbot',
  DOCUMENTS: '/documents',
  NOTIFICATIONS: '/notifications',
  DASHBOARD: '/dashboard',
  AGENTS: '/agents',
};

export const PAGINATION_DEFAULTS = {
  page: 0,
  size: 10,
  sizes: [5, 10, 25, 50],
};

export const DATE_FORMAT = 'MMM D, YYYY';
export const DATETIME_FORMAT = 'MMM D, YYYY h:mm A';
