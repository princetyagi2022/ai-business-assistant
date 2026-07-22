import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Loading…" />;
  }

  if (isAuthenticated) {
    // Send to the role-aware root so customers (ROLE_USER) land on the shop
    // and staff land on the dashboard, instead of forcing everyone to
    // /dashboard (which bounces customers to /403).
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
