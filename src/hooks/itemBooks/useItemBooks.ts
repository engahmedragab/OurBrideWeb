/**
 * ItemBooks React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getItemBook,
  syncItemBook,
  syncItemBookDelta,
  type ItemBooksQuery,
} from '@/services/api/itemBooksApi'
import type { ItemBookResponse } from '@/types/responses'
import type { ItemBookRequest, ItemLineRequest, ItemLineCategoryRequest } from '@/../client/common/api/gen/ourbride-api'
import type { SyncBookDeltaRequest, SyncBookDeltaResponse } from '@/types/syncDelta'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch item book
 */
export const useItemBook = (query?: ItemBooksQuery & { enabled?: boolean }) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()
  
  return useQuery<ItemBookResponse | null>({
    queryKey: ['itemBook', queryParams],
    queryFn: async () => {
      return await getItemBook(queryParams)
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to sync item book (full book object)
 */
export const useSyncItemBook = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ data, query }: { data: ItemBookRequest; query?: ItemBooksQuery }) => {
      await syncItemBook(data, query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itemBook', variables.query] })
    },
  })
}

/**
 * Hook to sync item book (delta)
 */
export const useSyncItemBookDelta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      data,
      query,
    }: {
      data: SyncBookDeltaRequest<ItemLineRequest, ItemLineCategoryRequest>
      query?: ItemBooksQuery
    }): Promise<SyncBookDeltaResponse<ItemBookResponse | null>> => {
      return await syncItemBookDelta(data, query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itemBook', variables.query] })
    },
  })
}