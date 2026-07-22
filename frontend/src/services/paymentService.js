import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const paymentService = {
  getAll: () => api.get(API_ENDPOINTS.PAYMENTS).then(unwrap),
  getById: (id) => api.get(`${API_ENDPOINTS.PAYMENTS}/${id}`).then(unwrap),
  createOrder: (data) => api.post(`${API_ENDPOINTS.PAYMENTS}/create-order`, data).then(unwrap),
  verify: (data) => api.post(`${API_ENDPOINTS.PAYMENTS}/verify`, data).then(unwrap),
  refund: (id) => api.post(`${API_ENDPOINTS.PAYMENTS}/${id}/refund`).then(unwrap),
  getStats: () => api.get(`${API_ENDPOINTS.PAYMENTS}/stats`).then(unwrap),
  getConfig: () => api.get(`${API_ENDPOINTS.PAYMENTS}/config`).then(unwrap),
};

export default paymentService;
