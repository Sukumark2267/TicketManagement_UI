import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles?.length && !auth.hasRole(roles)) {
    return <Navigate to={auth.dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
