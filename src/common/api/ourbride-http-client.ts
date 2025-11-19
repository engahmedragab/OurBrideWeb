// HTTP Client utilities for OurBride API
// This file provides utilities for making API requests

import { Api, HttpClient } from './gen/ourbride-api';
import { API_CONFIG } from '@/config/api';

// Request utilities for managing authentication tokens
export const RequestUtils = {
  updateAuthToken: (token: string | null) => {
    // Update token in any HTTP client configuration
    if (typeof window !== 'undefined' && token) {
      // Token is managed via localStorage/cookies in useAuth hook
      // This is a placeholder for any additional token management
    }
  },
  clearAuthToken: () => {
    // Clear token from HTTP client configuration
    if (typeof window !== 'undefined') {
      // Token clearing is handled in useAuth hook
      // This is a placeholder for any additional token management
    }
  },
};

// Create HTTP client instance with base URL configuration
const httpClient = new HttpClient({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Create API instance
const apiInstance = new Api(httpClient);

// Export the API instance for use across the application
export const OurbrideApi = apiInstance;

export const OurbrideApiCached = OurbrideApi;
export const OurbrideApiNoCache = OurbrideApi;

// Default export - HTTP Client wrapper
const OurbrideHttpClient = {
  updateAuthToken: RequestUtils.updateAuthToken,
  clearAuthToken: RequestUtils.clearAuthToken,
};

export default OurbrideHttpClient;

