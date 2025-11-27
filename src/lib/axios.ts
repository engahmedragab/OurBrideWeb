/**
 * Axios Configuration
 * 
 * Configured Axios instance with interceptors for the application.
 * 
 * @example
 * ```tsx
 * import { apiClient } from '@/lib/axios';
 * 
 * const response = await apiClient.get('/endpoint');
 * ```
 */

import axios from 'axios';
import { CONFIG } from '@/constants';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: `${CONFIG.API_BASE_URL}/${CONFIG.API_VERSION}`,
  timeout: CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add auth token if available
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // TODO: Handle common errors (401, 403, 500, etc.)
    // if (error.response?.status === 401) {
    //   // Handle unauthorized
    // }
    return Promise.reject(error);
  }
);

export default apiClient;

