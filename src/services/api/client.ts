import axios from 'axios'
import { getPlatformHeaders } from '@/utils/platformHeaders'
import { getApiBaseURL } from '@/services/api/apiClient'

const apiClient = axios.create({
  // During build, use placeholder - actual URL will be used at runtime
  baseURL: getApiBaseURL(),
  timeout: 30000, // Increased from 10000ms (10s) to 30000ms (30s)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
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

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
