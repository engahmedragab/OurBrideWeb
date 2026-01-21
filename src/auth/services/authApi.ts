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
 * Check response for errors and throw if found
 * Handles cases where API returns 200 status but with errors in body
 */
const DEFAULT_KEYS = {
  loginFailedCredentials: 'api.errors.loginFailedCredentials',
  noTokenReceived: 'api.errors.noTokenReceived',
  externalLoginFailed: 'api.errors.externalLoginFailed',
  guestLoginFailed: 'api.errors.guestLoginFailed',
  noTokenAvailableToRefresh: 'api.errors.noTokenAvailableToRefresh',
  tokenRefreshFailedLoginAgain: 'api.errors.tokenRefreshFailedLoginAgain',
  adminLoginFailedCredentials: 'api.errors.adminLoginFailedCredentials',
  registrationFailedTryAgain: 'api.errors.registrationFailedTryAgain',
  sendOtpFailedTryAgain: 'api.errors.sendOtpFailedTryAgain',
  invalidOtpTryAgain: 'api.errors.invalidOtpTryAgain',
  invalidConfirmationTryAgain: 'api.errors.invalidConfirmationTryAgain',
  unauthorizedCheckCredentials: 'api.errors.unauthorizedCheckCredentials',
  forbiddenNoPermission: 'api.errors.forbiddenNoPermission',
  notFoundTryAgain: 'api.errors.notFoundTryAgain',
  serverErrorTryLater: 'api.errors.serverErrorTryLater',
  validationFailed: 'api.errors.validationFailed',
} as const



// const checkResponseForErrors = (response: { data?: unknown }, defaultMessage: string): void => {
//   const responseData = response.data as Record<string, unknown> | undefined
//   if (responseData) {
//     // Check if response indicates failure
//     if (responseData.success === false || (responseData.errors && Array.isArray(responseData.errors))) {
//       const errors = Array.isArray(responseData.errors) ? responseData.errors : []
//       const errorMessage = errors.length > 0 
//         ? errors.join('\n')
//         : (typeof responseData.message === 'string' ? responseData.message : defaultMessage)
//       throw new Error(errorMessage)
//     }
//   }
// }
const isI18nKey = (val: unknown): val is string =>
  typeof val === 'string' && val.includes('.') && /^[a-zA-Z0-9_.-]+$/.test(val)

const normalizeToKeyIfPossible = (val: string): string => {
  // لو الباك بيرجع "auth.api.errors.xxx" وانتِ بتستخدمي namespace "auth"
  if (val.startsWith('auth.')) return val.replace(/^auth\./, '')
  return val
}

const collectErrorMessages = (data: Record<string, unknown>): string[] => {
  const msgs: string[] = []

  // errors: string[]
  if (Array.isArray(data.errors)) {
    for (const e of data.errors) {
      if (typeof e === 'string' && e.trim()) msgs.push(e.trim())
    }
  }

  // errors: { field: string[] }
  if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    const obj = data.errors as Record<string, unknown>
    for (const k of Object.keys(obj)) {
      const arr = obj[k]
      if (Array.isArray(arr)) {
        for (const item of arr) {
          if (typeof item === 'string' && item.trim()) msgs.push(item.trim())
        }
      }
    }
  }

  if (typeof data.message === 'string' && data.message.trim()) msgs.push(data.message.trim())
  if (typeof data.error === 'string' && data.error.trim()) msgs.push(data.error.trim())

  return msgs
}

const checkResponseForErrors = (
  response: { data?: unknown },
  defaultKey: string
): void => {
  const responseData = response.data as Record<string, unknown> | undefined
  if (!responseData) return

  const hasFailure =
    responseData.success === false ||
    !!responseData.errors

  if (!hasFailure) return

  const rawMessages = collectErrorMessages(responseData)

  // لو الباك بيرجع keys بالفعل، خديها كما هي
  const keysOrMsgs = rawMessages.length
    ? rawMessages.map(m => normalizeToKeyIfPossible(m))
    : [defaultKey]

  // لو ولا واحدة key ومفيش رسائل، رجعي defaultKey
  throw new Error(keysOrMsgs.join('\n') || defaultKey)
}


/**
 * Extract error message from unknown error type
 */
// const getErrorMessage = (error: unknown, defaultMessage: string): string => {
//   if (error && typeof error === 'object') {
//     // Check for Axios error structure
//     if ('response' in error && error.response && typeof error.response === 'object') {
//       const response = error.response as { 
//         status?: number
//         data?: { 
//           message?: string
//           error?: string
//           errors?: string[] | Record<string, string[]>
//           success?: boolean
//         } 
//       }
      
//       if (response.data) {
//         // Handle validation errors (400 status with errors array or object)
//         if (response.status === 400) {
//           // Check for array of error strings
//           if (Array.isArray(response.data.errors) && response.data.errors.length > 0) {
//             return response.data.errors.join('\n')
//           }
//           // Check for object with error messages (e.g., { email: ['Email is required'], password: ['Password is too short'] })
//           if (response.data.errors && typeof response.data.errors === 'object' && !Array.isArray(response.data.errors)) {
//             const errorObj = response.data.errors as Record<string, string[]>
//             const errorMessages: string[] = []
//             for (const key in errorObj) {
//               if (Array.isArray(errorObj[key])) {
//                 errorMessages.push(...errorObj[key])
//               }
//             }
//             if (errorMessages.length > 0) {
//               return errorMessages.join('\n')
//             }
//           }
//         }
        
//         // Fallback to message or error field
//         return response.data.message || response.data.error || defaultMessage
//       }
      
//       // If no data but we have a status, provide a generic message based on status
//       if (response.status) {
//         if (response.status === 401) {
//           return 'Unauthorized. Please check your credentials.'
//         }
//         if (response.status === 403) {
//           return 'Access forbidden. You do not have permission to perform this action.'
//         }
//         if (response.status === 404) {
//           return 'Resource not found. Please try again.'
//         }
//         if (response.status >= 500) {
//           return 'Server error. Please try again later.'
//         }
//       }
//     }
//     // Check for standard Error object
//     if ('message' in error && typeof error.message === 'string') {
//       return error.message
//     }
//   }
//   return defaultMessage
// }
const getErrorMessage = (error: unknown, defaultKey: string): string => {
  // لو Error معمول throw قبل كده (وmessage بتاعه key أو keys مفصولين)
  if (error instanceof Error && error.message) {
    return normalizeToKeyIfPossible(error.message)
  }

  if (error && typeof error === 'object') {
    // Axios-like
    const errorObj = error as Record<string, unknown>
    if ('response' in errorObj && errorObj.response) {
      const response = errorObj.response as {
        status?: number
        data?: {
          message?: string
          error?: string
          errors?: string[] | Record<string, string[]>
          success?: boolean
        }
      }

      const status = response.status
      const data = response.data

      // لو فيه data errors/message نجمعهم
      if (data) {
        // validation 400
        if (status === 400) {
          // لو الباك رجّع list أو object
          const merged: string[] = []

          if (Array.isArray(data.errors) && data.errors.length) merged.push(...data.errors)
          if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
            for (const key in data.errors) merged.push(...(data.errors[key] || []))
          }

          if (merged.length) return merged.map(normalizeToKeyIfPossible).join('\n')

          if (data.message) return normalizeToKeyIfPossible(data.message)
          if (data.error) return normalizeToKeyIfPossible(data.error)

          return DEFAULT_KEYS.validationFailed
        }

        // أي status تاني: لو message موجود
        if (typeof data.message === 'string' && data.message.trim()) {
          return normalizeToKeyIfPossible(data.message)
        }
        if (typeof data.error === 'string' && data.error.trim()) {
          return normalizeToKeyIfPossible(data.error)
        }
      }

      // fallback حسب status → Keys
      if (status === 401) return DEFAULT_KEYS.unauthorizedCheckCredentials
      if (status === 403) return DEFAULT_KEYS.forbiddenNoPermission
      if (status === 404) return DEFAULT_KEYS.notFoundTryAgain
      if (typeof status === 'number' && status >= 500) return DEFAULT_KEYS.serverErrorTryLater
    }
  }

  return defaultKey
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
    
    // Check for errors in response body first (even if HTTP status is 200)
    checkResponseForErrors(response, DEFAULT_KEYS.loginFailedCredentials)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      // If tokens are in cookies, we might need to fetch user info
      // For now, we'll assume the token is in cookies and try to get user
      throw new Error(DEFAULT_KEYS.noTokenReceived)
    }

    // Store tokens
    setToken(authData)

    return authData
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, DEFAULT_KEYS.loginFailedCredentials)
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
    
    // Check for errors in response body first (even if HTTP status is 200)
    checkResponseForErrors(response, DEFAULT_KEYS.loginFailedCredentials)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      throw new Error(DEFAULT_KEYS.noTokenReceived)
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
      throw new Error(DEFAULT_KEYS.noTokenReceived)
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
      throw new Error(DEFAULT_KEYS.noTokenReceived)
    }

    setToken(authData)

    return authData
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, DEFAULT_KEYS.guestLoginFailed)
    throw new Error(errorMessage)
  }
}

/**
 * Refresh access token
 * Uses a separate HTTP client to avoid circular dependency with the interceptor
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const currentToken = getToken()
    const refreshTokenValue = getRefreshToken()

    if (!currentToken || !refreshTokenValue) {
      throw new Error(DEFAULT_KEYS.noTokenAvailableToRefresh)
    }

    const refreshRequest: RefreshTokenRequest = {
      token: currentToken,
      refreshToken: refreshTokenValue,
    }

    // Create a separate HTTP client for refresh to avoid interceptor loops
    // Import dynamically to avoid circular dependency
    const { HttpClient, Api } = await import('@/../client/common/api/gen/ourbride-api')
    
    const getBaseURL = (): string => {
      // During build, use placeholder - actual URL will be used at runtime
      const url = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://preprod.our-bride.com/api/v1'
      let baseURL = url.replace(/\/$/, '')
      baseURL = baseURL.replace(/\/api\/v1$/, '')
      return baseURL
    }

    // Create a fresh HTTP client without interceptors for refresh token call
    const refreshHttpClient = new HttpClient({
      baseURL: getBaseURL(),
      timeout: 30000,
      withCredentials: process.env.NEXT_PUBLIC_API_WITH_CREDENTIALS === 'true',
    })

    const refreshApi = new Api(refreshHttpClient)
    const response = await refreshApi.api.postIdentityRefresh(refreshRequest)
    
    // Check for errors in response body
    checkResponseForErrors(response, DEFAULT_KEYS.tokenRefreshFailedLoginAgain)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      throw new Error(DEFAULT_KEYS.noTokenReceived)
    }

    setToken(authData)

    return authData
  } catch (error: unknown) {
    // If refresh fails, clear tokens
    removeToken()
    
    const errorMessage = getErrorMessage(error, DEFAULT_KEYS.tokenRefreshFailedLoginAgain)
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
    
    // Check for errors in response body first (even if HTTP status is 200)
    checkResponseForErrors(response, DEFAULT_KEYS.adminLoginFailedCredentials)
    
    const authData = extractAuthDataFromResponse(response)
    
    if (!authData) {
      throw new Error(DEFAULT_KEYS.noTokenReceived)
    }

    setToken(authData)

    return authData
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, DEFAULT_KEYS.adminLoginFailedCredentials)
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
    
    // Check for errors in response body first (even if HTTP status is 200)
    checkResponseForErrors(response, DEFAULT_KEYS.registrationFailedTryAgain)
    
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
    const errorMessage = getErrorMessage(error, DEFAULT_KEYS.registrationFailedTryAgain)
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
    
    // Check for errors in response body first (even if HTTP status is 200)
    checkResponseForErrors(response, DEFAULT_KEYS.registrationFailedTryAgain)
    
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
    const errorMessage = getErrorMessage(error, DEFAULT_KEYS.registrationFailedTryAgain)
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
    
    // Check for errors in response body first (even if HTTP status is 200)
    checkResponseForErrors(response, DEFAULT_KEYS.registrationFailedTryAgain)
    
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
    const errorMessage = getErrorMessage(error, DEFAULT_KEYS.registrationFailedTryAgain)
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
    const errorMessage = getErrorMessage(error, DEFAULT_KEYS.sendOtpFailedTryAgain)
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
    const errorMessage = getErrorMessage(error, DEFAULT_KEYS.invalidOtpTryAgain)
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
    const errorMessage = getErrorMessage(error, DEFAULT_KEYS.invalidConfirmationTryAgain)
    throw new Error(errorMessage)
  }
}
