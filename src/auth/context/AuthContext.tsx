'use client'

// Auth context and provider

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type {
  AuthState,
  AuthAction,
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
import * as authApi from '../services/authApi'
import { getToken, getUser, isTokenExpired, getRefreshToken } from '../utils/token'
import { setToken } from '../utils/token'
import { useI18nTranslations } from '@/i18n'

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        user: null,
      }
    case 'SIGNUP_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.payload.user || state.user,
        isAuthenticated: !!action.payload.accessToken,
        isLoading: false,
        error: null,
      }
    case 'SIGNUP_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    case 'REFRESH_TOKEN':
      // Update user data from refreshed token if available
      const refreshPayload = action.payload as AuthResponse
      const refreshedUser = refreshPayload.user ?? state.user ?? null
      return {
        ...state,
        user: refreshedUser, // state.user is AuthUser | null, which is compatible
        isAuthenticated: !!refreshedUser,
        isLoading: false,
      }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  loginWithEmail: (credentials: LoginCredentials) => Promise<void>
  loginWithPhone: (credentials: LoginCredentials) => Promise<void>
  loginWithExternalProvider: (credentials: ExternalLoginCredentials) => Promise<void>
  guestLogin: (credentials: GuestLoginCredentials) => Promise<void>
  signupFull: (credentials: SignupCredentials) => Promise<AuthResponse>
  signupWithEmail: (credentials: SignupEmailCredentials) => Promise<AuthResponse>
  signupWithPhone: (credentials: SignupPhoneCredentials) => Promise<AuthResponse>
  sendPhoneOTP: (credentials: SendPhoneOTPCredentials) => Promise<void>
  verifyPhoneOTP: (credentials: VerifyPhoneCredentials) => Promise<AuthResponse>
  confirmPhone: (credentials: VerifyPhoneCredentials) => Promise<AuthResponse>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
 

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getToken()
        const user = getUser()

        if (token && user) {
          // Check if token is expired
          if (isTokenExpired()) {
            const refreshTokenValue = getRefreshToken()
            if (refreshTokenValue) {
              // Try to refresh token
              try {
                const authData = await authApi.refreshToken()
                // Note: authApi.refreshToken already calls setToken internally
                // Update user from refreshed token response (convert null to undefined for type compatibility)
                const refreshedUser: AuthUser | undefined = authData.user ?? (user ? (user as unknown as AuthUser) : undefined)
                dispatch({ type: 'REFRESH_TOKEN', payload: { ...authData, user: refreshedUser } })
                dispatch({ type: 'SET_LOADING', payload: false })
                return
              } catch {
                // Refresh failed, clear auth
                dispatch({ type: 'LOGOUT' })
                return
              }
            } else {
              // No refresh token, clear auth
              dispatch({ type: 'LOGOUT' })
              return
            }
          }

          dispatch({ type: 'SET_USER', payload: user as unknown as AuthUser })
          dispatch({ type: 'SET_LOADING', payload: false })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

  // Auto-refresh token: schedule a single timeout for expiration minus buffer
  useEffect(() => {
    if (!state.isAuthenticated) return

    // Get the token expiration time (in localStorage)
    const expiresAtStr = typeof window !== 'undefined' ? localStorage.getItem('token_expires_at') : null
    if (!expiresAtStr) return
    const expirationTime = new Date(expiresAtStr).getTime()
    const bufferMs = 5 * 60 * 1000 // 5 min buffer before expire
    const now = Date.now()
    let delay = expirationTime - bufferMs - now

    // If already past the buffer, refresh right away
    if (delay <= 0) delay = 1000

    let timeout: NodeJS.Timeout | number | null = null
    let cancelled = false

    const refreshTask = async () => {
      if (cancelled) return
      const refreshTokenValue = getRefreshToken()
      if (refreshTokenValue) {
        try {
          const authData = await authApi.refreshToken()
          // Note: authApi.refreshToken already calls setToken internally
          const refreshedUser: AuthUser | undefined = authData.user ?? (state.user ? state.user : undefined)
          dispatch({ type: 'REFRESH_TOKEN', payload: { ...authData, user: refreshedUser } })
        } catch {
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'LOGOUT' })
      }
    }

    timeout = setTimeout(refreshTask, delay)
    return () => {
      cancelled = true
      if (timeout) clearTimeout(timeout)
    }
  }, [state.isAuthenticated, state.user && typeof window !== 'undefined' ? localStorage.getItem('token_expires_at') : null])

  const loginWithEmail = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const authData = await authApi.loginWithEmail(credentials)
      setToken({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        expiresAt: authData.expiresAt,
        user: authData.user,
      })
      dispatch({ type: 'LOGIN_SUCCESS', payload: authData })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
      throw error
    }
  }, [])

  const loginWithPhone = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const authData = await authApi.loginWithPhone(credentials)
      setToken({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        expiresAt: authData.expiresAt,
        user: authData.user,
      })
      dispatch({ type: 'LOGIN_SUCCESS', payload: authData })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
      throw error
    }
  }, [])

  const loginWithExternalProvider = useCallback(async (credentials: ExternalLoginCredentials) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const authData = await authApi.loginWithExternalProvider(credentials)
      setToken({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        expiresAt: authData.expiresAt,
        user: authData.user,
      })
      dispatch({ type: 'LOGIN_SUCCESS', payload: authData })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "External login failed" 
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
      throw error
    }
  }, [])

  const guestLogin = useCallback(async (credentials: GuestLoginCredentials) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const authData = await authApi.guestLogin(credentials)
      setToken({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        expiresAt: authData.expiresAt,
        user: authData.user,
      })
      dispatch({ type: 'LOGIN_SUCCESS', payload: authData })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Guest login failed"
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
      throw error
    }
  }, [])

  const signupFull = useCallback(async (credentials: SignupCredentials): Promise<AuthResponse> => {
    dispatch({ type: 'SIGNUP_START' })
    try {
      const authData = await authApi.signupFull(credentials)
      if (authData.accessToken) {
        setToken({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          expiresAt: authData.expiresAt,
          user: authData.user,
        })
        dispatch({ type: 'SIGNUP_SUCCESS', payload: authData })
      } else {
        // Registration successful but verification required
        dispatch({ type: 'SIGNUP_SUCCESS', payload: authData })
      }
      return authData
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed"
      dispatch({ type: 'SIGNUP_FAILURE', payload: errorMessage })
      throw error
    }
  }, [])

  const signupWithEmail = useCallback(async (credentials: SignupEmailCredentials): Promise<AuthResponse> => {
    dispatch({ type: 'SIGNUP_START' })
    try {
      const authData = await authApi.signupWithEmail(credentials)
      if (authData.accessToken) {
        setToken({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          expiresAt: authData.expiresAt,
          user: authData.user,
        })
        dispatch({ type: 'SIGNUP_SUCCESS', payload: authData })
      } else {
        dispatch({ type: 'SIGNUP_SUCCESS', payload: authData })
      }
      return authData
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed"
      dispatch({ type: 'SIGNUP_FAILURE', payload: errorMessage })
      throw error
    }
  }, [])

  const signupWithPhone = useCallback(async (credentials: SignupPhoneCredentials): Promise<AuthResponse> => {
    dispatch({ type: 'SIGNUP_START' })
    try {
      const authData = await authApi.signupWithPhone(credentials)
      if (authData.accessToken) {
        setToken({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          expiresAt: authData.expiresAt,
          user: authData.user,
        })
        dispatch({ type: 'SIGNUP_SUCCESS', payload: authData })
      } else {
        dispatch({ type: 'SIGNUP_SUCCESS', payload: authData })
      }
      return authData
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed"
      dispatch({ type: 'SIGNUP_FAILURE', payload: errorMessage })
      throw error
    }
  }, [])

  const sendPhoneOTP = useCallback(async (credentials: SendPhoneOTPCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      await authApi.sendPhoneOTP(credentials)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP"
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const verifyPhoneOTP = useCallback(async (credentials: VerifyPhoneCredentials): Promise<AuthResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const authData = await authApi.verifyPhoneOTP(credentials)
      if (authData.accessToken) {
        setToken({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          expiresAt: authData.expiresAt,
          user: authData.user,
        })
        dispatch({ type: 'LOGIN_SUCCESS', payload: authData })
      }
      return authData
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Invalid OTP code"
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const confirmPhone = useCallback(async (credentials: VerifyPhoneCredentials): Promise<AuthResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const authData = await authApi.confirmPhone(credentials)
      if (authData.accessToken) {
        setToken({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          expiresAt: authData.expiresAt,
          user: authData.user,
        })
        dispatch({ type: 'LOGIN_SUCCESS', payload: authData })
      }
      return authData
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Invalid confirmation code"
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore errors during logout
    } finally {
      dispatch({ type: 'LOGOUT' })
    }
  }, [])

  const refreshToken = useCallback(async () => {
    try {
      const authData = await authApi.refreshToken()
      // Note: authApi.refreshToken already calls setToken internally
      // Convert null to undefined for type compatibility
      const refreshedUser = authData.user ?? (state.user ? state.user : undefined)
      dispatch({ type: 'REFRESH_TOKEN', payload: { ...authData, user: refreshedUser } })
    } catch (error: unknown) {
      dispatch({ type: 'LOGOUT' })
      throw error
    }
  }, [state.user])

  const refreshUser = useCallback(async () => {
    try {
      const user = getUser()
      if (user) {
        dispatch({ type: 'SET_USER', payload: user as unknown as AuthUser })
      }
    } catch {
      // If refresh fails, user data might be invalid
      console.error('Failed to refresh user data')
    }
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }, [])

  const value: AuthContextType = {
    ...state,
    loginWithEmail,
    loginWithPhone,
    loginWithExternalProvider,
    guestLogin,
    signupFull,
    signupWithEmail,
    signupWithPhone,
    sendPhoneOTP,
    verifyPhoneOTP,
    confirmPhone,
    logout,
    refreshToken,
    refreshUser,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
