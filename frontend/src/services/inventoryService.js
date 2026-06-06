import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const inventoryService = {
  getAll: (params) => api.get(API_ENDPOINTS.INVENTORY, { params }).then(unwrap),
  getById: (id) => api.get(`${API_ENDPOINTS.INVENTORY}/${id}`).then(unwrap),
  update: (id, data) => api.put(`${API_ENDPOINTS.INVENTORY}/${id}`, data).then(unwrap),
  adjustStock: (id, quantity) =>
    api.patch(`${API_ENDPOINTS.INVENTORY}/${id}/stock`, { quantity }).then(unwrap),
};

export default inventoryService;
