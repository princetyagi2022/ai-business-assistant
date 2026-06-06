import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const marketingService = {
  getCampaigns: (params) => api.get(`${API_ENDPOINTS.MARKETING}/campaigns`, { params }).then(unwrap),
  getCampaign: (id) => api.get(`${API_ENDPOINTS.MARKETING}/campaigns/${id}`).then(unwrap),
  createCampaign: (data) => api.post(`${API_ENDPOINTS.MARKETING}/campaigns`, data).then(unwrap),
};

export default marketingService;
