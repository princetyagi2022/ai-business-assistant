import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { useAuth } from '@/context/AuthContext';
import { ROLES, STAFF_ROLES, STAFF_MANAGER_ROLES } from '@/utils/constants';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import BlankLayout from '@/layouts/BlankLayout';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';

import Dashboard from '@/pages/dashboard/Dashboard';
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';
import AgentsDashboard from '@/pages/ai-agents/AgentsDashboard';
import ChatbotPage from '@/pages/chatbot/ChatbotPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import NotificationCenter from '@/pages/notifications/NotificationCenter';

import UserList from '@/pages/users/UserList';
import CreateUser from '@/pages/users/CreateUser';
import EditUser from '@/pages/users/EditUser';
import UserProfile from '@/pages/users/UserProfile';
import UserDetails from '@/pages/users/UserDetails';

import ProductList from '@/pages/products/ProductList';
import CreateProduct from '@/pages/products/CreateProduct';
import CustomerList from '@/pages/customers/CustomerList';
import PaymentList from '@/pages/payments/PaymentList';
import PaymentCreate from '@/pages/payments/PaymentCreate';
import PaymentDetails from '@/pages/payments/PaymentDetails';
import DataModulePage from '@/pages/DataModulePage';
import LeadSearchPage from '@/pages/leads/LeadSearchPage';

import ShopPage from '@/pages/shop/ShopPage';
import MyOrdersPage from '@/pages/shop/MyOrdersPage';
import InventoryPage from '@/pages/inventory/InventoryPage';
import OrdersPage from '@/pages/orders/OrdersPage';

import NotFound from '@/pages/errors/NotFound';
import Forbidden from '@/pages/errors/Forbidden';
import ServerError from '@/pages/errors/ServerError';

// Normal (ROLE_USER) customers land on the storefront; staff land on the console.
const RootRedirect = () => {
  const { user } = useAuth();
  if (user?.role === ROLES.USER) {
    return <Navigate to="/shop" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute><RootRedirect /></ProtectedRoute>} />

    <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
    </Route>

    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      {/* Storefront — normal registered users only */}
      <Route element={<ProtectedRoute roles={[ROLES.USER]}><Outlet /></ProtectedRoute>}>
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
      </Route>

      {/* Shared for every authenticated user */}
      <Route path="/profile" element={<UserProfile />} />

      {/* Business console — staff roles only (blocks normal users) */}
      <Route element={<ProtectedRoute roles={STAFF_ROLES}><Outlet /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-agents" element={<AgentsDashboard />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationCenter />} />

        <Route path="/customers" element={<CustomerList />} />
        <Route path="/leads" element={<Navigate to="/leads/search" replace />} />
        <Route path="/leads/search" element={<LeadSearchPage />} />
        <Route
          path="/leads/saved"
          element={(
            <CustomerList
              title="Saved Leads"
              subtitle="Saved lead records from the customer dataset"
              searchPlaceholder="Search saved leads..."
            />
          )}
        />

        <Route path="/products" element={<ProductList />} />
        <Route path="/products/create" element={<CreateProduct />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/sales" element={<DataModulePage title="Sales" subtitle="Sales orders and regional revenue from backend data" endpoint="/sales" />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/marketing" element={<DataModulePage title="Marketing" subtitle="Campaign performance, conversions, and ROI" endpoint="/marketing/campaigns" />} />
        <Route path="/campaigns" element={<DataModulePage title="Campaigns" subtitle="Campaign performance, conversions, and ROI" endpoint="/marketing/campaigns" />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/reports" element={<DataModulePage title="Reports" subtitle="Generated reports backed by current business datasets" endpoint="/reports" />} />
        <Route path="/documents" element={<DataModulePage title="Documents" subtitle="Available project documents and source datasets" endpoint="/documents" />} />
      </Route>

      {/* Admin / Manager only — staff management + finance */}
      <Route element={<ProtectedRoute roles={STAFF_MANAGER_ROLES}><Outlet /></ProtectedRoute>}>
        <Route path="/users" element={<UserList />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/users/:id/edit" element={<EditUser />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/employees" element={<DataModulePage title="Employees" subtitle="Real employee records from the backend dataset" endpoint="/employees" />} />
        <Route path="/finance" element={<DataModulePage title="Finance" subtitle="Revenue and expense transactions" endpoint="/finance/transactions" />} />
        <Route path="/payments" element={<PaymentList />} />
        <Route path="/payments/create" element={<PaymentCreate />} />
        <Route path="/payments/:id" element={<PaymentDetails />} />
      </Route>
    </Route>

    <Route element={<BlankLayout />}>
      <Route path="/403" element={<Forbidden />} />
      <Route path="/500" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
