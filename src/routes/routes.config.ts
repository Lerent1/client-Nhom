export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const getProductDetailRoute = (id: string | number) => `/products/${id}`;
