import { useMutation, useQueryClient } from '@tanstack/react-query'
import { initEventBooks } from '@/services/api/eventBooksApi'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'

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

  return useMutation({
    mutationFn: (params?: UseInitEventBooksParams) => initEventBooks(params),
    onSuccess: () => {
      // Invalidate event books query to refetch after initialization
      queryClient.invalidateQueries({ queryKey: ['eventBooks'] })
    },
  })
}

