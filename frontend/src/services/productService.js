import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const productService = {
  getAll: (params) => api.get(API_ENDPOINTS.PRODUCTS, { params }).then(unwrap),
  getById: (id) => api.get(`${API_ENDPOINTS.PRODUCTS}/${id}`).then(unwrap),
  create: (data) => api.post(API_ENDPOINTS.PRODUCTS, data).then(unwrap),
  update: (id, data) => api.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, data).then(unwrap),
  remove: (id) => api.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`).then(unwrap),
};

export default productService;
