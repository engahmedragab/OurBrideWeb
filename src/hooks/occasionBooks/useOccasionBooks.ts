/**
 * OccasionBooks React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOccasionBook,
  getOccasionLines,
  createOccasionLine,
  updateOccasionLine,
  deleteOccasionLine,
  syncOccasionBook,
  initOccasionBooks,
  type OccasionBooksQuery,
} from '@/services/api/occasionBooksApi'
import type {
  OccasionBookResponse,
  OccasionLineResponse,
} from '@/types/responses'
import type {
  OccasionLineRequest,
  OccasionLineUpdateRequest,
  OccasionBookRequest,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'
import { isAuthenticated } from '@/auth/utils/token'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

/**
 * Hook to fetch occasion book
 */
export const useOccasionBook = (
  query?: OccasionBooksQuery & { enabled?: boolean }
) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()

  return useQuery<OccasionBookResponse | null>({
    queryKey: ['occasionBook', queryParams],
    queryFn: async () => {
      return await getOccasionBook(queryParams)
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch all occasion lines
 */
export const useOccasionLines = (
  query?: OccasionBooksQuery & { enabled?: boolean }
) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()

  return useQuery<OccasionLineResponse[]>({
    queryKey: ['occasionLines', queryParams],
    queryFn: async () => {
      return await getOccasionLines(queryParams)
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to create an occasion line
 */
export const useCreateOccasionLine = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async ({
      data,
      query,
    }: {
      data: OccasionLineRequest
      query?: OccasionBooksQuery
    }) => {
      return await createOccasionLine(data, query)
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ['occasionLines'] })
      queryClient.invalidateQueries({ queryKey: ['occasionBook'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Occasion line created successfully',
        'Failed to create occasion line'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create occasion line'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to update an occasion line
 */
export const useUpdateOccasionLine = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async ({
      lineId,
      data,
      query,
    }: {
      lineId: number
      data: OccasionLineUpdateRequest
      query?: OccasionBooksQuery
    }) => {
      return await updateOccasionLine(lineId, data, query)
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ['occasionLines'] })
      queryClient.invalidateQueries({ queryKey: ['occasionBook'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Occasion line updated successfully',
        'Failed to update occasion line'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update occasion line'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to delete an occasion line
 */
export const useDeleteOccasionLine = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async ({
      lineId,
      query,
    }: {
      lineId: number
      query?: OccasionBooksQuery
    }) => {
      await deleteOccasionLine(lineId, query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['occasionLines', variables.query],
      })
      queryClient.invalidateQueries({
        queryKey: ['occasionBook', variables.query],
      })
      addToast('Occasion line deleted successfully', 'success')
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete occasion line'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to sync occasion book (full book object)
 */
export const useSyncOccasionBook = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async ({
      data,
      query,
    }: {
      data: OccasionBookRequest
      query?: OccasionBooksQuery
    }) => {
      await syncOccasionBook(data, query)
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['occasionBook', variables.query],
      })
      queryClient.invalidateQueries({
        queryKey: ['occasionLines', variables.query],
      })

      const { message, type } = handleApiResponseForToast(
        response,
        'Occasion book synced successfully',
        'Failed to sync occasion book'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to sync occasion book'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to initialize occasion books
 */
export const useInitOccasionBooks = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (params?: {
      clientId?: string | null
      userType?: UserType | null
      eventId?: number
    }) => {
      // Pass all params including eventId to initOccasionBooks
      // Convert null to undefined for clientId and userType
      const normalizedParams = params
        ? {
            clientId: params.clientId ?? undefined,
            userType: params.userType ?? undefined,
            eventId: params.eventId,
          }
        : undefined
      await initOccasionBooks(normalizedParams)
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['occasionBook'] })
      queryClient.invalidateQueries({ queryKey: ['occasionLines'] })
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })

      const { message, type } = handleApiResponseForToast(
        response,
        'Occasion books initialized successfully',
        'Failed to initialize occasion books'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to initialize occasion books'
      addToast(errorMessage, 'error')
    },
  })
}
