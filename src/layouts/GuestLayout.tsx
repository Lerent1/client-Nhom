// ============================================================
// GuestLayout — Wrapper layout cho các trang khách hàng
// ============================================================

import { Outlet } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import Footer from '@/components/common/Footer/Footer';

export default function GuestLayout() {
  return (
    <>
      <Header />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
