import { Api, HttpClient } from '@/../client/common/api/gen/ourbride-api'
import { getToken } from '@/auth/utils/token'
import { getApiLanguage } from '@/utils/language'

// Get base URL and ensure it doesn't duplicate /api/v1
// Note: The generated API endpoints already include /api/v1 in their paths
// So baseURL should be just the domain (e.g., http://localhost:5001)
// NOT http://localhost:5001/api/v1
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

// Track if we're currently refreshing the token to avoid infinite loops
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

// Process the queue of failed requests after token refresh
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Add response interceptor for error handling and automatic token refresh
httpClient.instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet, and we have a request config
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return httpClient.instance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Try to refresh the token
        const { getRefreshToken } = await import('@/auth/utils/token')
        const refreshTokenValue = getRefreshToken()

        if (!refreshTokenValue) {
          // No refresh token available, logout
          const { removeToken } = await import('@/auth/utils/token')
          removeToken()
          processQueue(new Error('No refresh token available'), null)
          
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login'
          }
          return Promise.reject(error)
        }

        // Import refresh token function
        const { refreshToken } = await import('@/auth/services/authApi')
        
        // Refresh the token
        const authData = await refreshToken()
        const newToken = authData.accessToken

        // Update the original request with new token
        if (originalRequest.headers && newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        // Process queued requests
        processQueue(null, newToken)

        // Retry the original request
        return httpClient.instance(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null)
        const { removeToken } = await import('@/auth/utils/token')
        removeToken()
        
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// Create API instance
export const apiClient = new Api(httpClient)

export default apiClient

