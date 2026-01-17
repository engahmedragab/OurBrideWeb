import { useMutation, useQueryClient } from '@tanstack/react-query'
import { syncEventBooks, syncEventBooksDelta } from '@/services/api/eventBooksApi'
import type { EventBookRequest, EventLineRequest, EventLineCategoryRequest, UserType } from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'
import type { SyncBookDeltaRequest, SyncBookDeltaResponse } from '@/types/syncDelta'
import type { EventBook } from '@/../client/common/api/gen/ourbride-api'

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
    onSuccess: () => {
      // Invalidate event books query to refetch after sync
      queryClient.invalidateQueries({ queryKey: ['eventBooks'] })
      // Note: Toast is handled in the component's handleSave function
    },
    // Note: Error handling is done in the component
  })
}

/**
 * Hook to sync event books (delta)
 */
export const useSyncEventBooksDelta = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: (data: {
      delta: SyncBookDeltaRequest<EventLineRequest, EventLineCategoryRequest>
      params?: UseSyncEventBooksParams
    }): Promise<SyncBookDeltaResponse<EventBook | null>> => syncEventBooksDelta(data.delta, data.params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventBooks'] })
    },
    onError: (error: any) => {
      const { message, type } = handleApiResponseForToast(
        error,
        'Event book synced successfully',
        'Failed to sync event book'
      )
      addToast(message, type)
    },
  })
}
