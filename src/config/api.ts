// API Configuration
export const API_CONFIG = {
  // Base URL for all API calls
  BASE_URL: 'http://localhost:5001/api/v1',

  // Request timeout in milliseconds
  TIMEOUT: 30000, // 30 seconds

  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },

  // API Endpoints
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      REGISTER: '/identity/register',
      LOGIN: '/identity/login',
      LOGOUT: '/identity/logout',
      REFRESH_TOKEN: '/identity/refresh-token',
      LANDING_SIGNIN: '/identity/landing-signin',
    },

    // Provider endpoints
    PROVIDERS: {
      REGISTER: '/services/providers/registration',
      GET_ALL: '/providers',
      GET_BY_ID: '/providers/:id',
      UPDATE: '/providers/:id',
      DELETE: '/providers/:id',
    },

    // User endpoints
    USERS: {
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
      CHANGE_PASSWORD: '/users/change-password',
    },

    // Provider Control endpoints
    PROVIDER_CONTROL: {
      GET_PUBLIC_SETTINGS: '/services/providers/:providerId/public-settings',
      UPDATE_PUBLIC_SETTINGS: '/services/providers/:providerId/public-settings',
    },

    // Preparations endpoints
    PREPARATIONS: {
      GET_ALL: '/services/preparations',
      GET_FEATURED: '/services/preparations/Featured',
      GET_BY_ID: '/services/preparations/:preparationId',
      GET_LAST_SERVICES: '/services/preparations/LastServices',
      GET_SERVICES_BY_PREPARATION: '/services/preparations/:preparationId/services',
      GET_SERVICES_BY_PREPARATION_PAGED: '/services/preparations/:preparationId/services/paged',
      GET_STATISTICS: '/services/preparations/:preparationId/statistics',
      GET_PROVIDER_COUNT: '/services/preparations/:preparationId/providers/count',
    },

    // Services endpoints
    SERVICES: {
      GET_ALL: '/services',
      GET_BY_ID: '/services/:id',
      SEARCH: '/services/search',
      GET_REVIEWS: '/services/:id/reviews',
      GET_REVIEW_SUMMARY: '/services/:id/reviews/summary',
      GET_PACKAGES: '/services/:id/packages',
      COMPARE: '/services/compare',
      GET_MAP: '/services/map',
      GET_BY_CATEGORY: '/services/category/:category',
      GET_BY_PROVIDER: '/services/provider/:providerId',
    },

    // Products endpoints
    PRODUCTS: {
      GET_BY_ID: '/products/:productId',
      GET_BY_SKU: '/products/sku/:sku',
      GET_HEADER: '/products/:productId/header',
      GET_DETAIL: '/products/:id/detail',
    },

    // Invitations endpoints
    INVITATIONS: {
      CREATE: '/invitations',
      GET_BY_USER: '/invitations/user/:userId',
      UPDATE: '/invitations/:id',
      DELETE: '/invitations/:id',
      GET_BY_SLUG: '/invitations/slug/:slug',
    },

    // Items endpoints
    ITEMS: {
      GET_ALL: '/items',
      GET_BY_CATEGORY: '/items/category/:category',
      GET_BY_ID: '/items/:id',
    },

    // Contact endpoints
    CONTACT: {
      CREATE: '/contact',
    },

    // Statistics endpoints
    STATISTICS: {
      GET_OVERVIEW: '/statistics/overview',
      GET_SUMMARY: '/statistics/summary',
      GET_PROVIDERS: '/statistics/providers',
    },

    // Featured Providers endpoints
    FEATURED_PROVIDERS: {
      GET_FEATURED: '/services/providers/featured',
      GET_TOP_RATED: '/services/providers/top-rated',
      GET_POPULAR: '/services/providers/popular',
    },

    // Public Provider endpoints (no authentication required)
    PUBLIC_PROVIDERS: {
      GET_BY_ID: '/services/providers/:providerId/public',
      GET_BY_CODE: '/services/providers/code/:uniqueCode',
      GET_BY_SLUG: '/services/providers/slug/:slug',
      GET_STORE: '/services/providers/:providerId/store',
    },
  },
} as const;

// HTTP Status Codes
export const API_STATUS = {
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
} as const;

// Helper function to get authentication headers
export const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    ...API_CONFIG.DEFAULT_HEADERS,
  };

  // Get token from localStorage or cookies
  const token = localStorage.getItem('_OURBRIDE_AUTH_TOKEN') || 
    (typeof document !== 'undefined' 
      ? document.cookie.split('; ').find(row => row.startsWith('_OURBRIDE_AUTH_TOKEN='))?.split('=')[1]
      : null);

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Helper function to build API URL from endpoint template and params
export const buildApiUrl = (endpoint: string, params: Record<string, any> = {}): string => {
  let url = endpoint;

  // Replace path parameters (e.g., :id, :providerId)
  Object.keys(params).forEach(key => {
    const paramValue = params[key];
    if (paramValue !== undefined && paramValue !== null) {
      url = url.replace(`:${key}`, encodeURIComponent(String(paramValue)));
    }
  });

  // Construct full URL
  const baseUrl = API_CONFIG.BASE_URL.endsWith('/') 
    ? API_CONFIG.BASE_URL.slice(0, -1) 
    : API_CONFIG.BASE_URL;
  
  const path = url.startsWith('/') ? url : `/${url}`;
  
  return `${baseUrl}${path}`;
};

