// ============================================================
// API Endpoints — tập trung toàn bộ đường dẫn API
// ============================================================

export const ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: number | string) => `/products/${id}`,
  PRODUCTS_FEATURED: '/products/featured',
  PRODUCTS_SEARCH: '/products/search',

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (id: number | string) => `/categories/${id}`,
  CATEGORY_PRODUCTS: (slug: string) => `/categories/${slug}/products`,

  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',

  // Cart (nếu backend hỗ trợ)
  CART: '/cart',
  CART_ITEM: (id: number | string) => `/cart/${id}`,

  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: (id: number | string) => `/orders/${id}`,
} as const;
