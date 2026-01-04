import { useMutation, useQueryClient } from '@tanstack/react-query'
import { syncServiceBook, type ServiceBooksQuery } from '@/services/api/serviceBooksApi'
import type { ServiceBookRequest } from '@/../client/common/api/gen/ourbride-api'

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

