import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const employeeService = {
  getAll: (params) => api.get(API_ENDPOINTS.EMPLOYEES, { params }).then(unwrap),
  getById: (id) => api.get(`${API_ENDPOINTS.EMPLOYEES}/${id}`).then(unwrap),
  create: (data) => api.post(API_ENDPOINTS.EMPLOYEES, data).then(unwrap),
  update: (id, data) => api.put(`${API_ENDPOINTS.EMPLOYEES}/${id}`, data).then(unwrap),
  remove: (id) => api.delete(`${API_ENDPOINTS.EMPLOYEES}/${id}`).then(unwrap),
};

export default employeeService;
