// Token management utilities

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user_data'

export interface TokenData {
  accessToken: string
  refreshToken?: string
  expiresAt?: string
  user?: any
}

/**
 * Get the access token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Get the refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * Get user data from localStorage
 */
export const getUser = (): any | null => {
  if (typeof window === 'undefined') return null
  const userData = localStorage.getItem(USER_KEY)
  return userData ? JSON.parse(userData) : null
}

/**
 * Check if user has initialized planning preferences
 */
// This function is now updated on login from the backend
export const isPreferenceInit = (): boolean => {
  const user = getUser()
  return user?.isPreferenceInit === true
}

// Utility to set isPreferenceInit state in user object
export const setPreferenceInit = (value: boolean) => {
  const user = getUser()
  if (!user) return
  user.isPreferenceInit = value
  localStorage.setItem('user_data', JSON.stringify(user))
}

/**
 * Set a cookie (client-side)
 */
const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

/**
 * Remove a cookie (client-side)
 */
const removeCookie = (name: string): void => {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

/**
 * Set tokens and user data in localStorage and cookies
 */
export const setToken = (tokenData: TokenData): void => {
  if (typeof window === 'undefined') return
  
  if (tokenData.accessToken) {
    localStorage.setItem(TOKEN_KEY, tokenData.accessToken)
    // Also set in cookie for middleware access
    setCookie(TOKEN_KEY, tokenData.accessToken, 30)
  }
  
  if (tokenData.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refreshToken)
    // Also set in cookie for middleware access
    setCookie(REFRESH_TOKEN_KEY, tokenData.refreshToken, 30)
  }
  
  if (tokenData.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(tokenData.user))
    // Also set in cookie for middleware access
    setCookie(USER_KEY, JSON.stringify(tokenData.user), 30)
  }
  
  if (tokenData.expiresAt) {
    localStorage.setItem('token_expires_at', tokenData.expiresAt)
    // Also set in cookie for middleware access
    setCookie('token_expires_at', tokenData.expiresAt, 30)
  }
}

/**
 * Remove all tokens and user data from localStorage and cookies
 */
export const removeToken = (): void => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem('token_expires_at')
  
  // Also remove from cookies
  removeCookie(TOKEN_KEY)
  removeCookie(REFRESH_TOKEN_KEY)
  removeCookie(USER_KEY)
  removeCookie('token_expires_at')
}

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  if (typeof window === 'undefined') return true
  
  const expiresAt = localStorage.getItem('token_expires_at')
  if (!expiresAt) return true
  
  const expirationTime = new Date(expiresAt).getTime()
  const currentTime = new Date().getTime()
  
  // Check if token expires in less than 5 minutes (refresh buffer)
  return expirationTime - currentTime < 5 * 60 * 1000
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getToken()
  if (!token) return false
  
  // If we have expiration info, check it
  if (isTokenExpired()) {
    // Token is expired, but we might have a refresh token
    return !!getRefreshToken()
  }
  
  return true
}
