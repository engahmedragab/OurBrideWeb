import { Api, HttpClient } from '@/../client/common/api/gen/ourbride-api'
import { getToken } from '@/auth/utils/token'
import { getApiLanguage } from '@/utils/language'

// Get base URL and ensure it doesn't duplicate /api/v1
// Note: The generated API endpoints already include /api/v1 in their paths
// So baseURL should be just the domain (e.g., https://preprod.our-bride.com)
// NOT https://preprod.our-bride.com/api/v1
const getBaseURL = (): string => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || 'https://preprod.our-bride.com'
  // Remove trailing slash if present
  let baseURL = url.replace(/\/$/, '')
  // Remove /api/v1 if it's at the end of the baseURL (since endpoints already include it)
  baseURL = baseURL.replace(/\/api\/v1$/, '')
  return baseURL
}

// Create HTTP client with token interceptor
const httpClient = new HttpClient({
  baseURL: getBaseURL(),
  timeout: 30000, // Increased from 10000ms (10s) to 30000ms (30s)
  // CORS: withCredentials requires server to send specific origin (not wildcard *)
  // Default to false to avoid CORS errors with wildcard CORS servers
  // Set NEXT_PUBLIC_API_WITH_CREDENTIALS=true only if backend sends specific origin
  withCredentials: process.env.NEXT_PUBLIC_API_WITH_CREDENTIALS === 'true',
  securityWorker: async () => {
    const token = getToken()
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    }
    return {}
  },
})

// Add request interceptor to inject token and language
httpClient.instance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add language support: query parameter and Accept-Language header
    const language = getApiLanguage()
    if (config.headers) {
      config.headers['Accept-Language'] = language
    }
    
    // Add lang as query parameter
    if (!config.params) {
      config.params = {}
    }
    config.params.lang = language
    
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor for error handling
httpClient.instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear token and redirect to login
      const { removeToken } = await import('@/auth/utils/token')
      removeToken()
      
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// Create API instance
export const apiClient = new Api(httpClient)

export default apiClient

