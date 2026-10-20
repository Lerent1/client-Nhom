// ============================================================
// ProductCard — Component dùng chung
// ============================================================

import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import type { Product } from '@/models/product.model';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/format';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    onAddToCart?.(product);
  }

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} aria-label={`Xem chi tiết ${product.name}`}>
        <div className="product-card-image">
          {/* Badge: New / Discount */}
          <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 1 }}>
            {product.isNew && (
              <span className="badge badge-blue">Mới</span>
            )}
            {(product.discountPercent ?? 0) > 0 && (
              <span className="badge badge-red">-{product.discountPercent}%</span>
            )}
          </div>

          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
            }}
          />
        </div>

        <div className="product-card-body">
          {product.brand && (
            <span className="product-card-brand">{product.brand}</span>
          )}
          <h3 className="product-card-name" title={product.name}>
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {product.rating} ({product.reviewCount ?? 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="product-card-price">
            <span className="product-card-price-sale">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-card-price-original">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          {isOutOfStock && <span className="stock-out">Hết hàng</span>}
          {isLowStock && <span className="stock-low">Còn {product.stock} sản phẩm</span>}
        </div>
      </Link>

      {/* Actions */}
      <div className="product-card-actions">
        <button
          className={`btn btn-sm flex-1 ${added ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={`Thêm ${product.name} vào giỏ hàng`}
          style={{ transition: 'all 0.2s' }}
        >
          <ShoppingCart size={14} />
          {added ? 'Đã thêm!' : isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
        <Link
          to={`/products/${product.id}`}
          className="btn btn-sm btn-ghost btn-icon"
          aria-label={`Xem chi tiết ${product.name}`}
        >
          <Eye size={14} />
        </Link>
      </div>
    </article>
  );
}
