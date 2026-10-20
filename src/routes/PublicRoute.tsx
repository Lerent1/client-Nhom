import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from './routes.config';

interface PublicRouteProps {
  children?: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    const fromPath = (location.state as { from?: Location })?.from?.pathname;
    if (fromPath) {
      return <Navigate to={fromPath} replace />;
    }

    if (user?.role === 'admin') {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }

    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
