/**
 * Utility functions for handling API responses
 * Provides type-safe extraction of messages and errors from API responses
 */

/**
 * Type guard to check if value is a record
 */
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Extract message from API response
 */
export const extractApiMessage = (
  response: unknown,
  defaultMessage: string = 'Operation completed successfully'
): string => {
  if (!isRecord(response)) {
    return defaultMessage
  }

  // Try direct message
  if (typeof response.message === 'string') {
    return response.message
  }

  // Try nested data.message
  if (isRecord(response.data) && typeof response.data.message === 'string') {
    return response.data.message
  }

  return defaultMessage
}

/**
 * Extract success status from API response
 */
export const extractApiSuccess = (response: unknown): boolean => {
  if (!isRecord(response)) {
    return true // Default to success if we can't determine
  }

  // Try direct success
  if (typeof response.success === 'boolean') {
    return response.success
  }

  // Try nested data.success
  if (isRecord(response.data) && typeof response.data.success === 'boolean') {
    return response.data.success
  }

  return true // Default to success
}

/**
 * Extract errors array from API response
 */
export const extractApiErrors = (response: unknown): string[] => {
  if (!isRecord(response)) {
    return []
  }

  // Try direct errors
  if (Array.isArray(response.errors)) {
    return response.errors.filter((e): e is string => typeof e === 'string')
  }

  // Try nested data.errors
  if (isRecord(response.data) && Array.isArray(response.data.errors)) {
    return response.data.errors.filter((e): e is string => typeof e === 'string')
  }

  return []
}

/**
 * Extract first error message from API response
 */
export const extractApiErrorMessage = (
  response: unknown,
  defaultMessage: string = 'An error occurred'
): string => {
  const errors = extractApiErrors(response)
  if (errors.length > 0) {
    return errors[0]
  }

  // Fallback to message if no errors array
  const message = extractApiMessage(response, defaultMessage)
  return message !== 'Operation completed successfully' ? message : defaultMessage
}

/**
 * Handle API response for toast notifications
 * Returns an object with message and type for toast
 */
export const handleApiResponseForToast = (
  response: unknown,
  successDefaultMessage: string = 'Operation completed successfully',
  errorDefaultMessage: string = 'An error occurred'
): { message: string; type: 'success' | 'error' } => {
  const success = extractApiSuccess(response)
  const message = success
    ? extractApiMessage(response, successDefaultMessage)
    : extractApiErrorMessage(response, errorDefaultMessage)

  return {
    message,
    type: success ? 'success' : 'error',
  }
}

/**
 * Error codes from backend ExceptionMiddleware
 * Based on ApiErrorCodes.General enum
 */
export enum ApiErrorCode {
  UnknownError = 99999,
  Unauthorized = 100000,
  GuestOrAuthenticatedRequired = 100001,
  EnsureAuthenticatedRequired = 100002,
}

/**
 * Extract error code from API error response
 * Returns the error code if found, null otherwise
 */
export const extractApiErrorCode = (error: unknown): number | null => {
  if (!error || typeof error !== 'object') {
    return null
  }

  // Check if it's an Axios error with response
  const axiosError = error as { response?: { data?: unknown } }
  if (axiosError.response?.data) {
    const responseData = axiosError.response.data

    // Check for errors array with code property
    if (isRecord(responseData)) {
      // Check direct errors array
      if (Array.isArray(responseData.errors)) {
        const firstError = responseData.errors[0]
        if (isRecord(firstError) && typeof firstError.code === 'number') {
          return firstError.code
        }
      }

      // Check nested data.errors
      if (isRecord(responseData.data) && Array.isArray(responseData.data.errors)) {
        const firstError = responseData.data.errors[0]
        if (isRecord(firstError) && typeof firstError.code === 'number') {
          return firstError.code
        }
      }
    }
  }

  return null
}

/**
 * Check if error is a specific error code
 */
export const isApiErrorCode = (error: unknown, code: ApiErrorCode): boolean => {
  const errorCode = extractApiErrorCode(error)
  return errorCode === code
}

/**
 * Check if error requires guest or authenticated user (code 100001)
 * This means the endpoint should work for both guest and authenticated users
 */
export const isGuestOrAuthenticatedRequired = (error: unknown): boolean => {
  return isApiErrorCode(error, ApiErrorCode.GuestOrAuthenticatedRequired)
}

/**
 * Check if error requires full authentication (code 100002)
 * This means the endpoint requires a fully authenticated user (not guest)
 */
export const isEnsureAuthenticatedRequired = (error: unknown): boolean => {
  return isApiErrorCode(error, ApiErrorCode.EnsureAuthenticatedRequired)
}

/**
 * Check if error is a general unauthorized error (code 100000)
 * This could be role-based or permission-based authorization failure
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  return isApiErrorCode(error, ApiErrorCode.Unauthorized)
}

/**
 * Check if error should allow guest access (code 100001)
 * Returns true if the error indicates guest access is allowed
 */
export const shouldAllowGuestAccess = (error: unknown): boolean => {
  return isGuestOrAuthenticatedRequired(error)
}

/**
 * Check if error should redirect to login
 * Returns true if the error requires authentication and user should be redirected
 */
export const shouldRedirectToLogin = (error: unknown): boolean => {
  // Only redirect for EnsureAuthenticatedRequired (100002)
  // Don't redirect for GuestOrAuthenticatedRequired (100001) - allow guest access
  // Don't redirect for general Unauthorized (100000) - might be role-based, handle in UI
  return isEnsureAuthenticatedRequired(error)
}

/**
 * Check if error is a 401 authentication error
 */
export const isAuthenticationError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false
  }

  const axiosError = error as { response?: { status?: number } }
  return axiosError.response?.status === 401
}

/**
 * Handle error for public endpoints
 * Returns a default value if the error is an authentication error that allows guest access
 * Otherwise, re-throws the error
 */
export const handlePublicEndpointError = <T>(
  error: unknown,
  defaultValue: T,
  allowGuestAccess: boolean = true
): T => {
  // If guest access is allowed and this is a GuestOrAuthenticatedRequired error,
  // return default value instead of throwing
  if (allowGuestAccess && isGuestOrAuthenticatedRequired(error)) {
    console.warn('Public endpoint returned guest/authenticated required error, using default value:', error)
    return defaultValue
  }

  // For other errors, re-throw
  throw error
}

