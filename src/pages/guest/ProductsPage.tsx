// ============================================================
// ProductsPage — Catalog với tìm kiếm, lọc, sắp xếp, phân trang
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  RotateCcw,
} from 'lucide-react';
import { productService, categoryService } from '@/api/services/product.service';
import type { Category, FilterParams, Product } from '@/models/product.model';
import ProductCard from '@/components/common/Card/ProductCard';
import ProductCardSkeleton from '@/components/common/Card/ProductCardSkeleton';
import { useDebounce } from '@/hooks/useDebounce';

const SORT_OPTIONS = [
  { value: '', label: 'Mặc định' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'name_asc', label: 'Tên A → Z' },
  { value: 'newest', label: 'Mới nhất' },
] as const;

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial state from URL
  const urlKeyword = searchParams.get('keyword') ?? '';
  const urlCategory = searchParams.get('category') ?? '';
  const urlSort = (searchParams.get('sortBy') ?? '') as FilterParams['sortBy'] | '';
  const urlPage = Number(searchParams.get('page') ?? '1');

  const [keyword, setKeyword] = useState(urlKeyword);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState(urlSort);
  const [page, setPage] = useState(urlPage);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const debouncedKeyword = useDebounce(keyword, 450);

  // Load categories once
  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  // Sync URL → local state when URL changes externally (e.g. from Header search)
  useEffect(() => {
    setKeyword(searchParams.get('keyword') ?? '');
    setSelectedCategory(searchParams.get('category') ?? '');
    setSortBy((searchParams.get('sortBy') ?? '') as FilterParams['sortBy'] | '');
    setPage(Number(searchParams.get('page') ?? '1'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Fetch products whenever filters change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: FilterParams = {
        page,
        limit: PAGE_SIZE,
        ...(debouncedKeyword ? { keyword: debouncedKeyword } : {}),
        ...(selectedCategory ? { categorySlug: selectedCategory } : {}),
        ...(sortBy ? { sortBy: sortBy as FilterParams['sortBy'] } : {}),
      };
      const result = await productService.getProducts(params);
      setProducts(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      // If current page is beyond totalPages (after filter), reset to 1
      if (result.totalPages > 0 && page > result.totalPages) {
        setPage(1);
      }
    } catch {
      setError('Không thể tải sản phẩm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, selectedCategory, sortBy, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync state → URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedKeyword) params.keyword = debouncedKeyword;
    if (selectedCategory) params.category = selectedCategory;
    if (sortBy) params.sortBy = sortBy;
    if (page > 1) params.page = String(page);
    setSearchParams(params, { replace: true });
  }, [debouncedKeyword, selectedCategory, sortBy, page, setSearchParams]);

  function handleCategorySelect(slug: string) {
    setSelectedCategory(prev => prev === slug ? '' : slug);
    setPage(1);
    setFilterOpen(false);
  }

  function handleClearFilters() {
    setKeyword('');
    setSelectedCategory('');
    setSortBy('');
    setPage(1);
  }

  function handleKeywordClear() {
    setKeyword('');
    setPage(1);
  }

  const hasFilters = debouncedKeyword || selectedCategory || sortBy;
  const selectedCategoryName = categories.find(c => c.slug === selectedCategory)?.name;

  return (
    <div style={{ minHeight: '60vh' }}>
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '0.75rem' }}>
            <Link to="/" className="breadcrumb-link">Trang chủ</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>
              {selectedCategoryName ?? 'Tất cả sản phẩm'}
            </span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {selectedCategoryName ?? 'Tất cả sản phẩm'}
              </h1>
              {!loading && (
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                  {total} sản phẩm{debouncedKeyword ? ` cho "${debouncedKeyword}"` : ''}
                </p>
              )}
            </div>

            {/* Sort + mobile filter toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                className="select"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as FilterParams['sortBy'] | ''); setPage(1); }}
                aria-label="Sắp xếp theo"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setFilterOpen(!filterOpen)}
                aria-label="Mở bộ lọc"
                aria-expanded={filterOpen}
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
              >
                <SlidersHorizontal size={16} /> Lọc
              </button>
            </div>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Đang lọc:</span>
              {debouncedKeyword && (
                <span className="badge badge-blue" style={{ gap: '0.25rem', cursor: 'pointer' }} onClick={handleKeywordClear}>
                  <Search size={10} /> {debouncedKeyword} <X size={10} />
                </span>
              )}
              {selectedCategory && (
                <span className="badge badge-blue" style={{ gap: '0.25rem', cursor: 'pointer' }} onClick={() => handleCategorySelect(selectedCategory)}>
                  {selectedCategoryName} <X size={10} />
                </span>
              )}
              {sortBy && (
                <span className="badge badge-gray" style={{ gap: '0.25rem', cursor: 'pointer' }} onClick={() => { setSortBy(''); setPage(1); }}>
                  {SORT_OPTIONS.find(o => o.value === sortBy)?.label} <X size={10} />
                </span>
              )}
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleClearFilters}
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: '#dc2626', borderColor: '#fca5a5' }}
              >
                <RotateCcw size={12} /> Xóa tất cả
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Sidebar filter */}
          <aside
            aria-label="Bộ lọc sản phẩm"
            style={{
              width: '220px',
              flexShrink: 0,
              background: '#fff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              position: 'sticky',
              top: '80px',
              display: filterOpen ? 'block' : 'none',
            }}
            className="filter-sidebar"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>Bộ lọc</span>
              {hasFilters && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleClearFilters}
                  style={{ fontSize: '0.75rem', color: '#dc2626', padding: '0.2rem 0.5rem' }}
                >
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Keyword search in sidebar */}
            <div className="filter-group">
              <p className="filter-group-title">Tìm kiếm</p>
              <div style={{ position: 'relative' }}>
                <input
                  type="search"
                  className="input"
                  placeholder="Tên sản phẩm..."
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                  aria-label="Tìm kiếm theo tên sản phẩm"
                  style={{ paddingRight: keyword ? '2rem' : undefined }}
                />
                {keyword && (
                  <button
                    onClick={handleKeywordClear}
                    aria-label="Xóa tìm kiếm"
                    style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Category filter */}
            <div className="filter-group">
              <p className="filter-group-title">Danh mục</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button
                  onClick={() => handleCategorySelect('')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 0.625rem', borderRadius: '0.375rem',
                    border: 'none', background: !selectedCategory ? '#eff6ff' : 'transparent',
                    color: !selectedCategory ? '#1d4ed8' : '#475569',
                    fontWeight: !selectedCategory ? 700 : 400,
                    fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all 0.15s',
                  }}
                >
                  Tất cả danh mục
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.5rem 0.625rem', borderRadius: '0.375rem',
                      border: 'none', background: selectedCategory === cat.slug ? '#eff6ff' : 'transparent',
                      color: selectedCategory === cat.slug ? '#1d4ed8' : '#475569',
                      fontWeight: selectedCategory === cat.slug ? 700 : 400,
                      fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', width: '100%',
                      transition: 'all 0.15s',
                    }}
                    aria-pressed={selectedCategory === cat.slug}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.slug && <X size={12} />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Mobile keyword search */}
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }} className="mobile-search-bar">
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="search"
                  className="input"
                  placeholder="Tìm theo tên sản phẩm..."
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                  aria-label="Tìm kiếm sản phẩm"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            {error ? (
              <div className="error-state">
                <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
                <button className="btn btn-primary" onClick={fetchProducts}>Thử lại</button>
              </div>
            ) : loading ? (
              <div className="product-grid">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <Package size={56} style={{ opacity: 0.25, marginBottom: '1rem' }} />
                <p className="empty-state-title">Không tìm thấy sản phẩm</p>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                  {hasFilters ? 'Thử thay đổi từ khóa hoặc xóa bộ lọc' : 'Danh mục chưa có sản phẩm'}
                </p>
                {hasFilters && (
                  <button className="btn btn-secondary" onClick={handleClearFilters}>
                    <RotateCcw size={14} /> Xóa bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination" style={{ marginTop: '2rem' }} role="navigation" aria-label="Phân trang">
                    <button
                      className="pagination-btn"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      aria-label="Trang trước"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                      .reduce<(number | '...')[]>((acc, p, i, arr) => {
                        if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === '...' ? (
                          <span key={`ellipsis-${i}`} style={{ padding: '0 0.25rem', color: '#94a3b8' }}>…</span>
                        ) : (
                          <button
                            key={p}
                            className={`pagination-btn${page === p ? ' active' : ''}`}
                            onClick={() => setPage(p as number)}
                            aria-label={`Trang ${p}`}
                            aria-current={page === p ? 'page' : undefined}
                          >
                            {p}
                          </button>
                        )
                      )}

                    <button
                      className="pagination-btn"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      aria-label="Trang sau"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .filter-sidebar { display: block !important; }
          .mobile-search-bar { display: none !important; }
        }
        @media (max-width: 767px) {
          .filter-sidebar { 
            position: fixed !important; 
            top: 0 !important; left: 0 !important; bottom: 0 !important; 
            width: min(300px, 85vw) !important;
            z-index: 250 !important;
            border-radius: 0 !important;
            overflow-y: auto !important;
            box-shadow: 4px 0 30px rgba(0,0,0,0.2) !important;
            padding-top: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
