import axios from 'axios';
import { ML_API_BASE_URL } from '@/utils/constants';

const mlApi = axios.create({
  baseURL: ML_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

const unwrap = (response) => response.data;

const mlAnalyticsService = {
  getCatalog: () => mlApi.get('/datasets/catalog').then(unwrap),
  getDataset: (module) => mlApi.get(`/datasets/${module}`).then(unwrap),
  runOperation: (module, operation) => mlApi.get(`/datasets/${module}/${operation}/sample`).then(unwrap),
};

export default mlAnalyticsService;
