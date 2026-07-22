import axios from 'axios';
import api, { unwrap } from './api';
import { API_ENDPOINTS, ML_API_BASE_URL } from '@/utils/constants';
import {
  revenueChartData,
  salesByCategory,
  ordersTrend,
  customerGrowth,
  inventoryLevels,
  marketingPerformance,
  aiInsights,
} from '@/utils/mockDashboard';

const mlApi = axios.create({
  baseURL: ML_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

const emptyDashboard = {
  dashboardStats: [],
  revenueChartData: [],
  salesByCategory: [],
  ordersTrend: [],
  customerGrowth: [],
  inventoryLevels: [],
  marketingPerformance: [],
  recentActivities: [],
  aiInsights: [],
};

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

// Build the stat cards the Dashboard renders from the backend's raw stats map.
const buildStats = (stats = {}) => [
  { id: 'revenue', label: 'Total Revenue', value: toNumber(stats.totalRevenue), format: 'currency', color: 'primary' },
  { id: 'orders', label: 'Orders', value: toNumber(stats.totalOrders), format: 'number', color: 'info' },
  { id: 'customers', label: 'Customers', value: toNumber(stats.totalCustomers), format: 'number', color: 'secondary' },
  { id: 'products', label: 'Products', value: toNumber(stats.totalProducts), format: 'number', color: 'success' },
  { id: 'inventory', label: 'Low Stock Items', value: toNumber(stats.lowStockItems), format: 'number', color: 'warning' },
  { id: 'employees', label: 'Employees', value: toNumber(stats.totalEmployees), format: 'number', color: 'primary' },
  { id: 'conversion', label: 'Active Users', value: toNumber(stats.activeUsers), format: 'number', color: 'success' },
  { id: 'support', label: 'Successful Payments', value: toNumber(stats.successfulPayments), format: 'number', color: 'error' },
];

// Map the backend's recent orders into the activity feed shape.
const buildActivities = (orders = []) =>
  orders.map((o) => ({
    id: o.id,
    type: 'order',
    message: `Order ${o.orderNumber} \u2022 ${o.status}`,
    time: o.orderDate,
    user: o.customer,
  }));

// Normalize any upstream response into the exact shape the Dashboard component needs.
// The backend returns { stats, recentOrders } and has no chart datasets, so the
// demo chart data is used to keep every widget populated. If an upstream already
// provides the full shape (e.g. the ML service), it is merged over the defaults.
const normalizeDashboard = (raw = {}) => {
  if (Array.isArray(raw.dashboardStats)) {
    return { ...emptyDashboard, ...raw };
  }

  return {
    dashboardStats: buildStats(raw.stats),
    revenueChartData,
    salesByCategory,
    ordersTrend,
    customerGrowth,
    inventoryLevels,
    marketingPerformance,
    recentActivities: buildActivities(raw.recentOrders),
    aiInsights,
  };
};

export const getDashboardData = async () => {
  try {
    const data = await api.get(API_ENDPOINTS.DASHBOARD).then(unwrap);
    return normalizeDashboard(data);
  } catch (backendError) {
    try {
      const response = await mlApi.get('/dashboard');
      return normalizeDashboard(response.data);
    } catch {
      throw backendError;
    }
  }
};
