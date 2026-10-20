// ============================================================
// HomePage — Trang chủ E-Shop Tech
// ============================================================

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Monitor,
  Package,
  Zap,
  TrendingUp,
  Star,
} from 'lucide-react';
import { productService, categoryService } from '@/api/services/product.service';
import type { Product, Category } from '@/models/product.model';
import ProductCard from '@/components/common/Card/ProductCard';
import ProductCardSkeleton from '@/components/common/Card/ProductCardSkeleton';

// Mapping category slug → icon
const CAT_ICONS: Record<string, React.ElementType> = {
  'dien-thoai': Smartphone,
  'laptop': Laptop,
  'may-tinh-bang': Tablet,
  'tai-nghe-loa': Headphones,
  'man-hinh': Monitor,
  'phu-kien': Package,
};

export default function HomePage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        const [cats, featured, newProds] = await Promise.all([
          categoryService.getCategories(),
          productService.getFeaturedProducts(8),
          productService.getNewProducts(4),
        ]);
        setCategories(cats);
        setFeaturedProducts(featured);
        setNewProducts(newProds);
      } catch {
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  function handleHeroSearch(e: React.FormEvent) {
    e.preventDefault();
    const kw = searchKeyword.trim();
    navigate(kw ? `/products?keyword=${encodeURIComponent(kw)}` : '/products');
  }

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="hero" aria-label="Banner giới thiệu">
        <div className="container" style={{ padding: '4rem 1rem 3rem', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid', gap: '2rem', alignItems: 'center',
            gridTemplateColumns: '1fr',
          }}
            className="hero-grid"
          >
            {/* Text */}
            <div style={{ maxWidth: '560px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37,99,235,0.3)', borderRadius: '999px', padding: '0.375rem 0.875rem', marginBottom: '1.25rem' }}>
                <Zap size={14} color="#93c5fd" />
                <span style={{ fontSize: '0.8125rem', color: '#93c5fd', fontWeight: 600 }}>Công nghệ đỉnh cao, giá tốt nhất</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: 900, color: '#f8fafc', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
                Khám phá thế giới<br />
                <span style={{ color: '#60a5fa' }}>công nghệ</span> cùng E-ShopTech
              </h1>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem' }}>
                Hàng ngàn sản phẩm điện tử chính hãng — điện thoại, laptop, tablet, tai nghe và nhiều hơn nữa với giá cạnh tranh, giao hàng nhanh toàn quốc.
              </p>

              {/* Hero search */}
              <form onSubmit={handleHeroSearch} role="search" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', maxWidth: '440px', background: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.25rem', backdropFilter: 'blur(8px)' }}>
                  <input
                    type="search"
                    placeholder="Tìm sản phẩm bạn cần..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    aria-label="Tìm kiếm sản phẩm"
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      padding: '0.625rem 0.875rem', color: '#f8fafc', fontSize: '0.9375rem',
                    }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ borderRadius: '0.5rem' }}>
                    <Search size={16} /> Tìm kiếm
                  </button>
                </div>
              </form>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn btn-primary btn-lg">
                  Xem tất cả sản phẩm <ArrowRight size={18} />
                </Link>
                <Link to="/products?category=dien-thoai" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#f8fafc', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                  <Smartphone size={18} /> Điện thoại mới
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }} className="hero-stats">
              {[
                { value: '500+', label: 'Sản phẩm' },
                { value: '50+', label: 'Thương hiệu' },
                { value: '10K+', label: 'Khách hàng' },
                { value: '4.9', label: 'Đánh giá', icon: <Star size={12} fill="#f59e0b" color="#f59e0b" /> },
              ].map(({ value, label, icon }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: '0.875rem',
                  padding: '1rem 1.25rem', border: '1px solid rgba(255,255,255,0.1)',
                  flex: '1 1 120px', minWidth: '100px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc' }}>{value}</span>
                    {icon}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="section" aria-label="Danh mục sản phẩm">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 className="section-title">Danh mục sản phẩm</h2>
            <Link to="/products" style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="category-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.25rem 0.75rem', background: '#fff', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
                  <div className="skeleton" style={{ width: '70%', height: '0.75rem' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="category-grid">
              {categories.map((cat) => {
                const Icon = CAT_ICONS[cat.slug] ?? Package;
                return (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    aria-label={`Danh mục ${cat.name}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: '0.75rem', padding: '1.25rem 0.75rem',
                      background: '#fff', borderRadius: '0.875rem', border: '1px solid #e2e8f0',
                      transition: 'all 0.25s ease', cursor: 'pointer',
                      textAlign: 'center',
                    }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderColor = '#bfdbfe';
                        el.style.background = '#eff6ff';
                        el.style.transform = 'translateY(-3px)';
                        el.style.boxShadow = '0 8px 24px rgba(37,99,235,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderColor = '#e2e8f0';
                        el.style.background = '#fff';
                        el.style.transform = 'none';
                        el.style.boxShadow = 'none';
                      }}
                    >
                      <span style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '52px', height: '52px', borderRadius: '14px',
                        background: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
                      }}>
                        <Icon size={26} color="#2563eb" strokeWidth={1.5} />
                      </span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section" style={{ background: '#fff', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }} aria-label="Sản phẩm nổi bật">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 className="section-title">Sản phẩm nổi bật</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Những sản phẩm được yêu thích nhất</p>
            </div>
            <Link to="/products" style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          {error ? (
            <div className="error-state">
              <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>Thử lại</button>
            </div>
          ) : loading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-title">Chưa có sản phẩm nổi bật</p>
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ===== NEW PRODUCTS ===== */}
      {newProducts.length > 0 && (
        <section className="section" aria-label="Sản phẩm mới nhất">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={22} color="#2563eb" /> Hàng mới về
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Sản phẩm mới nhất vừa cập bến</p>
              </div>
              <Link to="/products?sortBy=newest" style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>
            <div className="product-grid">
              {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== PROMO BANNER ===== */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', padding: '3rem 0' }} aria-label="Ưu đãi đặc biệt">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.75rem' }}>
            Khám phá toàn bộ danh mục
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.75rem', maxWidth: '480px', margin: '0 auto 1.75rem' }}>
            Hơn 500 sản phẩm công nghệ chính hãng đang chờ bạn — tìm kiếm, lọc và đặt hàng ngay hôm nay.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Xem tất cả sản phẩm <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <style>{`
        @media (min-width: 768px) {
          .hero-grid { grid-template-columns: 3fr 2fr !important; }
          .hero-stats { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
