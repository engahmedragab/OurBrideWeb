import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEventBookEventLine } from '@/services/api/eventBooksApi'
import type { EventLineRequest, UserType } from '@/../client/common/api/gen/ourbride-api'

export interface UseCreateEventBookEventLineParams {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Hook to create event book event line
 */
export const useCreateEventBookEventLine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      eventLine: EventLineRequest
      params?: UseCreateEventBookEventLineParams
    }) => createEventBookEventLine(data.eventLine, data.params),
    onSuccess: () => {
      // Invalidate event books query to refetch after event line creation
      queryClient.invalidateQueries({ queryKey: ['eventBooks'] })
    },
  })
}

