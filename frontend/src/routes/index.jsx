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
import Placeholder from '@/pages/Placeholder';

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

      <Route path="/employees" element={<Placeholder title="Employees" description="Manage employee records and assignments." />} />
      <Route path="/inventory" element={<Placeholder title="Inventory" description="Track stock levels and warehouse operations." />} />
      <Route path="/sales" element={<Placeholder title="Sales" description="View sales pipeline and performance." />} />
      <Route path="/orders" element={<Placeholder title="Orders" description="Manage customer orders and fulfillment." />} />
      <Route path="/finance" element={<Placeholder title="Finance" description="Financial overview, transactions, and reports." />} />
      <Route path="/marketing" element={<Placeholder title="Marketing" description="Campaign management and audience insights." />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/reports" element={<Placeholder title="Reports" description="Generate and download business reports." />} />
      <Route path="/documents" element={<Placeholder title="Documents" description="Upload and manage business documents." />} />
    </Route>

    <Route element={<BlankLayout />}>
      <Route path="/403" element={<Forbidden />} />
      <Route path="/500" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
