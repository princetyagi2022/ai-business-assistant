import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const userService = {
  getAll: (params) => api.get(API_ENDPOINTS.USERS, { params }).then(unwrap),
  getById: (id) => api.get(`${API_ENDPOINTS.USERS}/${id}`).then(unwrap),
  create: (data) => api.post(API_ENDPOINTS.USERS, data).then(unwrap),
  update: (id, data) => api.put(`${API_ENDPOINTS.USERS}/${id}`, data).then(unwrap),
  remove: (id) => api.delete(`${API_ENDPOINTS.USERS}/${id}`).then(unwrap),
};

export default userService;
