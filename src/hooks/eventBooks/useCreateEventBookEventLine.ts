import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEventBookEventLine } from '@/services/api/eventBooksApi'
import type {
  EventLineRequest,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

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
  const { addToast } = useToast()

  return useMutation({
    mutationFn: (data: {
      eventLine: EventLineRequest
      params?: UseCreateEventBookEventLineParams
    }) => createEventBookEventLine(data.eventLine, data.params),
    onSuccess: response => {
      // Invalidate event books query to refetch after event line creation
      queryClient.invalidateQueries({ queryKey: ['eventBooks'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Event line created successfully',
        'Failed to create event line'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create event line'
      addToast(errorMessage, 'error')
    },
  })
}
