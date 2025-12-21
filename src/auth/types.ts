// Auth types and interfaces

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
  ExternalProvidersType,
  UserType,
  Gender,
} from '@/../client/common/api/gen/ourbride-api'

export interface AuthUser {
  id: string
  email?: string
  phoneNumber?: string
  fullName?: string
  userType?: UserType
  isPreferenceInit?: boolean
  [key: string]: unknown
}

export interface LoginCredentials {
  email?: string
  phoneNumber?: string
  password: string
  isRestoreDeletedUser?: boolean
}

export interface ExternalLoginCredentials {
  accessToken: string
  provider: ExternalProvidersType
  userType?: UserType
  referralCode?: string
}

export interface GuestLoginCredentials {
  deviceId: string
  deviceName?: string
  model?: string
  operatingSystem?: string
  isPhysicalDevice?: boolean
  appName?: string
  packageName?: string
  version?: string
  buildNumber?: string
  userAgent?: string
  browserName?: string
  browserVersion?: string
  platform?: string
  language?: string
  timeZone?: string
  screenResolution?: string
  colorDepth?: string
  cookiesEnabled?: boolean
  javaScriptEnabled?: boolean
  latitude?: number
  longitude?: number
  country?: string
  city?: string
  region?: string
}

export interface SignupCredentials {
  fullName: string
  gender: Gender
  email: string
  mobileNumber: string
  password: string
  userType?: UserType
  referralCode?: string
  guestUserId?: string
}

export interface SignupEmailCredentials {
  email: string
  password: string
  userType?: UserType
  referralCode?: string
  guestUserId?: string
}

export interface SignupPhoneCredentials {
  phoneNumber: string
  countryCode?: number
  password?: string
  userType?: UserType
  referralCode?: string
  guestUserId?: string
}

export interface VerifyPhoneCredentials {
  phoneNumber: string
  countryCode?: number
  code: number
}

export interface SendPhoneOTPCredentials {
  phoneNumber: string
  countryCode?: number
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  expiresAt?: string
  user?: AuthUser
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'SIGNUP_START' }
  | { type: 'SIGNUP_SUCCESS'; payload: AuthResponse }
  | { type: 'SIGNUP_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'REFRESH_TOKEN'; payload: AuthResponse }

// Re-export API types for convenience
export type {
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
  ExternalProvidersType,
  UserType,
  Gender,
}
