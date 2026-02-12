import axios from 'axios'
import { getPlatformHeaders } from '@/utils/platformHeaders'
import { getApiBaseURL } from '@/services/api/apiClient'
import { getToken, getRefreshToken } from '@/auth/utils/token'

const apiClient = axios.create({
  // During build, use placeholder - actual URL will be used at runtime
  baseURL: getApiBaseURL(),
  timeout: 30000, // Increased from 10000ms (10s) to 30000ms (30s)
  headers: {
    'Content-Type': 'application/json',
  },
})

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

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const platformHeaders = getPlatformHeaders()
    Object.entries(platformHeaders).forEach(([key, value]) => {
      if (value) {
        config.headers[key] = value
      }
    })
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor with token refresh logic
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Check if we have a token or refresh token before attempting refresh
      const currentToken = getToken()
      const refreshTokenValue = getRefreshToken()
      
      // If there's no token and no refresh token, just reject (might be a public page)
      if (!currentToken && !refreshTokenValue) {
        return Promise.reject(error)
      }

      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Try to refresh the token
        if (!refreshTokenValue) {
          // No refresh token available, clear tokens but don't redirect
          // Let the calling code or auth context handle the logout
          const { removeToken } = await import('@/auth/utils/token')
          removeToken()
          processQueue(new Error('No refresh token available'), null)
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
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear tokens but don't redirect
        // Let the auth context handle the logout
        processQueue(refreshError, null)
        const { removeToken } = await import('@/auth/utils/token')
        removeToken()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
