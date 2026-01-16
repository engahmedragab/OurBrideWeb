/**
 * TodoBooks React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTodoBook,
  syncTodoBook,
  syncTodoBookDelta,
  type TodoBooksQuery,
} from '@/services/api/todoBooksApi'
import type { TodoBookResponse } from '@/types/responses'
import type { TodoBookRequest, TodoLineRequest, TodoLineCategoryRequest } from '@/../client/common/api/gen/ourbride-api'
import type { SyncBookDeltaRequest, SyncBookDeltaResponse } from '@/types/syncDelta'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch todo book
 */
export const useTodoBook = (query?: TodoBooksQuery & { enabled?: boolean }) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()
  
  return useQuery<TodoBookResponse | null>({
    queryKey: ['todoBook', queryParams],
    queryFn: async () => {
      return await getTodoBook(queryParams)
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to sync todo book (full book object)
 */
export const useSyncTodoBook = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ data, query }: { data: TodoBookRequest; query?: TodoBooksQuery }) => {
      await syncTodoBook(data, query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todoBook', variables.query] })
    },
  })
}

/**
 * Hook to sync todo book (delta)
 */
export const useSyncTodoBookDelta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      data,
      query,
    }: {
      data: SyncBookDeltaRequest<TodoLineRequest, TodoLineCategoryRequest>
      query?: TodoBooksQuery
    }): Promise<SyncBookDeltaResponse<TodoBookResponse | null>> => {
      return await syncTodoBookDelta(data, query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todoBook', variables.query] })
    },
  })
}
