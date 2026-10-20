import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Home,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  LayoutDashboard,
  Package,
  ClipboardList,
  Store,
  LogOut,
  UserCheck,
  Shield,
  CreditCard,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { ROUTES } from './routes.config';
import { formatPrice } from '@/utils/format';

export function LoginPageFallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: Location })?.from?.pathname || ROUTES.HOME;

  function handleLogin(role: 'admin' | 'customer') {
    if (role === 'admin') {
      setAuth(
        {
          id: 99,
          email: 'admin@eshop.com',
          name: 'Quản trị viên Hệ thống',
          role: 'admin',
        },
        'mock-admin-token-jwt'
      );
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } else {
      setAuth(
        {
          id: 1,
          email: email || 'customer@eshop.com',
          name: 'Khách hàng VIP',
          role: 'customer',
        },
        'mock-customer-token-jwt'
      );
      navigate(from === ROUTES.LOGIN ? ROUTES.HOME : from, { replace: true });
    }
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
          Đăng nhập tài khoản
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Truy cập hệ thống E-ShopTech
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin('customer');
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@eshop.com hoặc customer@eshop.com"
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.25rem' }}>
          Đăng nhập
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed #e2e8f0' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          🧪 Test nhanh phân quyền (RBAC)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => handleLogin('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.625rem',
              borderRadius: '0.5rem',
              border: '1.5px solid #2563eb',
              background: '#eff6ff',
              color: '#1d4ed8',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            <Shield size={16} /> Đăng nhập Admin (admin@eshop.com)
          </button>
          <button
            type="button"
            onClick={() => handleLogin('customer')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.625rem',
              borderRadius: '0.5rem',
              border: '1.5px solid #10b981',
              background: '#ecfdf5',
              color: '#047857',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            <UserCheck size={16} /> Đăng nhập Khách (customer@eshop.com)
          </button>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
        Chưa có tài khoản?{' '}
        <Link to={ROUTES.REGISTER} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}

export function RegisterPageFallback() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setAuth(
      {
        id: Date.now(),
        email: email || 'newuser@eshop.com',
        name: name || 'Người dùng mới',
        role: 'customer',
      },
      'mock-new-user-token'
    );
    navigate(ROUTES.HOME, { replace: true });
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
          Tạo tài khoản mới
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Gia nhập cộng đồng mua sắm E-ShopTech
        </p>
      </div>

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
            Họ và tên
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
            Mật khẩu
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.25rem' }}>
          Đăng ký tài khoản
        </button>
      </form>

      <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
        Đã có tài khoản?{' '}
        <Link to={ROUTES.LOGIN} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}

export function CartPageFallback() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '420px', margin: '0 auto', background: '#fff', padding: '3rem 2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <ShoppingCart size={54} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
            Giỏ hàng của bạn đang trống
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Hãy khám phá các sản phẩm công nghệ hot nhất và thêm vào giỏ nhé!
          </p>
          <Link to={ROUTES.PRODUCTS} className="btn btn-primary">
            <ShoppingBag size={16} /> Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Giỏ hàng ({totalItems} sản phẩm)
        </h1>
        <button
          onClick={clearCart}
          className="btn btn-ghost btn-sm"
          style={{ color: '#ef4444', fontSize: '0.8125rem' }}
        >
          <Trash2 size={14} /> Xoá tất cả
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="cart-grid">
        <div style={{ background: '#fff', borderRadius: '0.875rem', border: '1px solid #e2e8f0', padding: '1rem' }}>
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem 0',
                borderBottom: '1px solid #f1f5f9',
                alignItems: 'center',
              }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link
                  to={`/products/${product.id}`}
                  style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.9375rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {product.name}
                </Link>
                <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {formatPrice(product.price)}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: '28px', height: '28px', padding: 0 }}
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                >
                  -
                </button>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', minWidth: '20px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: '28px', height: '28px', padding: 0 }}
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(product.id)}
                className="btn btn-ghost btn-icon"
                style={{ color: '#94a3b8' }}
                aria-label="Xoá món này"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '0.875rem', border: '1px solid #e2e8f0', padding: '1.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            Tóm tắt đơn hàng
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
            <span>Tạm tính</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatPrice(totalPrice)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
            <span>Phí vận chuyển</span>
            <span style={{ fontWeight: 600, color: '#10b981' }}>Miễn phí</span>
          </div>
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Tổng cộng</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>{formatPrice(totalPrice)}</span>
          </div>
          <Link to={ROUTES.CHECKOUT} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <CreditCard size={18} /> Tiến hành đặt hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPageFallback() {
  const { totalPrice, totalItems, clearCart } = useCartStore();
  const [ordered, setOrdered] = useState(false);

  if (ordered) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', background: '#fff', padding: '3rem 2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <CheckCircle2 size={56} color="#10b981" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Đặt hàng thành công!
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Cảm ơn bạn đã tin tưởng E-ShopTech. Mã đơn hàng của bạn đã được ghi nhận vào hệ thống.
          </p>
          <Link to={ROUTES.HOME} className="btn btn-primary">
            <Home size={16} /> Quay về Trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
        Xác nhận & Thanh toán
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="cart-grid">
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.875rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Địa chỉ nhận hàng</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input className="input" placeholder="Họ và tên người nhận" defaultValue="Nguyễn Văn Khách" />
            <input className="input" placeholder="Số điện thoại" defaultValue="0987654321" />
            <input className="input" placeholder="Địa chỉ chi tiết (Số nhà, tên đường, phường/xã)" defaultValue="Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội" />
          </div>

          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '1rem' }}>Phương thức thanh toán</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <input type="radio" name="payment" defaultChecked />
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Thanh toán khi nhận hàng (COD)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <input type="radio" name="payment" />
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Cổng thanh toán điện tử VNPay / MoMo</span>
            </label>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.875rem', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Chi tiết đơn hàng</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Số lượng sản phẩm: <strong>{totalItems}</strong></p>
          <p style={{ fontSize: '1.125rem', color: '#0f172a', fontWeight: 800 }}>Tổng tiền: <span style={{ color: '#2563eb' }}>{formatPrice(totalPrice)}</span></p>
          <button
            onClick={() => {
              clearCart();
              setOrdered(true);
            }}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Hoàn tất đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfilePageFallback() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '999px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <User size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{user?.name || 'Tài khoản người dùng'}</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: '#64748b' }}>Vai trò hệ thống</span>
            <span style={{ fontWeight: 700, color: user?.role === 'admin' ? '#ef4444' : '#2563eb', textTransform: 'uppercase' }}>
              {user?.role}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: '#64748b' }}>Mã tài khoản (ID)</span>
            <span style={{ fontWeight: 600 }}>#{user?.id}</span>
          </div>
        </div>

        <button
          onClick={() => {
            clearAuth();
            navigate(ROUTES.HOME);
          }}
          className="btn btn-outline"
          style={{ width: '100%', color: '#ef4444', borderColor: '#fca5a5' }}
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>
    </div>
  );
}

export function AdminLayoutFallback() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <aside style={{ width: '250px', background: '#0f172a', color: '#f8fafc', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <Shield size={24} color="#60a5fa" />
          <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>
            Admin<span style={{ color: '#60a5fa' }}>Portal</span>
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            to={ROUTES.ADMIN_PRODUCTS}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
          >
            <Package size={18} /> Quản lý sản phẩm
          </Link>
          <Link
            to={ROUTES.ADMIN_ORDERS}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
          >
            <ClipboardList size={18} /> Quản lý đơn hàng
          </Link>
          <div style={{ borderTop: '1px solid #1e293b', margin: '0.75rem 0' }} />
          <Link
            to={ROUTES.HOME}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}
          >
            <Store size={18} /> Xem website khách
          </Link>
        </nav>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>{user?.name}</p>
            <span style={{ fontSize: '0.6875rem', color: '#60a5fa', fontWeight: 700 }}>ADMINISTRATOR</span>
          </div>
          <button
            onClick={() => {
              clearAuth();
              navigate(ROUTES.HOME);
            }}
            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
            title="Đăng xuất"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '64px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Khu vực Quản trị</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.625rem', borderRadius: '999px', fontWeight: 600 }}>
              RBAC: {user?.role}
            </span>
          </div>
        </header>
        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminDashboardFallback() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
        Tổng quan kinh doanh (Dashboard)
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Tổng doanh thu', value: '128.500.000 ₫', color: '#2563eb' },
          { label: 'Đơn hàng mới', value: '45 đơn', color: '#10b981' },
          { label: 'Sản phẩm đang bán', value: '18 sản phẩm', color: '#f59e0b' },
          { label: 'Khách hàng đăng ký', value: '1,240 người', color: '#8b5cf6' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0 0 0.5rem' }}>{stat.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Trạng thái phân quyền (RBAC Status)</h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          Trang này được bảo vệ bởi <code>ProtectedRoute (allowedRoles=[&apos;admin&apos;])</code>. Chỉ tài khoản có quyền admin mới có thể xem được nội dung này.
        </p>
      </div>
    </div>
  );
}

export function AdminProductsFallback() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
        Quản lý danh mục sản phẩm (Admin)
      </h1>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Tính năng quản lý thêm/sửa/xoá sản phẩm trong trang quản trị đang sẵn sàng tích hợp với API.
        </p>
        <Link to={ROUTES.PRODUCTS} className="btn btn-outline btn-sm">
          Xem catalog sản phẩm phía khách hàng →
        </Link>
      </div>
    </div>
  );
}

export function AdminOrdersFallback() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
        Quản lý đơn hàng (Admin)
      </h1>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Tính năng theo dõi đơn đặt hàng, duyệt đơn và cập nhật trạng thái vận chuyển đang sẵn sàng tích hợp với API.
        </p>
      </div>
    </div>
  );
}

export function UnauthorizedPageFallback() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center', background: '#fff', padding: '3rem 2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <ShieldAlert size={56} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          403 — Không có quyền truy cập
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Tài khoản của bạn không có đủ thẩm quyền để truy cập vào trang này. Vui lòng đăng nhập với tài khoản có vai trò Quản trị viên (Admin).
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to={ROUTES.LOGIN} className="btn btn-primary">
            Đổi tài khoản
          </Link>
          <Link to={ROUTES.HOME} className="btn btn-outline">
            <Home size={16} /> Về Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export function NotFoundPageFallback() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center', background: '#fff', padding: '3rem 2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <AlertTriangle size={56} color="#f59e0b" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
          404 — Trang không tồn tại
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Đường dẫn bạn yêu cầu không tồn tại, đã bị đổi tên hoặc tạm thời không khả dụng.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to={ROUTES.HOME} className="btn btn-primary">
            <Home size={16} /> Về Trang chủ
          </Link>
          <Link to={ROUTES.PRODUCTS} className="btn btn-outline">
            <ShoppingBag size={16} /> Xem sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}
