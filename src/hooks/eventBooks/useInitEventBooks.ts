import { useMutation, useQueryClient } from '@tanstack/react-query'
import { initEventBooks } from '@/services/api/eventBooksApi'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

export interface UseInitEventBooksParams {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Hook to initialize event books
 */
export const useInitEventBooks = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: (params?: UseInitEventBooksParams) => initEventBooks(params),
    onSuccess: response => {
      // Invalidate event books query to refetch after initialization
      queryClient.invalidateQueries({ queryKey: ['eventBooks'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Event books initialized successfully',
        'Failed to initialize event books'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to initialize event books'
      addToast(errorMessage, 'error')
    },
  })
}
