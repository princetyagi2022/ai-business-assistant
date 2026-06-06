import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const financeService = {
  getSummary: () => api.get(`${API_ENDPOINTS.FINANCE}/summary`).then(unwrap),
  getTransactions: (params) =>
    api.get(`${API_ENDPOINTS.FINANCE}/transactions`, { params }).then(unwrap),
  getReports: (params) => api.get(`${API_ENDPOINTS.FINANCE}/reports`, { params }).then(unwrap),
};

export default financeService;
