import { useMutation, useQueryClient } from '@tanstack/react-query'
import { syncEventBooks } from '@/services/api/eventBooksApi'
import type { EventBookRequest, UserType } from '@/../client/common/api/gen/ourbride-api'

export interface UseSyncEventBooksParams {
  clientId?: string
  userType?: UserType
}

/**
 * Hook to sync event books
 */
export const useSyncEventBooks = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      eventBook: EventBookRequest
      params?: UseSyncEventBooksParams
    }) => syncEventBooks(data.eventBook, data.params),
    onSuccess: () => {
      // Invalidate event books query to refetch after sync
      queryClient.invalidateQueries({ queryKey: ['eventBooks'] })
    },
  })
}

