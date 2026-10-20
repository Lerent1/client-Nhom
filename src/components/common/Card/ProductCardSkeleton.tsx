// ============================================================
// ProductCardSkeleton — Loading placeholder for ProductCard
// ============================================================

export default function ProductCardSkeleton() {
  return (
    <div className="product-card" style={{ pointerEvents: 'none' }}>
      {/* Image */}
      <div className="product-card-image" style={{ background: '#f1f5f9' }}>
        <div className="skeleton" style={{ width: '60%', height: '60%', borderRadius: '0.5rem' }} />
      </div>

      {/* Body */}
      <div className="product-card-body" style={{ gap: '0.625rem' }}>
        <div className="skeleton" style={{ height: '0.75rem', width: '40%' }} />
        <div className="skeleton" style={{ height: '0.875rem', width: '90%' }} />
        <div className="skeleton" style={{ height: '0.875rem', width: '70%' }} />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <div className="skeleton" style={{ height: '1.25rem', width: '50%' }} />
          <div className="skeleton" style={{ height: '1.25rem', width: '30%' }} />
        </div>
      </div>

      {/* Actions */}
      <div className="product-card-actions">
        <div className="skeleton" style={{ height: '2rem', flex: 1, borderRadius: '0.5rem' }} />
        <div className="skeleton" style={{ height: '2rem', width: '2rem', borderRadius: '0.5rem' }} />
      </div>
    </div>
  );
}
