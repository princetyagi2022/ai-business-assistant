import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const salesService = {
  getAll: (params) => api.get(API_ENDPOINTS.SALES, { params }).then(unwrap),
  getById: (id) => api.get(`${API_ENDPOINTS.SALES}/${id}`).then(unwrap),
  getOrders: (params) => api.get(API_ENDPOINTS.ORDERS, { params }).then(unwrap),
  createOrder: (data) => api.post(API_ENDPOINTS.ORDERS, data).then(unwrap),
};

export default salesService;
