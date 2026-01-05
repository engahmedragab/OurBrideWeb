import { useQuery } from '@tanstack/react-query'
import { getEventBooks } from '@/services/api/eventBooksApi'
import type {
  EventBook,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'

export interface UseEventBooksParams {
  clientId?: string
  userType?: UserType
  eventId?: number
  enabled?: boolean
}

/**
 * Hook to fetch event books
 */
export const useEventBooks = (params?: UseEventBooksParams) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery({
    queryKey: ['eventBooks', queryParams],
    queryFn: async (): Promise<EventBook | null> => {
      const eventBook = await getEventBooks(queryParams)
      return eventBook
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
