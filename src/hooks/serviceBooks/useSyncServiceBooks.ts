import { useMutation, useQueryClient } from '@tanstack/react-query'
import { syncServiceBook, syncServiceBookDelta, type ServiceBooksQuery } from '@/services/api/serviceBooksApi'
import type { ServiceBookRequest, ServiceLineRequest, ServiceLineCategoryRequest } from '@/../client/common/api/gen/ourbride-api'
import type { SyncBookDeltaRequest, SyncBookDeltaResponse } from '@/types/syncDelta'
import type { ServiceBookResponse } from '@/types/responses'

/**
 * Hook to sync service book (full book object)
 */
export const useSyncServiceBook = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ data, query }: { data: ServiceBookRequest; query?: ServiceBooksQuery }) => {
      await syncServiceBook(data, query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['serviceBook', variables.query] })
      queryClient.invalidateQueries({ queryKey: ['serviceLines', variables.query] })
    },
  })
}

/**
 * Hook to sync service book (delta)
 */
export const useSyncServiceBookDelta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      data,
      query,
    }: {
      data: SyncBookDeltaRequest<ServiceLineRequest, ServiceLineCategoryRequest>
      query?: ServiceBooksQuery
    }): Promise<SyncBookDeltaResponse<ServiceBookResponse | null>> => {
      return await syncServiceBookDelta(data, query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['serviceBook', variables.query] })
      queryClient.invalidateQueries({ queryKey: ['serviceLines', variables.query] })
    },
  })
}
