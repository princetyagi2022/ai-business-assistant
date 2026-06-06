import { STORAGE_KEYS } from './constants';

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const storage = {
  get(key) {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },

  set(key, value) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },

  remove(key) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  getJSON(key) {
    const raw = this.get(key);
    return raw ? safeParse(raw) : null;
  },

  setJSON(key, value) {
    this.set(key, JSON.stringify(value));
  },

  clearAuth() {
    this.remove(STORAGE_KEYS.TOKEN);
    this.remove(STORAGE_KEYS.USER);
  },
};

export const getToken = () => storage.get(STORAGE_KEYS.TOKEN);
export const setToken = (token) => storage.set(STORAGE_KEYS.TOKEN, token);
export const getStoredUser = () => storage.getJSON(STORAGE_KEYS.USER);
export const setStoredUser = (user) => storage.setJSON(STORAGE_KEYS.USER, user);
export const getThemeMode = () => storage.get(STORAGE_KEYS.THEME) || 'light';
export const setThemeMode = (mode) => storage.set(STORAGE_KEYS.THEME, mode);
