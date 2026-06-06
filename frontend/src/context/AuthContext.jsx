import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import authService from '@/services/authService';
import { DEMO_CREDENTIALS, DEMO_MODE, ROLES } from '@/utils/constants';
import { getToken, setToken, getStoredUser, setStoredUser, storage } from '@/utils/storage';

const AuthContext = createContext(null);

const buildDemoUser = (email) => ({
  id: 1,
  email,
  username: email,
  firstName: 'Admin',
  lastName: 'User',
  role: ROLES.ADMIN,
});

const buildDemoToken = () => `demo-token-${Date.now()}`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(user && getToken());

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    setLoading(true);
    try {
      if (
        DEMO_MODE &&
        email?.toLowerCase() === DEMO_CREDENTIALS.email &&
        password?.length >= DEMO_CREDENTIALS.minPasswordLength
      ) {
        const demoUser = buildDemoUser(email);
        const token = buildDemoToken();
        setToken(token);
        setStoredUser(demoUser);
        setUser(demoUser);
        return { success: true };
      }

      const { data } = await authService.login({ email, password });
      const payload = data?.data ?? data;
      const token = payload?.token ?? payload?.accessToken;
      if (!token) throw new Error('Invalid login response');

      const authUser = {
        id: payload.id,
        email: payload.email ?? email,
        username: payload.username ?? email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
      };

      setToken(token);
      setStoredUser(authUser);
      setUser(authUser);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setError(null);
    setLoading(true);
    try {
      await authService.register(data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    storage.clearAuth();
    setUser(null);
    setError(null);
  }, []);

  const hasRole = useCallback(
    (...roles) => {
      if (!user?.role) return false;
      return roles.length === 0 || roles.includes(user.role);
    },
    [user],
  );

  useEffect(() => {
    const init = async () => {
      const token = getToken();
      const stored = getStoredUser();
      if (!token) {
        setLoading(false);
        return;
      }
      if (token.startsWith('demo-token')) {
        setUser(stored);
        setLoading(false);
        return;
      }
      try {
        const me = await authService.getMe();
        setUser(me);
        setStoredUser(me);
      } catch {
        storage.clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated,
      login,
      register,
      logout,
      hasRole,
      setError,
    }),
    [user, loading, error, isAuthenticated, login, register, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
