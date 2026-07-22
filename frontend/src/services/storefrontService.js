import api, { unwrap } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

const storefrontService = {
  // In-stock products grouped by category: [{ category, products: [...] }]
  getCatalog: () => api.get(API_ENDPOINTS.SHOP.CATALOG).then(unwrap),
  // items: [{ productId, quantity }], shippingAddress
  placeOrder: (payload) => api.post(API_ENDPOINTS.SHOP.ORDERS, payload).then(unwrap),
  // Orders placed by the logged-in customer
  getMyOrders: () => api.get(API_ENDPOINTS.MY_ORDERS).then(unwrap),
};

export default storefrontService;
