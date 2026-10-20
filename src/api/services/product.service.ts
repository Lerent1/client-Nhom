// ============================================================
// Product Service — tái sử dụng Axios instance
// Chế độ mock: VITE_ENABLE_MOCK_API=true
// Thay thế mock bằng axiosClient khi backend sẵn sàng
// ============================================================

import axiosClient from '@/api/axiosClient';
import { ENDPOINTS } from '@/api/endpoints';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/api/mockData';
import type {
  Category,
  FilterParams,
  Product,
  ProductListResponse,
} from '@/models/product.model';

const IS_MOCK = import.meta.env.VITE_ENABLE_MOCK_API === 'true';

// Giả lập độ trễ mạng khi dùng mock
const mockDelay = (ms = 400) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ---- Helpers cho mock ----
function applyFilters(
  products: Product[],
  params: FilterParams
): Product[] {
  let result = [...products];

  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(kw));
  }

  if (params.categoryId) {
    result = result.filter((p) => p.categoryId === params.categoryId);
  }

  if (params.categorySlug) {
    result = result.filter(
      (p) => p.category?.slug === params.categorySlug
    );
  }

  switch (params.sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'name_asc':
      result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      break;
    case 'newest':
      result.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
      break;
  }

  return result;
}

// ============================================================
// PRODUCT SERVICE
// ============================================================

export const productService = {
  /**
   * Lấy danh sách sản phẩm có phân trang, lọc, sắp xếp
   * TODO: thay thế mock bằng axiosClient khi backend sẵn sàng
   */
  async getProducts(params: FilterParams = {}): Promise<ProductListResponse> {
    if (IS_MOCK) {
      await mockDelay();
      const page = params.page ?? 1;
      const limit = params.limit ?? 12;
      const filtered = applyFilters(MOCK_PRODUCTS, params);
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const data = filtered.slice((page - 1) * limit, page * limit);
      return { data, total, page, limit, totalPages };
    }

    const response = await axiosClient.get<ProductListResponse>(
      ENDPOINTS.PRODUCTS,
      { params }
    );
    return response.data;
  },

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  async getProductById(id: number | string): Promise<Product> {
    if (IS_MOCK) {
      await mockDelay();
      const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));
      if (!product) throw new Error('Không tìm thấy sản phẩm');
      return product;
    }

    const response = await axiosClient.get<Product>(
      ENDPOINTS.PRODUCT_DETAIL(id)
    );
    return response.data;
  },

  /**
   * Lấy sản phẩm nổi bật cho trang chủ
   */
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    if (IS_MOCK) {
      await mockDelay();
      return MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
    }

    const response = await axiosClient.get<Product[]>(
      ENDPOINTS.PRODUCTS_FEATURED,
      { params: { limit } }
    );
    return response.data;
  },

  /**
   * Lấy sản phẩm mới nhất
   */
  async getNewProducts(limit = 8): Promise<Product[]> {
    if (IS_MOCK) {
      await mockDelay();
      return MOCK_PRODUCTS.filter((p) => p.isNew).slice(0, limit);
    }

    const response = await axiosClient.get<Product[]>(ENDPOINTS.PRODUCTS, {
      params: { sortBy: 'newest', limit },
    });
    return response.data;
  },

  /**
   * Lấy sản phẩm liên quan theo danh mục
   */
  async getRelatedProducts(
    categoryId: number,
    excludeId: number,
    limit = 4
  ): Promise<Product[]> {
    if (IS_MOCK) {
      await mockDelay(200);
      return MOCK_PRODUCTS.filter(
        (p) => p.categoryId === categoryId && p.id !== excludeId
      ).slice(0, limit);
    }

    const response = await axiosClient.get<ProductListResponse>(
      ENDPOINTS.PRODUCTS,
      { params: { categoryId, limit } }
    );
    return response.data.data.filter((p) => p.id !== excludeId);
  },
};

// ============================================================
// CATEGORY SERVICE
// ============================================================

export const categoryService = {
  /**
   * Lấy tất cả danh mục
   */
  async getCategories(): Promise<Category[]> {
    if (IS_MOCK) {
      await mockDelay(200);
      return MOCK_CATEGORIES;
    }

    const response = await axiosClient.get<Category[]>(ENDPOINTS.CATEGORIES);
    return response.data;
  },

  /**
   * Lấy chi tiết danh mục theo ID
   */
  async getCategoryById(id: number | string): Promise<Category> {
    if (IS_MOCK) {
      await mockDelay();
      const cat = MOCK_CATEGORIES.find((c) => c.id === Number(id));
      if (!cat) throw new Error('Không tìm thấy danh mục');
      return cat;
    }

    const response = await axiosClient.get<Category>(
      ENDPOINTS.CATEGORY_DETAIL(id)
    );
    return response.data;
  },
};
