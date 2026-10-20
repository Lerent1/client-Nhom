// ============================================================
// AuthLayout — Wrapper cho các trang đăng nhập / đăng ký
// ============================================================

import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      padding: '2rem 1rem',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', textDecoration: 'none' }}>
        <span style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #1e40af, #2563eb)',
        }}>
          <Zap size={24} color="#fff" strokeWidth={2.5} />
        </span>
        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#f8fafc' }}>
          E-Shop<span style={{ color: '#60a5fa' }}>Tech</span>
        </span>
      </Link>

      <div style={{
        width: '100%', maxWidth: '420px',
        background: '#fff', borderRadius: '1rem',
        padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
      }}>
        <Outlet />
      </div>
    </div>
  );
}
