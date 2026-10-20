import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from './routes.config';

interface ProtectedRouteProps {
  allowedRoles?: Array<'admin' | 'customer'>;
  children?: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
