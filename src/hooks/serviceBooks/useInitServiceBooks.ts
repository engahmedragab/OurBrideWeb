import { useMutation, useQueryClient } from '@tanstack/react-query'
import { initServiceBooks } from '@/services/api/serviceBooksApi'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'

/**
 * Hook to initialize service books
 */
export const useInitServiceBooks = () => {
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
      await initServiceBooks(normalizedParams)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['serviceBook'] })
      queryClient.invalidateQueries({ queryKey: ['serviceLines'] })
      queryClient.invalidateQueries({ queryKey: ['serviceCategories'] })
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
    },
  })
}
