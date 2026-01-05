import { useQuery } from '@tanstack/react-query'
import { getEventBooksCategories } from '@/services/api/eventBooksApi'

export interface UseGetEventBooksCategoriesParams {
  clientId?: string
  enabled?: boolean
}

/**
 * Hook to get all event book categories
 */
export const useGetEventBooksCategories = (
  params?: UseGetEventBooksCategoriesParams
) => {
  return useQuery({
    queryKey: ['eventBooksCategories', params?.clientId],
    queryFn: () => getEventBooksCategories({ clientId: params?.clientId }),
    enabled: params?.enabled !== false,
  })
}
