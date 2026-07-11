import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const authService = {
  login: (credentials) =>
    api.post(API_ENDPOINTS.AUTH.LOGIN, {
      username: credentials.email,
      password: credentials.password,
    }),

  register: (data) =>
    api.post(API_ENDPOINTS.AUTH.REGISTER, {
      username: data.username || data.email?.split('@')[0],
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    }),

  forgotPassword: (email) =>
    api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  resetPassword: (data) =>
    api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),

  verifyEmail: (data) =>
    api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data),

  getMe: () => api.get(API_ENDPOINTS.AUTH.ME).then(unwrap),

  refresh: () => api.post(API_ENDPOINTS.AUTH.REFRESH).then(unwrap),
};

export default authService;
