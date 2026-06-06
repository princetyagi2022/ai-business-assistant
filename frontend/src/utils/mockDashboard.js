export const dashboardStats = [
  { id: 'revenue', label: 'Total Revenue', value: 284500, change: 12.4, format: 'currency', color: 'primary' },
  { id: 'orders', label: 'Orders', value: 1842, change: 8.2, format: 'number', color: 'info' },
  { id: 'customers', label: 'Customers', value: 956, change: 5.1, format: 'number', color: 'secondary' },
  { id: 'products', label: 'Products', value: 428, change: 2.3, format: 'number', color: 'success' },
  { id: 'inventory', label: 'Inventory Value', value: 156200, change: -1.8, format: 'currency', color: 'warning' },
  { id: 'employees', label: 'Employees', value: 124, change: 3.0, format: 'number', color: 'primary' },
  { id: 'conversion', label: 'Conversion Rate', value: 3.8, change: 0.6, format: 'percent', color: 'success' },
  { id: 'support', label: 'Open Tickets', value: 37, change: -12.5, format: 'number', color: 'error' },
];

export const revenueChartData = [
  { month: 'Jan', revenue: 42000, profit: 12000 },
  { month: 'Feb', revenue: 38000, profit: 10500 },
  { month: 'Mar', revenue: 51000, profit: 15800 },
  { month: 'Apr', revenue: 47000, profit: 14200 },
  { month: 'May', revenue: 55000, profit: 17100 },
  { month: 'Jun', revenue: 61500, profit: 19200 },
];

export const salesByCategory = [
  { name: 'Electronics', value: 35 },
  { name: 'Software', value: 28 },
  { name: 'Services', value: 22 },
  { name: 'Hardware', value: 15 },
];

export const ordersTrend = [
  { day: 'Mon', orders: 42 },
  { day: 'Tue', orders: 38 },
  { day: 'Wed', orders: 55 },
  { day: 'Thu', orders: 48 },
  { day: 'Fri', orders: 62 },
  { day: 'Sat', orders: 28 },
  { day: 'Sun', orders: 22 },
];

export const customerGrowth = [
  { month: 'Jan', customers: 720 },
  { month: 'Feb', customers: 745 },
  { month: 'Mar', customers: 780 },
  { month: 'Apr', customers: 810 },
  { month: 'May', customers: 890 },
  { month: 'Jun', customers: 956 },
];

export const inventoryLevels = [
  { category: 'A', stock: 420 },
  { category: 'B', stock: 310 },
  { category: 'C', stock: 180 },
  { category: 'D', stock: 95 },
];

export const marketingPerformance = [
  { channel: 'Email', clicks: 2400, conversions: 320 },
  { channel: 'Social', clicks: 1800, conversions: 210 },
  { channel: 'SEO', clicks: 3200, conversions: 450 },
  { channel: 'Ads', clicks: 1500, conversions: 280 },
];

export const recentActivities = [
  { id: 1, type: 'order', message: 'New order #ORD-2841 placed', time: '2026-06-05T10:30:00', user: 'Sarah Chen' },
  { id: 2, type: 'user', message: 'User account created: j.doe@company.com', time: '2026-06-05T09:15:00', user: 'Admin' },
  { id: 3, type: 'inventory', message: 'Low stock alert: Wireless Headphones', time: '2026-06-05T08:45:00', user: 'System' },
  { id: 4, type: 'sale', message: 'Sale completed: $12,400', time: '2026-06-04T16:20:00', user: 'Mike Ross' },
  { id: 5, type: 'agent', message: 'AI Agent completed fraud scan', time: '2026-06-04T14:00:00', user: 'Fraud Agent' },
];

export const aiInsights = [
  { id: 1, title: 'Revenue forecast up 8%', description: 'Q3 projection based on current sales velocity.', severity: 'success' },
  { id: 2, title: 'Inventory reorder suggested', description: '12 SKUs below safety stock threshold.', severity: 'warning' },
  { id: 3, title: 'Churn risk detected', description: '23 customers show declining engagement.', severity: 'error' },
];

export const mockUsers = [
  { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@demo.com', role: 'ROLE_ADMIN', status: 'ACTIVE', createdAt: '2025-01-15' },
  { id: 2, firstName: 'Sarah', lastName: 'Chen', email: 'sarah@company.com', role: 'ROLE_MANAGER', status: 'ACTIVE', createdAt: '2025-03-20' },
  { id: 3, firstName: 'Mike', lastName: 'Ross', email: 'mike@company.com', role: 'ROLE_EMPLOYEE', status: 'ACTIVE', createdAt: '2025-04-10' },
  { id: 4, firstName: 'Emily', lastName: 'Wong', email: 'emily@company.com', role: 'ROLE_USER', status: 'INACTIVE', createdAt: '2025-05-01' },
  { id: 5, firstName: 'James', lastName: 'Lee', email: 'james@company.com', role: 'ROLE_EMPLOYEE', status: 'ACTIVE', createdAt: '2025-06-01' },
];

export const mockProducts = [
  { id: 1, name: 'Enterprise Suite', sku: 'PRD-001', price: 999, stock: 120, category: 'Software' },
  { id: 2, name: 'Wireless Headphones', sku: 'PRD-002', price: 149, stock: 45, category: 'Electronics' },
  { id: 3, name: 'Cloud Storage 1TB', sku: 'PRD-003', price: 49, stock: 500, category: 'Services' },
];

export const mockCustomers = [
  { id: 1, name: 'Acme Corp', email: 'contact@acme.com', phone: '+1 555-0100', orders: 24, status: 'ACTIVE' },
  { id: 2, name: 'Globex Inc', email: 'sales@globex.com', phone: '+1 555-0200', orders: 18, status: 'ACTIVE' },
  { id: 3, name: 'Initech', email: 'info@initech.com', phone: '+1 555-0300', orders: 7, status: 'INACTIVE' },
];

export const mockAgents = [
  { id: 'sales', name: 'Sales Agent', description: 'Qualifies leads and drafts proposals.', status: 'active', tasksCompleted: 142 },
  { id: 'support', name: 'Support Agent', description: 'Handles tickets and customer queries.', status: 'active', tasksCompleted: 318 },
  { id: 'fraud', name: 'Fraud Detection', description: 'Monitors transactions for anomalies.', status: 'active', tasksCompleted: 89 },
  { id: 'inventory', name: 'Inventory Agent', description: 'Predicts stock needs and reorder points.', status: 'idle', tasksCompleted: 56 },
  { id: 'marketing', name: 'Marketing Agent', description: 'Optimizes campaigns and audience segments.', status: 'active', tasksCompleted: 201 },
];
