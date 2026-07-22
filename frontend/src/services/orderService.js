import api, { unwrap } from '@/services/api';
import { API_ENDPOINTS } from '@/utils/constants';

// Fulfilment statuses staff may assign to an order (matches the backend whitelist).
export const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const orderService = {
  getAll: (params) => api.get(API_ENDPOINTS.ORDERS, { params }).then(unwrap),
  updateStatus: (id, status) =>
    api.put(`${API_ENDPOINTS.ORDERS}/${id}/status`, { status }).then(unwrap),
};

export default orderService;
