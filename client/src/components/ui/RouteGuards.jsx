import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import Loading from './Loading.jsx';

// Login talab qiladigan sahifalar uchun.
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loading full />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

// Faqat admin uchun.
export function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <Loading full />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
