/**
 * Application Configuration Constants
 * 
 * Centralized configuration values.
 */

export const CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  API_VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  API_TIMEOUT: 30000, // 30 seconds

  // Application Info
  APP_NAME: import.meta.env.VITE_APP_NAME || 'OurBride',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_URL: import.meta.env.VITE_APP_URL || '',

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',

  // Subdomains
  COMMUNITY_SUBDOMAIN: import.meta.env.VITE_COMMUNITY_SUBDOMAIN || 'community',
  GUIDER_SUBDOMAIN: import.meta.env.VITE_GUIDER_SUBDOMAIN || 'guider',
} as const;

