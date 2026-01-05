import { useMutation, useQueryClient } from '@tanstack/react-query'
import { syncEventBooks } from '@/services/api/eventBooksApi'
import type {
  EventBookRequest,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

export interface UseSyncEventBooksParams {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Hook to sync event books
 */
export const useSyncEventBooks = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: (data: {
      eventBook: EventBookRequest
      params?: UseSyncEventBooksParams
    }) => syncEventBooks(data.eventBook, data.params),
    onSuccess: response => {
      // Invalidate event books query to refetch after sync
      queryClient.invalidateQueries({ queryKey: ['eventBooks'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Event books synced successfully',
        'Failed to sync event books'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to sync event books'
      addToast(errorMessage, 'error')
    },
  })
}
