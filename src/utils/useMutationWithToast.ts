import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { useToast } from '@/components/ui/Toaster'
import { extractApiMessage, extractApiErrorMessage, extractApiSuccess } from '@/utils/api-response.utils'
import { useI18nTranslations } from '@/i18n/hooks'

interface UseMutationWithToastOptions<TData, TError, TVariables, TContext> 
  extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'onSuccess' | 'onError'> {
  onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void
  onError?: (error: TError, variables: TVariables, context: TContext | undefined) => void
  successMessage?: string | ((data: TData) => string)
  errorMessage?: string | ((error: TError) => string)
  showSuccessToast?: boolean
  showErrorToast?: boolean
}

/**
 * Wrapper around useMutation that automatically shows toast notifications
 * for success and error states based on API response
 */
export function useMutationWithToast<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  options: UseMutationWithToastOptions<TData, TError, TVariables, TContext>
) {
  const { addToast } = useToast()
  const t = useI18nTranslations('common.toast')
  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
    ...mutationOptions
  } = options

  return useMutation<TData, TError, TVariables, TContext>({
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      // Show success toast if enabled
      if (showSuccessToast) {
        const defaultSuccessMessage = t('defaultSuccess')
        let message = defaultSuccessMessage
        
        if (successMessage) {
          if (typeof successMessage === 'function') {
            message = successMessage(data)
          } else {
            message = successMessage
          }
        } else {
          // Try to extract message from API response
          const apiMessage = extractApiMessage(data as unknown, defaultSuccessMessage)
          const isSuccess = extractApiSuccess(data as unknown)
          if (isSuccess && apiMessage && apiMessage !== defaultSuccessMessage) {
            message = apiMessage
          }
        }
        
        addToast(message, 'success')
      }
      
      // Call custom onSuccess if provided
      if (onSuccess) {
        onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      // Show error toast if enabled
      if (showErrorToast) {
        const defaultErrorMessage = t('defaultError')
        let message = defaultErrorMessage
        
        if (errorMessage) {
          if (typeof errorMessage === 'function') {
            message = errorMessage(error)
          } else {
            message = errorMessage
          }
        } else if (error && typeof error === 'object') {
          // Try to extract error message from error object
          if ('response' in error && error.response && typeof error.response === 'object') {
            const axiosError = error as { response?: { data?: unknown } }
            if (axiosError.response?.data) {
              message = extractApiErrorMessage(axiosError.response.data, defaultErrorMessage)
            }
          } else if (error instanceof Error) {
            message = error.message
          }
        } else if (error instanceof Error) {
          message = error.message
        }
        
        addToast(message, 'error')
      }
      
      // Call custom onError if provided
      if (onError) {
        onError(error, variables, context)
      }
    },
  })
}

