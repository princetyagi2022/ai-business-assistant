import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
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
import CustomerList from '@/pages/customers/CustomerList';
import DataModulePage from '@/pages/DataModulePage';
import LeadSearchPage from '@/pages/leads/LeadSearchPage';

import NotFound from '@/pages/errors/NotFound';
import Forbidden from '@/pages/errors/Forbidden';
import ServerError from '@/pages/errors/ServerError';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />

    <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
    </Route>

    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ai-agents" element={<AgentsDashboard />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/notifications" element={<NotificationCenter />} />

      <Route path="/users" element={<UserList />} />
      <Route path="/users/create" element={<CreateUser />} />
      <Route path="/users/:id/edit" element={<EditUser />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="/profile" element={<UserProfile />} />

      <Route path="/products" element={<ProductList />} />
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

      <Route path="/employees" element={<DataModulePage title="Employees" subtitle="Real employee records from the backend dataset" endpoint="/employees" />} />
      <Route path="/inventory" element={<DataModulePage title="Inventory" subtitle="Live stock levels, reorder points, and inventory value" endpoint="/inventory" />} />
      <Route path="/sales" element={<DataModulePage title="Sales" subtitle="Sales orders and regional revenue from backend data" endpoint="/sales" />} />
      <Route path="/orders" element={<DataModulePage title="Orders" subtitle="Customer orders and fulfillment records" endpoint="/orders" />} />
      <Route path="/finance" element={<DataModulePage title="Finance" subtitle="Revenue and expense transactions" endpoint="/finance/transactions" />} />
      <Route path="/marketing" element={<DataModulePage title="Marketing" subtitle="Campaign performance, conversions, and ROI" endpoint="/marketing/campaigns" />} />
      <Route path="/campaigns" element={<DataModulePage title="Campaigns" subtitle="Campaign performance, conversions, and ROI" endpoint="/marketing/campaigns" />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/reports" element={<DataModulePage title="Reports" subtitle="Generated reports backed by current business datasets" endpoint="/reports" />} />
      <Route path="/documents" element={<DataModulePage title="Documents" subtitle="Available project documents and source datasets" endpoint="/documents" />} />
    </Route>

    <Route element={<BlankLayout />}>
      <Route path="/403" element={<Forbidden />} />
      <Route path="/500" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
