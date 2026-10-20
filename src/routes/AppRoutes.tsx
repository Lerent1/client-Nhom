import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import GuestLayout from '@/layouts/GuestLayout';
import AuthLayout from '@/layouts/AuthLayout';

import HomePage from '@/pages/guest/HomePage';
import ProductsPage from '@/pages/guest/ProductsPage';
import ProductDetailPage from '@/pages/guest/ProductDetailPage';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { ROUTES } from './routes.config';

import {
  LoginPageFallback,
  RegisterPageFallback,
  CartPageFallback,
  CheckoutPageFallback,
  ProfilePageFallback,
  AdminLayoutFallback,
  AdminDashboardFallback,
  AdminProductsFallback,
  AdminOrdersFallback,
  UnauthorizedPageFallback,
  NotFoundPageFallback,
} from './routeFallbacks';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPageFallback />} />

          <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
            <Route path="checkout" element={<CheckoutPageFallback />} />
            <Route path="profile" element={<ProfilePageFallback />} />
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPageFallback />} />
            <Route path="register" element={<RegisterPageFallback />} />
          </Route>
        </Route>

        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayoutFallback />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path="dashboard" element={<AdminDashboardFallback />} />
          <Route path="products" element={<AdminProductsFallback />} />
          <Route path="orders" element={<AdminOrdersFallback />} />
        </Route>

        <Route path="unauthorized" element={<UnauthorizedPageFallback />} />
        <Route path="*" element={<NotFoundPageFallback />} />
      </Routes>
    </BrowserRouter>
  );
}
