import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../admin/services/AuthService';

export const RoleGuard = ({ children, allowedRoles }) => {
  const location = useLocation();
  const user = AuthService.getCurrentUser();
  const userRole = user?.role || 'EMPLOYEE'; // Default to EMPLOYEE if no role

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If user is logged in but doesn't have permission
    return <Navigate to="/" replace />;
  }

  return children;
};
