import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEventBookCategory } from '@/services/api/eventBooksApi'
import type { EventLineCategoryRequest } from '@/../client/common/api/gen/ourbride-api'

export interface UseCreateEventBookCategoryParams {
  clientId?: string
}

/**
 * Hook to create event book category
 */
export const useCreateEventBookCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      category: EventLineCategoryRequest
      params?: UseCreateEventBookCategoryParams
    }) => createEventBookCategory(data.category, data.params),
    onSuccess: () => {
      // Invalidate event books query to refetch after category creation
      queryClient.invalidateQueries({ queryKey: ['eventBooks'] })
    },
  })
}

