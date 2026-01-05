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
    return response.data.errors.filter(
      (e): e is string => typeof e === 'string'
    )
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
  return message !== 'Operation completed successfully'
    ? message
    : defaultMessage
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
