import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteEventBookCategory } from '@/services/api/eventBooksApi'

export interface UseDeleteEventBookCategoryParams {
  clientId?: string
}

/**
 * Hook to delete event book category
 */
export const useDeleteEventBookCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      lineCategoryId: number
      params?: UseDeleteEventBookCategoryParams
    }) => deleteEventBookCategory(data.lineCategoryId, data.params),
    onSuccess: () => {
      // Invalidate event books and categories queries to refetch after deletion
      queryClient.invalidateQueries({ queryKey: ['eventBooks'] })
      queryClient.invalidateQueries({ queryKey: ['eventBooksCategories'] })
    },
  })
}

