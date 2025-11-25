// Products Section Base Configuration
// This file contains base configuration constants for the Products section

export const PRODUCTS_CONFIG = {
  // Base routes for products section
  ROUTES: {
    HOME: '/products-home',
    SHOP: '/shop',
    DETAIL: '/products/:id',
    DETAIL_BY_SKU: '/products/sku/:sku',
    CATEGORY: '/products/category/:categoryId',
    SEARCH: '/products/search',
    GIFT_CARDS: '/gift-cards-home',
    MEMBERSHIPS: '/memberships-home',
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
    ],
  },

  // Product status values
  STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DRAFT: 'Draft',
    ARCHIVED: 'Archived',
  },

  // Default product display settings
  DISPLAY: {
    ITEMS_PER_ROW: {
      MOBILE: 1,
      TABLET: 2,
      DESKTOP: 3,
      LARGE_DESKTOP: 4,
    },
    IMAGE_ASPECT_RATIO: '4:3',
    PLACEHOLDER_IMAGE: '/placeholder-product.png',
  },

  // Product categories (can be extended)
  CATEGORIES: {
    ALL: 'all',
    DECORATIONS: 'decorations',
    ACCESSORIES: 'accessories',
    GIFTS: 'gifts',
    MEMBERSHIPS: 'memberships',
    GIFT_CARDS: 'gift-cards',
  },

  // Cache settings
  CACHE: {
    PRODUCT_LIST_TTL: 5 * 60 * 1000, // 5 minutes
    PRODUCT_DETAIL_TTL: 10 * 60 * 1000, // 10 minutes
    CATEGORIES_TTL: 30 * 60 * 1000, // 30 minutes
  },

  // Analytics event names
  ANALYTICS: {
    VIEW_PRODUCT: 'view_product',
    VIEW_PRODUCT_LIST: 'view_product_list',
    ADD_TO_CART: 'add_to_cart',
    REMOVE_FROM_CART: 'remove_from_cart',
    SEARCH_PRODUCTS: 'search_products',
    FILTER_PRODUCTS: 'filter_products',
    VIEW_CATEGORY: 'view_category',
  },
} as const;

// Helper function to build product detail route
export const buildProductDetailRoute = (productId: number | string): string => {
  return `/products/${productId}`;
};

// Helper function to build product category route
export const buildProductCategoryRoute = (categoryId: number | string): string => {
  return `/products/category/${categoryId}`;
};

// Helper function to build product search route
export const buildProductSearchRoute = (query: string): string => {
  return `/products/search?q=${encodeURIComponent(query)}`;
};

// Default product query parameters
export const DEFAULT_PRODUCT_QUERY = {
  page: PRODUCTS_CONFIG.PAGINATION.DEFAULT_PAGE,
  pageSize: PRODUCTS_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
  search: '',
  categoryId: undefined,
  status: PRODUCTS_CONFIG.STATUS.ACTIVE,
  providerId: undefined,
  branchId: undefined,
  staffId: undefined,
};


