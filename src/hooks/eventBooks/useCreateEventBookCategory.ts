import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEventBookCategory } from '@/services/api/eventBooksApi'
import type { EventLineCategoryRequest } from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

export interface UseCreateEventBookCategoryParams {
  clientId?: string
}

/**
 * Hook to create event book category
 */
export const useCreateEventBookCategory = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: (data: {
      category: EventLineCategoryRequest
      params?: UseCreateEventBookCategoryParams
    }) => createEventBookCategory(data.category, data.params),
    onSuccess: (response) => {
      // Invalidate event books query to refetch after category creation
      queryClient.invalidateQueries({ queryKey: ['eventBooks'] })
      
      const { message, type } = handleApiResponseForToast(
        response,
        'Event category created successfully',
        'Failed to create event category'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event category'
      addToast(errorMessage, 'error')
    },
  })
}

