import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const documentService = {
  getAll: (params) => api.get(API_ENDPOINTS.DOCUMENTS, { params }).then(unwrap),
  upload: (formData) =>
    api.post(API_ENDPOINTS.DOCUMENTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(unwrap),
  remove: (id) => api.delete(`${API_ENDPOINTS.DOCUMENTS}/${id}`).then(unwrap),
};

export default documentService;
