import axios from 'axios';
import api, { unwrap } from './api';
import { API_ENDPOINTS, ML_API_BASE_URL } from '@/utils/constants';

const mlApi = axios.create({
  baseURL: ML_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

const chatbotService = {
  async sendMessage(message, sessionId) {
    const payload = { message, sessionId };
    try {
      return await api.post(`${API_ENDPOINTS.CHATBOT}/chat`, payload).then(unwrap);
    } catch (backendError) {
      try {
        const response = await mlApi.post('/chatbot/chat', payload);
        return response.data;
      } catch {
        throw backendError;
      }
    }
  },
  getHistory: (sessionId) =>
    api.get(`${API_ENDPOINTS.CHATBOT}/history`, { params: { sessionId } }).then(unwrap),
  clearHistory: (sessionId) =>
    api.delete(`${API_ENDPOINTS.CHATBOT}/history`, { params: { sessionId } }).then(unwrap),
};

export default chatbotService;
