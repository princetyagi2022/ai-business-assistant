import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const reportService = {
  getAll: (params) => api.get(API_ENDPOINTS.REPORTS, { params }).then(unwrap),
  getById: (id) => api.get(`${API_ENDPOINTS.REPORTS}/${id}`).then(unwrap),
  generate: (type, params) =>
    api.post(`${API_ENDPOINTS.REPORTS}/generate/${type}`, params).then(unwrap),
  download: (id) =>
    api.get(`${API_ENDPOINTS.REPORTS}/${id}/download`, { responseType: 'blob' }),
};

export default reportService;
