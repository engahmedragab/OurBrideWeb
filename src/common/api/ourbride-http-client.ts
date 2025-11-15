// HTTP Client utilities for OurBride API
// This file provides utilities for making API requests

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

// Placeholder for OurbrideApi - should be replaced with actual generated API client
// For now, export a minimal stub to prevent import errors
export const OurbrideApi = {
  api: {} as any,
} as any;

export const OurbrideApiCached = OurbrideApi;
export const OurbrideApiNoCache = OurbrideApi;

// Default export - HTTP Client wrapper
const OurbrideHttpClient = {
  updateAuthToken: RequestUtils.updateAuthToken,
  clearAuthToken: RequestUtils.clearAuthToken,
};

export default OurbrideHttpClient;

