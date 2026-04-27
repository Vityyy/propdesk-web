import { Navigate } from 'react-router';
import authService from '../../services/authService';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('ADMIN' | 'OWNER')[];
  fallbackPath?: string;
}

export function RoleProtectedRoute({ 
  children, 
  allowedRoles, 
  fallbackPath = '/' 
}: RoleProtectedRouteProps) {
  const userRole = authService.getCurrentUserRole();

  if (!userRole || !allowedRoles.includes(userRole as 'ADMIN' | 'OWNER')) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
