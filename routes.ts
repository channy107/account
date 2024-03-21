export const apiAuthPrefix = "/api/auth";

export const ADMIN_BASE = "/admin";

export const ADMIN_ROUTES = {
  COMMON: `${ADMIN_BASE}/common`,
  STORE: `${ADMIN_BASE}/store`,
};

export const ADMIN_COMMON_ROUTES = {
  USER: `${ADMIN_ROUTES.COMMON}/user`,
};

export const ADMIN_STORE_ROUTES = {
  PRODUCT: `${ADMIN_ROUTES.STORE}/product`,
  ADD_PRODUCT: `${ADMIN_ROUTES.STORE}/product/new`,
  BANNER: `${ADMIN_ROUTES.STORE}/banner`,
  ADD_BANNER: `${ADMIN_ROUTES.STORE}/banner/new`,
  COLOR: `${ADMIN_ROUTES.STORE}/color`,
  ADD_COLOR: `${ADMIN_ROUTES.STORE}/color/new`,
  SIZE: `${ADMIN_ROUTES.STORE}/size`,
  ADD_SIZE: `${ADMIN_ROUTES.STORE}/size/new`,
  CATEGORY: `${ADMIN_ROUTES.STORE}/category`,
  ADD_CATEGORY: `${ADMIN_ROUTES.STORE}/category/new`,
  BRAND: `${ADMIN_ROUTES.STORE}/brand`,
  ADD_BRAND: `${ADMIN_ROUTES.STORE}/brand/new`,
};

export const authRoutes = [
  "/login",
  "/register",
  "/new-verification",
  "/reset",
  "/new-password",
];

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
