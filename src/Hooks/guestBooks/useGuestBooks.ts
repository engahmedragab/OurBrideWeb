/**
 * GuestBooks React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getGuestBook,
  syncGuestBook,
  initGuestBooks,
  type GuestBooksQuery,
} from '@/services/api/guestBooksApi'
import type { GuestBookResponse } from '@/types/responses'
import type {
  GuestBookRequest,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch guest book
 */
export const useGuestBook = (
  query?: GuestBooksQuery & { enabled?: boolean }
) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()

  return useQuery<GuestBookResponse | null>({
    queryKey: ['guestBook', queryParams],
    queryFn: async () => {
      return await getGuestBook(queryParams)
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to sync guest book (full book object)
 */
export const useSyncGuestBook = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      data,
      query,
    }: {
      data: GuestBookRequest
      query?: GuestBooksQuery
    }) => {
      await syncGuestBook(data, query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['guestBook', variables.query],
      })
    },
  })
}

/**
 * Hook to initialize guest books
 */
export const useInitGuestBooks = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params?: {
      clientId?: string | null
      userType?: UserType | null
      eventId?: number
    }) => {
      const normalizedParams = params
        ? {
            clientId: params.clientId ?? undefined,
            userType: params.userType ?? undefined,
            eventId: params.eventId,
          }
        : undefined
      await initGuestBooks(normalizedParams)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['guestBook'] })
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
    },
  })
}
