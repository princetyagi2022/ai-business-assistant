import axios from 'axios';
import api, { unwrap } from './api';
import { API_ENDPOINTS, ML_API_BASE_URL } from '@/utils/constants';

const mlApi = axios.create({
  baseURL: ML_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const getDashboardData = async () => {
  try {
    return await api.get(API_ENDPOINTS.DASHBOARD).then(unwrap);
  } catch (backendError) {
    try {
      const response = await mlApi.get('/dashboard');
      return response.data;
    } catch {
      throw backendError;
    }
  }
};
