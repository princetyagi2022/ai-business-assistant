import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const notificationService = {
  getAll: (params) => api.get(API_ENDPOINTS.NOTIFICATIONS, { params }).then(unwrap),
  markRead: (id) => api.patch(`${API_ENDPOINTS.NOTIFICATIONS}/${id}/read`).then(unwrap),
  markAllRead: () => api.patch(`${API_ENDPOINTS.NOTIFICATIONS}/read-all`).then(unwrap),
  remove: (id) => api.delete(`${API_ENDPOINTS.NOTIFICATIONS}/${id}`).then(unwrap),
};

export default notificationService;
