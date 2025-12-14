// Auth API service functions

import { apiClient } from '@/services/api/apiClient'
import { UserType } from '@/../client/common/api/gen/ourbride-api'
import type {
  UserLoginRequest,
  UserLoginPhoneRequest,
  UserExternalLoginRequest,
  GuestLoginRequest,
  RefreshTokenRequest,
  UserFullRegistrationRequest,
  UserRegistrationRequest,
  UserRegistrationPhoneRequest,
  PhoneVarifyRequest,
  PhoneConfirmationRequest,
  SendPhoneVarifyRequest,
} from '@/../client/common/api/gen/ourbride-api'
import type { 
  AuthResponse, 
  AuthUser,
  LoginCredentials, 
  ExternalLoginCredentials, 
  GuestLoginCredentials,
  SignupCredentials,
  SignupEmailCredentials,
  SignupPhoneCredentials,
  VerifyPhoneCredentials,
  SendPhoneOTPCredentials,
} from '../types'
import { setToken, getToken, getRefreshToken, removeToken } from '../utils/token'

/**
 * Extract error message from unknown error type
 */
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === 'object') {
    // Check for Axios error structure
    if ('response' in error && error.response && typeof error.response === 'object') {
      const response = error.response as { data?: { message?: string; error?: string } }
      if (response.data) {
        return response.data.message || response.data.error || defaultMessage
      }
    }
    // Check for standard Error object
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
  }
  return defaultMessage
}

/**
 * Extract token and user data from response headers, cookies, or body
 * The backend may set tokens in cookies, headers, or response body
 */
const extractAuthDataFromResponse = (response: {
  headers?: Record<string, unknown> | { [key: string]: unknown }
  data?: unknown
}): AuthResponse | null => {
  // Check response headers for tokens (case-insensitive)
  const headers = (response.headers || {}) as Record<string, string | undefined>
  const data = response.data as Record<string, unknown> | undefined
  
  const accessToken = 
    (typeof headers['authorization'] === 'string' ? headers['authorization'].replace(/^Bearer\s+/i, '') : undefined) ||
    (typeof headers['Authorization'] === 'string' ? headers['Authorization'].replace(/^Bearer\s+/i, '') : undefined) ||
    (typeof headers['x-access-token'] === 'string' ? headers['x-access-token'] : undefined) ||
    (typeof headers['X-Access-Token'] === 'string' ? headers['X-Access-Token'] : undefined) ||
    (data && typeof data.accessToken === 'string' ? data.accessToken : undefined) ||
    (data && typeof data.token === 'string' ? data.token : undefined) ||
    (data && typeof data.data === 'object' && data.data !== null && 
     typeof (data.data as Record<string, unknown>).accessToken === 'string' 
     ? (data.data as Record<string, unknown>).accessToken as string : undefined) ||
    (data && typeof data.data === 'object' && data.data !== null && 
     typeof (data.data as Record<string, unknown>).token === 'string' 
     ? (data.data as Record<string, unknown>).token as string : undefined)

  const refreshToken = 
    (typeof headers['x-refresh-token'] === 'string' ? headers['x-refresh-token'] : undefined) ||
    (typeof headers['X-Refresh-Token'] === 'string' ? headers['X-Refresh-Token'] : undefined) ||
    (data && typeof data.refreshToken === 'string' ? data.refreshToken : undefined) ||
    (data && typeof data.data === 'object' && data.data !== null && 
     typeof (data.data as Record<string, unknown>).refreshToken === 'string' 
     ? (data.data as Record<string, unknown>).refreshToken as string : undefined)

  const expiresAt = 
    (typeof headers['x-token-expires'] === 'string' ? headers['x-token-expires'] : undefined) ||
    (typeof headers['X-Token-Expires'] === 'string' ? headers['X-Token-Expires'] : undefined) ||
    (data && typeof data.expiresAt === 'string' ? data.expiresAt : undefined) ||
    (data && typeof data.data === 'object' && data.data !== null && 
     typeof (data.data as Record<string, unknown>).expiresAt === 'string' 
     ? (data.data as Record<string, unknown>).expiresAt as string : undefined)

  // Extract user data from various possible locations
  const user = 
    (data && data.user ? data.user as AuthUser : undefined) ||
    (data && typeof data.data === 'object' && data.data !== null && (data.data as Record<string, unknown>).user 
     ? (data.data as Record<string, unknown>).user as AuthUser : undefined) ||
    (data && typeof data.data === 'object' && data.data !== null 
     ? data.data as AuthUser : undefined) ||
    (data ? data as AuthUser : undefined)

  // If we have an access token, return auth data
  if (accessToken) {
    return {
      accessToken,
      refreshToken: refreshToken || undefined,
      expiresAt: expiresAt || undefined,
      user: user,
    }
  }

  // If no token in response but cookies might be set (handled by browser),
  // we'll need to check if we can get user info from a separate endpoint
  // For now, return null to indicate no token was found
  return null
}

/**
 * Login with email and password
 */
export const loginWithEmail = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const loginRequest: UserLoginRequest = {
      email: credentials.email || null,
      password: credentials.password || null,
      isRestoreDeletedUser: credentials.isRestoreDeletedUser || null,
    }

    const response = await apiClient.api.postIdentityLogin(loginRequest)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      // If tokens are in cookies, we might need to fetch user info
      // For now, we'll assume the token is in cookies and try to get user
      throw new Error('No token received from server')
    }

    // Store tokens
    setToken(authData)

    return authData
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Login failed. Please check your credentials.')
    throw new Error(errorMessage)
  }
}

/**
 * Login with phone number and password
 */
export const loginWithPhone = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const loginRequest: UserLoginPhoneRequest = {
      phoneNumber: credentials.phoneNumber || null,
      password: credentials.password || null,
      isRestoreDeletedUser: credentials.isRestoreDeletedUser || null,
    }

    const response = await apiClient.api.postIdentityLoginPhone(loginRequest)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      throw new Error('No token received from server')
    }

    setToken(authData)

    return authData
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Login failed. Please check your credentials.')
    throw new Error(errorMessage)
  }
}

/**
 * Login with external provider (Google, Facebook, Apple)
 */
export const loginWithExternalProvider = async (
  credentials: ExternalLoginCredentials
): Promise<AuthResponse> => {
  try {
    const loginRequest: UserExternalLoginRequest = {
      accessToken: credentials.accessToken,
      externalProvidersType: credentials.provider,
      userType: credentials.userType,
      referralCode: credentials.referralCode || null,
    }

    const response = await apiClient.api.postIdentityExternalLogin(loginRequest)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      throw new Error('No token received from server')
    }

    setToken(authData)

    return authData
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'External login failed. Please try again.')
    throw new Error(errorMessage)
  }
}

/**
 * Guest login
 */
export const guestLogin = async (
  credentials: GuestLoginCredentials
): Promise<AuthResponse> => {
  try {
    const loginRequest: GuestLoginRequest = {
      deviceId: credentials.deviceId,
      deviceName: credentials.deviceName || null,
      model: credentials.model || null,
      operatingSystem: credentials.operatingSystem || null,
      isPhysicalDevice: credentials.isPhysicalDevice,
      appName: credentials.appName || null,
      packageName: credentials.packageName || null,
      version: credentials.version || null,
      buildNumber: credentials.buildNumber || null,
      userAgent: credentials.userAgent || null,
      browserName: credentials.browserName || null,
      browserVersion: credentials.browserVersion || null,
      platform: credentials.platform || null,
      language: credentials.language || null,
      timeZone: credentials.timeZone || null,
      screenResolution: credentials.screenResolution || null,
      colorDepth: credentials.colorDepth || null,
      cookiesEnabled: credentials.cookiesEnabled,
      javaScriptEnabled: credentials.javaScriptEnabled,
      latitude: credentials.latitude || null,
      longitude: credentials.longitude || null,
      country: credentials.country || null,
      city: credentials.city || null,
      region: credentials.region || null,
    }

    const response = await apiClient.api.postIdentityGuestLogin(loginRequest)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      throw new Error('No token received from server')
    }

    setToken(authData)

    return authData
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Guest login failed. Please try again.')
    throw new Error(errorMessage)
  }
}

/**
 * Refresh access token
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const currentToken = getToken()
    const refreshTokenValue = getRefreshToken()

    if (!currentToken || !refreshTokenValue) {
      throw new Error('No token available to refresh')
    }

    const refreshRequest: RefreshTokenRequest = {
      token: currentToken,
      refreshToken: refreshTokenValue,
    }

    const response = await apiClient.api.postIdentityRefresh(refreshRequest)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      throw new Error('No token received from server')
    }

    setToken(authData)

    return authData
  } catch (error: unknown) {
    // If refresh fails, clear tokens
    removeToken()
    
    const errorMessage = getErrorMessage(error, 'Token refresh failed. Please login again.')
    throw new Error(errorMessage)
  }
}

/**
 * Logout (clear tokens)
 */
export const logout = async (): Promise<void> => {
  try {
    // Optionally call a logout endpoint if available
    // await apiClient.api.postIdentityLogout()
    
    // Clear local tokens
    removeToken()
  } catch {
    // Even if API call fails, clear local tokens
    removeToken()
  }
}

/**
 * Admin login
 */
export const adminLogin = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const loginRequest: UserLoginRequest = {
      email: credentials.email || null,
      password: credentials.password || null,
      isRestoreDeletedUser: credentials.isRestoreDeletedUser || null,
    }

    const response = await apiClient.api.postIdentityLoginAdmin(loginRequest)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      throw new Error('No token received from server')
    }

    setToken(authData)

    return authData
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Admin login failed. Please check your credentials.')
    throw new Error(errorMessage)
  }
}

/**
 * Full registration with all user details
 */
export const signupFull = async (
  credentials: SignupCredentials
): Promise<AuthResponse> => {
  try {
    const signupRequest: UserFullRegistrationRequest = {
      fullName: credentials.fullName,
      gender: credentials.gender,
      type: credentials.userType || UserType.Bride,
      email: credentials.email,
      mobileNumber: credentials.mobileNumber,
      password: credentials.password,
      referralCode: credentials.referralCode || null,
      guestUserId: credentials.guestUserId || null,
    }

    const response = await apiClient.api.postIdentityFullRegister(signupRequest)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      // Registration might not return tokens immediately if email/phone verification is required
      // In that case, return a success response without tokens
      return {
        accessToken: '',
        user: {
          id: '',
          email: credentials.email,
          phoneNumber: credentials.mobileNumber,
          fullName: credentials.fullName,
        } as AuthUser,
      }
    }

    // If tokens are returned, store them
    if (authData.accessToken) {
      setToken(authData)
    }

    return authData
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Registration failed. Please try again.')
    throw new Error(errorMessage)
  }
}

/**
 * Registration with email only
 */
export const signupWithEmail = async (
  credentials: SignupEmailCredentials
): Promise<AuthResponse> => {
  try {
    const signupRequest: UserRegistrationRequest = {
      email: credentials.email,
      password: credentials.password || null,
      type: credentials.userType || undefined,
      referralCode: credentials.referralCode || null,
      guestUserId: credentials.guestUserId || null,
    }

    const response = await apiClient.api.postIdentityRegister(signupRequest)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      // Registration might not return tokens immediately if email verification is required
      return {
        accessToken: '',
        user: {
          id: '',
          email: credentials.email,
        },
      }
    }

    if (authData.accessToken) {
      setToken(authData)
    }

    return authData
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Registration failed. Please try again.')
    throw new Error(errorMessage)
  }
}

/**
 * Registration with phone number only
 */
export const signupWithPhone = async (
  credentials: SignupPhoneCredentials
): Promise<AuthResponse> => {
  try {
    const signupRequest: UserRegistrationPhoneRequest = {
      phoneNumber: credentials.phoneNumber,
      countryCode: credentials.countryCode || undefined,
      password: credentials.password || null,
      type: credentials.userType || undefined,
      referralCode: credentials.referralCode || null,
      guestUserId: credentials.guestUserId || null,
    }

    const response = await apiClient.api.postIdentityPhoneRegister(signupRequest)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      // Registration might not return tokens immediately if phone verification is required
      return {
        accessToken: '',
        user: {
          id: '',
          phoneNumber: credentials.phoneNumber,
        },
      }
    }

    if (authData.accessToken) {
      setToken(authData)
    }

    return authData
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Registration failed. Please try again.')
    throw new Error(errorMessage)
  }
}

/**
 * Send OTP code to phone number
 */
export const sendPhoneOTP = async (
  credentials: SendPhoneOTPCredentials
): Promise<void> => {
  try {
    const request: SendPhoneVarifyRequest = {
      phone: credentials.phoneNumber || null,
      countryCode: credentials.countryCode || undefined,
    }

    await apiClient.api.postIdentitySendCode(request)
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Failed to send OTP. Please try again.')
    throw new Error(errorMessage)
  }
}

/**
 * Verify phone number with OTP code
 */
export const verifyPhoneOTP = async (
  credentials: VerifyPhoneCredentials
): Promise<AuthResponse> => {
  try {
    const request: PhoneVarifyRequest = {
      phone: credentials.phoneNumber || null,
      countryCode: credentials.countryCode || undefined,
      code: credentials.code,
    }

    const response = await apiClient.api.postIdentityPhoneVarify(request)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (authData && authData.accessToken) {
      setToken(authData)
      return authData
    }

    // If no token in response, verification might be successful but login required
    // Return success response without token
    return {
      accessToken: '',
      user: {
        id: '',
        phoneNumber: credentials.phoneNumber,
      } as AuthUser,
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Invalid OTP code. Please try again.')
    throw new Error(errorMessage)
  }
}

/**
 * Confirm phone number (alternative verification method)
 */
export const confirmPhone = async (
  credentials: VerifyPhoneCredentials
): Promise<AuthResponse> => {
  try {
    const request: PhoneConfirmationRequest = {
      phone: credentials.phoneNumber || null,
      countryCode: credentials.countryCode || undefined,
      code: credentials.code,
    }

    const response = await apiClient.api.postIdentityConfarmPhone(request)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (authData && authData.accessToken) {
      setToken(authData)
      return authData
    }

    return {
      accessToken: '',
      user: {
        id: '',
        phoneNumber: credentials.phoneNumber,
      } as AuthUser,
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Invalid confirmation code. Please try again.')
    throw new Error(errorMessage)
  }
}
