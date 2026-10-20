// ============================================================
// Footer — Common footer for guest pages
// ============================================================

import { Link } from 'react-router-dom';
import {
  Zap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Youtube,
  Shield,
  Truck,
  RefreshCw,
  HeadphonesIcon,
} from 'lucide-react';

const FOOTER_CATEGORIES = [
  { label: 'Điện thoại', slug: 'dien-thoai' },
  { label: 'Laptop', slug: 'laptop' },
  { label: 'Máy tính bảng', slug: 'may-tinh-bang' },
  { label: 'Tai nghe & Loa', slug: 'tai-nghe-loa' },
  { label: 'Màn hình', slug: 'man-hinh' },
  { label: 'Phụ kiện', slug: 'phu-kien' },
];

const FOOTER_POLICIES = [
  { label: 'Chính sách bảo hành', to: '/policies/warranty' },
  { label: 'Chính sách giao hàng', to: '/policies/shipping' },
  { label: 'Chính sách đổi trả', to: '/policies/returns' },
  { label: 'Bảo mật thông tin', to: '/policies/privacy' },
  { label: 'Điều khoản sử dụng', to: '/policies/terms' },
];

const SERVICE_FEATURES = [
  { icon: Truck, title: 'Giao hàng nhanh', desc: 'Toàn quốc trong 2-5 ngày' },
  { icon: Shield, title: 'Bảo hành chính hãng', desc: 'Từ 12 đến 24 tháng' },
  { icon: RefreshCw, title: 'Đổi trả dễ dàng', desc: 'Trong vòng 30 ngày' },
  { icon: HeadphonesIcon, title: 'Hỗ trợ 24/7', desc: 'Tư vấn tận tâm' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" style={{ background: '#0f172a', color: '#cbd5e1', marginTop: 'auto' }}>
      {/* Service features bar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container" style={{ padding: '1.5rem 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
          }}
            className="service-features-grid"
          >
            {SERVICE_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(37,99,235,0.2)', flexShrink: 0,
                }}>
                  <Icon size={18} color="#60a5fa" />
                </span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#f1f5f9' }}>{title}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding: '3rem 1rem 2rem' }}>
        <div style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: '1fr',
        }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', textDecoration: 'none' }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #1e40af, #2563eb)',
              }}>
                <Zap size={20} color="#fff" strokeWidth={2.5} />
              </span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc' }}>
                E-Shop<span style={{ color: '#60a5fa' }}>Tech</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#94a3b8', maxWidth: '280px', margin: '0 0 1.5rem' }}>
              Cửa hàng điện tử và công nghệ uy tín — nơi bạn tìm thấy những sản phẩm chất lượng với mức giá tốt nhất.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.08)', color: '#94a3b8',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,99,235,0.3)'; (e.currentTarget as HTMLAnchorElement).style.color = '#60a5fa'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              Danh mục sản phẩm
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {FOOTER_CATEGORIES.map(({ label, slug }) => (
                <li key={slug}>
                  <Link
                    to={`/products?category=${slug}`}
                    style={{ fontSize: '0.875rem', color: '#94a3b8', transition: 'color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              Chính sách
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {FOOTER_POLICIES.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ fontSize: '0.875rem', color: '#94a3b8', transition: 'color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              Liên hệ
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <MapPin size={15} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Địa chỉ liên hệ của cửa hàng</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Phone size={15} color="#60a5fa" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Số điện thoại hỗ trợ</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Mail size={15} color="#60a5fa" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Email liên hệ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem 1rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
            © {currentYear} E-ShopTech. Bảo lưu mọi quyền.
          </p>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
            Xây dựng với React 19 · TypeScript · Tailwind CSS v4
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .service-features-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr 1.5fr !important; }
        }
      `}</style>
    </footer>
  );
}
