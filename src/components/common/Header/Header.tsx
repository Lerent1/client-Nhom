// ============================================================
// Header — Customer-facing header with search, cart, auth
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Monitor,
  Package,
  LogOut,
  Settings,
  Zap,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

const NAV_CATEGORIES = [
  { label: 'Điện thoại', slug: 'dien-thoai', icon: Smartphone },
  { label: 'Laptop', slug: 'laptop', icon: Laptop },
  { label: 'Máy tính bảng', slug: 'may-tinh-bang', icon: Tablet },
  { label: 'Tai nghe & Loa', slug: 'tai-nghe-loa', icon: Headphones },
  { label: 'Màn hình', slug: 'man-hinh', icon: Monitor },
  { label: 'Phụ kiện', slug: 'phu-kien', icon: Package },
];

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { totalItems } = useCartStore();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const catMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node)) {
        setCatMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const kw = keyword.trim();
    if (kw) {
      navigate(`/products?keyword=${encodeURIComponent(kw)}`);
    } else {
      navigate('/products');
    }
    setMobileOpen(false);
  }

  function handleLogout() {
    clearAuth();
    setUserMenuOpen(false);
    navigate('/');
  }

  return (
    <>
      <header className="header" role="banner">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '64px' }}>
            {/* Logo */}
            <Link
              to="/"
              aria-label="E-Shop Tech — Trang chủ"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, textDecoration: 'none' }}
            >
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #1e40af, #2563eb)',
              }}>
                <Zap size={20} color="#fff" strokeWidth={2.5} />
              </span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                E-Shop<span style={{ color: '#2563eb' }}>Tech</span>
              </span>
            </Link>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              style={{ flex: 1, display: 'flex', maxWidth: '480px', margin: '0 auto' }}
              role="search"
            >
              <div style={{ display: 'flex', width: '100%', position: 'relative' }}>
                <input
                  type="search"
                  className="input"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  aria-label="Tìm kiếm sản phẩm"
                  style={{ borderRadius: '0.5rem 0 0 0.5rem', borderRight: 'none' }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  aria-label="Tìm kiếm"
                  style={{ borderRadius: '0 0.5rem 0.5rem 0', padding: '0 1rem' }}
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Desktop Nav */}
            <nav aria-label="Danh mục" style={{ display: 'none' }} className="desktop-nav">
              {/* Catalog dropdown */}
              <div ref={catMenuRef} style={{ position: 'relative' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCatMenuOpen(!catMenuOpen)}
                  aria-haspopup="menu"
                  aria-expanded={catMenuOpen}
                  id="category-menu-btn"
                >
                  Danh mục <ChevronDown size={14} style={{ transform: catMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {catMenuOpen && (
                  <div
                    role="menu"
                    aria-labelledby="category-menu-btn"
                    style={{
                      position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0,
                      minWidth: '200px', background: '#fff', borderRadius: '0.75rem',
                      border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                      padding: '0.5rem', zIndex: 300,
                    }}
                  >
                    {NAV_CATEGORIES.map(({ label, slug, icon: Icon }) => (
                      <Link
                        key={slug}
                        to={`/products?category=${slug}`}
                        role="menuitem"
                        onClick={() => setCatMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.625rem',
                          padding: '0.625rem 0.875rem', borderRadius: '0.5rem',
                          fontSize: '0.875rem', color: '#374151', transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f7ff')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Icon size={16} color="#2563eb" />
                        {label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid #e2e8f0', margin: '0.25rem 0' }} />
                    <Link
                      to="/products"
                      role="menuitem"
                      onClick={() => setCatMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                        padding: '0.625rem 0.875rem', borderRadius: '0.5rem',
                        fontSize: '0.875rem', fontWeight: 600, color: '#2563eb',
                      }}
                    >
                      Tất cả sản phẩm →
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              {/* Cart */}
              <Link
                to="/cart"
                className="btn btn-ghost btn-icon"
                aria-label={`Giỏ hàng (${totalItems} sản phẩm)`}
                style={{ position: 'relative' }}
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    background: '#ef4444', color: '#fff', fontSize: '0.625rem',
                    fontWeight: 700, borderRadius: '999px', minWidth: '16px', height: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
                  }}>
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* User menu */}
              {isAuthenticated ? (
                <div ref={userMenuRef} style={{ position: 'relative' }}>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    aria-label="Menu tài khoản"
                    style={{ borderRadius: '999px', overflow: 'hidden' }}
                  >
                    <User size={18} />
                  </button>
                  {userMenuOpen && (
                    <div
                      role="menu"
                      style={{
                        position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
                        minWidth: '200px', background: '#fff', borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                        padding: '0.5rem', zIndex: 300,
                      }}
                    >
                      <div style={{ padding: '0.5rem 0.875rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{user?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{user?.email}</p>
                      </div>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', fontSize: '0.875rem', color: '#374151', borderRadius: '0.375rem' }}
                        >
                          <Settings size={14} /> Dashboard Admin
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', fontSize: '0.875rem', color: '#374151', borderRadius: '0.375rem' }}
                      >
                        <User size={14} /> Hồ sơ
                      </Link>
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', fontSize: '0.875rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', width: '100%', borderRadius: '0.375rem' }}
                      >
                        <LogOut size={14} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Link to="/login" className="btn btn-ghost btn-sm">Đăng nhập</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
                </div>
              )}

              {/* Hamburger */}
              <button
                className="btn btn-ghost btn-icon hamburger-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Mở menu"
                aria-expanded={mobileOpen}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Desktop category nav bar */}
          <nav aria-label="Điều hướng danh mục" style={{ display: 'flex', gap: '0.25rem', paddingBottom: '0.5rem', overflowX: 'auto' }} className="category-nav">
            {NAV_CATEGORIES.map(({ label, slug, icon: Icon }) => (
              <Link
                key={slug}
                to={`/products?category=${slug}`}
                className="btn btn-ghost btn-sm"
                style={{ whiteSpace: 'nowrap', fontSize: '0.8125rem' }}
              >
                <Icon size={14} /> {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="mobile-menu" role="dialog" aria-label="Menu điều hướng">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                E-Shop<span style={{ color: '#2563eb' }}>Tech</span>
              </span>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Đóng menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile search */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
              <form onSubmit={handleSearch} role="search">
                <div style={{ display: 'flex' }}>
                  <input
                    type="search"
                    className="input"
                    placeholder="Tìm kiếm..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    aria-label="Tìm kiếm sản phẩm"
                    style={{ borderRadius: '0.5rem 0 0 0.5rem', borderRight: 'none' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 0.5rem 0.5rem 0', padding: '0 0.875rem' }}>
                    <Search size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile nav */}
            <nav style={{ padding: '0.75rem 1rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.25rem 0.5rem' }}>
                Danh mục
              </p>
              {NAV_CATEGORIES.map(({ label, slug, icon: Icon }) => (
                <Link
                  key={slug}
                  to={`/products?category=${slug}`}
                  onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.5rem', fontSize: '0.9375rem', color: '#374151', borderRadius: '0.5rem' }}
                >
                  <Icon size={18} color="#2563eb" /> {label}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.5rem 0' }} />
              <Link
                to="/products"
                onClick={() => setMobileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.5rem', fontSize: '0.9375rem', fontWeight: 600, color: '#2563eb', borderRadius: '0.5rem' }}
              >
                Tất cả sản phẩm
              </Link>

              {/* Auth */}
              <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.5rem 0', paddingTop: '0.5rem' }}>
                {isAuthenticated ? (
                  <>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, padding: '0.5rem', color: '#0f172a' }}>{user?.name}</p>
                    <button
                      onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.5rem', fontSize: '0.9375rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
                    >
                      <LogOut size={18} /> Đăng xuất
                    </button>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem 0' }}>
                    <Link to="/login" className="btn btn-ghost" onClick={() => setMobileOpen(false)}>
                      Đăng nhập
                    </Link>
                    <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; align-items: center; gap: 0.25rem; }
          .hamburger-btn { display: none !important; }
          .category-nav { display: none !important; }
        }
        @media (max-width: 767px) {
          .category-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
