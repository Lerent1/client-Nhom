// ============================================================
// ProductDetailPage — Trang chi tiết sản phẩm
// ============================================================

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  Package,
  Tag,
  ChevronRight,
  Minus,
  Plus,
  Check,
  AlertCircle,
  Truck,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { productService } from '@/api/services/product.service';
import type { Product } from '@/models/product.model';
import { useCartStore } from '@/store/useCartStore';
import ProductCard from '@/components/common/Card/ProductCard';
import ProductCardSkeleton from '@/components/common/Card/ProductCardSkeleton';
import { formatPrice } from '@/utils/format';

type ToastType = 'success' | 'error' | null;

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, items } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [toast, setToast] = useState<{ type: ToastType; message: string }>({ type: null, message: '' });

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      setQuantity(1);
      try {
        const data = await productService.getProductById(id!);
        setProduct(data);
        setSelectedImage(data.imageUrl);
        // Fetch related
        if (data.categoryId) {
          productService
            .getRelatedProducts(data.categoryId, data.id, 4)
            .then(setRelatedProducts)
            .catch(() => {});
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Không thể tải sản phẩm.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  function showToast(type: ToastType, message: string) {
    setToast({ type, message });
    setTimeout(() => setToast({ type: null, message: '' }), 3000);
  }

  function handleAddToCart() {
    if (!product) return;
    if (product.stock === 0) {
      showToast('error', 'Sản phẩm đã hết hàng');
      return;
    }

    const inCartQty = items.find(i => i.product.id === product.id)?.quantity ?? 0;
    if (inCartQty + quantity > product.stock) {
      showToast('error', `Chỉ còn ${product.stock} sản phẩm trong kho. Bạn đã có ${inCartQty} trong giỏ.`);
      return;
    }

    addItem(product, quantity);
    showToast('success', `Đã thêm ${quantity} "${product.name}" vào giỏ hàng!`);
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr' }} className="detail-grid">
          {/* Image skeleton */}
          <div className="skeleton" style={{ borderRadius: '0.875rem', aspectRatio: '1', width: '100%' }} />
          {/* Info skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ height: '1rem', width: '30%' }} />
            <div className="skeleton" style={{ height: '1.75rem', width: '90%' }} />
            <div className="skeleton" style={{ height: '1.75rem', width: '70%' }} />
            <div className="skeleton" style={{ height: '2rem', width: '50%' }} />
            <div className="skeleton" style={{ height: '4rem', width: '100%', borderRadius: '0.5rem' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="skeleton" style={{ height: '2.75rem', flex: 1, borderRadius: '0.5rem' }} />
              <div className="skeleton" style={{ height: '2.75rem', width: '140px', borderRadius: '0.5rem' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div className="error-state">
          <AlertCircle size={48} style={{ color: '#dc2626', marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
            {error ?? 'Không tìm thấy sản phẩm'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Quay lại
            </button>
            <Link to="/products" className="btn btn-primary">Xem tất cả sản phẩm</Link>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const allImages = [product.imageUrl, ...(product.images?.filter(img => img !== product.imageUrl) ?? [])];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="page-header">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Trang chủ</Link>
            <ChevronRight size={14} className="breadcrumb-sep" />
            <Link to="/products" className="breadcrumb-link">Sản phẩm</Link>
            {product.category && (
              <>
                <ChevronRight size={14} className="breadcrumb-sep" />
                <Link to={`/products?category=${product.category.slug}`} className="breadcrumb-link">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={14} className="breadcrumb-sep" />
            <span style={{ color: '#0f172a', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Product detail grid */}
        <div style={{ display: 'grid', gap: '2.5rem', gridTemplateColumns: '1fr', marginBottom: '3rem' }} className="detail-grid">
          {/* Images column */}
          <div>
            {/* Main image */}
            <div style={{
              background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0',
              overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '0.75rem',
            }}>
              <img
                src={selectedImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1.5rem' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=No+Image'; }}
              />
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    aria-label={`Ảnh sản phẩm ${i + 1}`}
                    style={{
                      width: '64px', height: '64px', borderRadius: '0.5rem',
                      border: `2px solid ${selectedImage === img ? '#2563eb' : '#e2e8f0'}`,
                      background: '#f8fafc', overflow: 'hidden', cursor: 'pointer',
                      padding: 0, transition: 'border-color 0.15s',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Brand & Category badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.brand && (
                <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Tag size={11} /> {product.brand}
                </span>
              )}
              {product.category && (
                <Link to={`/products?category=${product.category.slug}`}>
                  <span className="badge badge-gray">{product.category.name}</span>
                </Link>
              )}
              {product.isNew && <span className="badge badge-green">Hàng mới</span>}
            </div>

            {/* Name */}
            <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, margin: 0 }}>
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.round(product.rating!) ? '#f59e0b' : 'transparent'}
                      color={i < Math.round(product.rating!) ? '#f59e0b' : '#d1d5db'}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {product.rating} / 5 ({product.reviewCount ?? 0} đánh giá)
                </span>
              </div>
            )}

            {/* Price */}
            <div style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '1rem 1.25rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#dc2626' }}>
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {(product.discountPercent ?? 0) > 0 && (
                  <span className="badge badge-red" style={{ fontSize: '0.875rem' }}>
                    Tiết kiệm {product.discountPercent}%
                  </span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <p style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: 600, margin: '0.5rem 0 0' }}>
                  Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                </p>
              )}
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={16} color={isOutOfStock ? '#dc2626' : isLowStock ? '#d97706' : '#16a34a'} />
              {isOutOfStock ? (
                <span className="stock-out">Hết hàng — tạm thời không có sẵn</span>
              ) : isLowStock ? (
                <span className="stock-low">Chỉ còn {product.stock} sản phẩm trong kho</span>
              ) : (
                <span className="stock-in">Còn hàng ({product.stock} sản phẩm)</span>
              )}
            </div>

            {/* Quantity selector + Add to cart */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Qty */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  aria-label="Giảm số lượng"
                  style={{ padding: '0.5rem 0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', color: '#475569', transition: 'background 0.15s' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ padding: '0.5rem 1rem', fontWeight: 700, fontSize: '1rem', minWidth: '3rem', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  aria-label="Tăng số lượng"
                  style={{ padding: '0.5rem 0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', color: '#475569', transition: 'background 0.15s' }}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                style={{ flex: 1, minWidth: '180px' }}
                id="add-to-cart-btn"
              >
                <ShoppingCart size={18} />
                {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </button>
            </div>

            {/* Service badges */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '0.875rem', background: '#f0fdf4', borderRadius: '0.75rem', border: '1px solid #bbf7d0' }}>
              {[
                { icon: Truck, text: 'Giao hàng nhanh' },
                { icon: Shield, text: 'Bảo hành chính hãng' },
                { icon: RefreshCw, text: 'Đổi trả 30 ngày' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#15803d', fontWeight: 600 }}>
                  <Icon size={14} /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description + Specs */}
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr', marginBottom: '3rem' }} className="info-grid">
          {/* Description */}
          <div style={{ background: '#fff', borderRadius: '0.875rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              Mô tả sản phẩm
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.8 }}>
              {product.description}
            </p>
          </div>

          {/* Specs */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div style={{ background: '#fff', borderRadius: '0.875rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                Thông số kỹ thuật
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(product.specifications).map(([key, val], i) => (
                    <tr key={key} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                      <td style={{ padding: '0.625rem 0.875rem', fontWeight: 600, fontSize: '0.875rem', color: '#475569', width: '40%', verticalAlign: 'top' }}>
                        {key}
                      </td>
                      <td style={{ padding: '0.625rem 0.875rem', fontSize: '0.875rem', color: '#1e293b' }}>
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section aria-label="Sản phẩm liên quan">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 className="section-title">Sản phẩm liên quan</h2>
              {product.category && (
                <Link to={`/products?category=${product.category.slug}`} style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600 }}>
                  Xem thêm →
                </Link>
              )}
            </div>
            <div className="product-grid">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {relatedProducts.length === 0 && !loading && (
          <section>
            <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Sản phẩm liên quan</h2>
            <div className="product-grid">
              {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          </section>
        )}
      </div>

      {/* Toast notification */}
      {toast.type && (
        <div
          role="alert"
          aria-live="polite"
          className={`toast toast-${toast.type}`}
        >
          {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .detail-grid { grid-template-columns: 1fr 1fr !important; }
          .info-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
