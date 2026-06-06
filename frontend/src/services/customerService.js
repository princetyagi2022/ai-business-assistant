import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const customerService = {
  getAll: (params) => api.get(API_ENDPOINTS.CUSTOMERS, { params }).then(unwrap),
  getById: (id) => api.get(`${API_ENDPOINTS.CUSTOMERS}/${id}`).then(unwrap),
  create: (data) => api.post(API_ENDPOINTS.CUSTOMERS, data).then(unwrap),
  update: (id, data) => api.put(`${API_ENDPOINTS.CUSTOMERS}/${id}`, data).then(unwrap),
  remove: (id) => api.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`).then(unwrap),
};

export default customerService;
