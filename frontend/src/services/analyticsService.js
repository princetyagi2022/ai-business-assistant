import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const analyticsService = {
  getOverview: () => api.get(`${API_ENDPOINTS.ANALYTICS}/overview`).then(unwrap),
  getMetrics: (params) => api.get(`${API_ENDPOINTS.ANALYTICS}/metrics`, { params }).then(unwrap),
  getTrends: (params) => api.get(`${API_ENDPOINTS.ANALYTICS}/trends`, { params }).then(unwrap),
};

export default analyticsService;
