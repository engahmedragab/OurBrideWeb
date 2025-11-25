// Services Section Base Configuration
// This file contains base configuration constants for the Services section

export const SERVICES_CONFIG = {
  // Base routes for services section
  ROUTES: {
    HOME: '/services-home',
    ALL: '/services',
    DETAIL: '/services/:id',
    CATEGORIES: '/services/categories',
    CATEGORY: '/services/category/:categoryId',
    PREPARATION: '/preparations/:preparationId',
    PREPARATION_DETAIL: '/preparations/:preparationId/detail',
    PROVIDER: '/providers/:providerId',
    PROVIDER_SERVICES: '/providers/:providerId/services',
    SEARCH: '/services/search',
    COMPARE: '/services/compare',
    MAP: '/services/map',
    OFFERS: '/offers',
  },

  // Default pagination settings
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 12,
    PAGE_SIZE_OPTIONS: [12, 24, 48, 96],
  },

  // Default filters
  FILTERS: {
    DEFAULT_SORT_BY: 'createdDate',
    DEFAULT_SORT_ORDER: 'desc' as 'asc' | 'desc',
    SORT_OPTIONS: [
      { value: 'createdDate', label: 'Newest First' },
      { value: 'price', label: 'Price: Low to High' },
      { value: '-price', label: 'Price: High to Low' },
      { value: 'name', label: 'Name: A to Z' },
      { value: 'rating', label: 'Highest Rated' },
      { value: 'popularity', label: 'Most Popular' },
      { value: 'distance', label: 'Nearest First' },
    ],
    DEFAULT_MIN_PRICE: 0,
    DEFAULT_MAX_PRICE: undefined,
    DEFAULT_MIN_RATING: 0,
  },

  // Service status values
  STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DRAFT: 'Draft',
    ARCHIVED: 'Archived',
    SUSPENDED: 'Suspended',
  },

  // Service types
  SERVICE_TYPES: {
    STANDARD: 'Standard',
    PACKAGE: 'Package',
    CUSTOM: 'Custom',
  },

  // Service classes
  SERVICE_CLASSES: {
    BASIC: 1,
    STANDARD: 2,
    PREMIUM: 3,
    LUXURY: 4,
  },

  // Default service display settings
  DISPLAY: {
    ITEMS_PER_ROW: {
      MOBILE: 1,
      TABLET: 2,
      DESKTOP: 3,
      LARGE_DESKTOP: 4,
    },
    IMAGE_ASPECT_RATIO: '16:9',
    PLACEHOLDER_IMAGE: '/placeholder-service.png',
    SHOW_MAP_DEFAULT: false,
    MAP_ZOOM_LEVEL: 12,
  },

  // Review settings
  REVIEWS: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    SORT_OPTIONS: [
      { value: 'newest', label: 'Newest First' },
      { value: 'oldest', label: 'Oldest First' },
      { value: 'highest', label: 'Highest Rated' },
      { value: 'lowest', label: 'Lowest Rated' },
    ],
    MIN_RATING: 1,
    MAX_RATING: 5,
  },

  // Cache settings
  CACHE: {
    SERVICE_LIST_TTL: 5 * 60 * 1000, // 5 minutes
    SERVICE_DETAIL_TTL: 10 * 60 * 1000, // 10 minutes
    CATEGORIES_TTL: 30 * 60 * 1000, // 30 minutes
    PREPARATIONS_TTL: 30 * 60 * 1000, // 30 minutes
    PROVIDERS_TTL: 15 * 60 * 1000, // 15 minutes
  },

  // Analytics event names
  ANALYTICS: {
    VIEW_SERVICE: 'view_service',
    VIEW_SERVICE_LIST: 'view_service_list',
    ADD_TO_WISHLIST: 'add_to_wishlist',
    ADD_TO_FAVORITES: 'add_to_favorites',
    SEARCH_SERVICES: 'search_services',
    FILTER_SERVICES: 'filter_services',
    VIEW_CATEGORY: 'view_category',
    VIEW_PREPARATION: 'view_preparation',
    VIEW_PROVIDER: 'view_provider',
    ADD_REVIEW: 'add_review',
    COMPARE_SERVICES: 'compare_services',
    VIEW_MAP: 'view_map',
  },
} as const;

// Helper function to build service detail route
export const buildServiceDetailRoute = (serviceId: number | string): string => {
  return `/services/${serviceId}`;
};

// Helper function to build service category route
export const buildServiceCategoryRoute = (categoryId: number | string): string => {
  return `/services/category/${categoryId}`;
};

// Helper function to build preparation route
export const buildPreparationRoute = (preparationId: number | string): string => {
  return `/preparations/${preparationId}`;
};

// Helper function to build provider route
export const buildProviderRoute = (providerId: number | string): string => {
  return `/providers/${providerId}`;
};

// Helper function to build service search route
export const buildServiceSearchRoute = (query: string): string => {
  return `/services/search?q=${encodeURIComponent(query)}`;
};

// Default service query parameters
export const DEFAULT_SERVICE_QUERY = {
  Page: SERVICES_CONFIG.PAGINATION.DEFAULT_PAGE,
  PageSize: SERVICES_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
  Search: '',
  ServiceClass: undefined,
  ServiceType: undefined,
  MinPrice: SERVICES_CONFIG.FILTERS.DEFAULT_MIN_PRICE,
  MaxPrice: SERVICES_CONFIG.FILTERS.DEFAULT_MAX_PRICE,
  MinRating: SERVICES_CONFIG.FILTERS.DEFAULT_MIN_RATING,
  IsOurBrideService: undefined,
  HasPackages: undefined,
  HasInstallment: undefined,
  sortBy: SERVICES_CONFIG.FILTERS.DEFAULT_SORT_BY,
  sortOrder: SERVICES_CONFIG.FILTERS.DEFAULT_SORT_ORDER,
};


