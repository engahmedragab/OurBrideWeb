/**
 * Route Constants
 * 
 * Centralized route path definitions.
 */

export const ROUTES = {
  // Core routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  EXPLORE: '/explore',
  DOWNLOAD_APP: '/download-app',
  PRIVACY: '/privacy',
  TERMS: '/terms',

  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  DELETE_ACCOUNT: '/delete-account',

  // Marketplace routes
  SERVICES_HOME: '/services-home',
  PRODUCTS_HOME: '/products-home',
  GIFT_CARDS_HOME: '/gift-cards-home',
  MEMBERSHIPS_HOME: '/memberships-home',
  SERVICES: '/services',
  SERVICE_DETAILS: (id: number | string) => `/services/${id}`,
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id: number | string) => `/products/${id}`,
  PROVIDERS: '/providers',
  PROVIDER_PROFILE: (id: number | string) => `/providers/${id}`,

  // Planner routes
  PLANNER: '/planner',
  PLANNER_CHECKLIST: '/planner/checklist',
  PLANNER_BUDGET: '/planner/budget',
  PLANNER_GUEST_LIST: '/planner/guest-list',
  PLANNER_TIMELINE: '/planner/timeline',
  PLANNER_CALENDAR: '/planner/calendar',
  PLANNER_FAVORITES: '/planner/favorites',

  // Order routes
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CREATE: '/order/create',
  ORDER_SUCCESS: '/order/success',
  MY_ORDERS: '/my-orders',
  ORDER_DETAILS: (id: number | string) => `/order/${id}`,

  // Invitation routes
  INVITATIONS: '/invitations',
  INVITATION_CREATE: '/invitations/create',
  INVITATION_EDIT: (id: number | string) => `/invitations/${id}/edit`,
  INVITATION_PREVIEW: (id: number | string) => `/invitations/${id}/preview`,

  // User routes
  USER_PROFILE: '/user/profile',
  USER_SETTINGS: '/user/settings',
} as const;

