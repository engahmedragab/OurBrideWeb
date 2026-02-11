import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getWeddingEvents,
  getWeddingEventById,
  createWeddingEvent,
  updateWeddingEvent,
  deleteWeddingEvent,
  getEventInfo,
} from '@/services/api/weddingEventApi'
import type {
  WeddingEventCreateRequest,
  WeddingEventUpdateRequest,
} from '@/../client/common/api/gen/ourbride-api'
import type { WeddingEventResponse, EventInfoResponse } from '@/types/responses'
import { isAuthenticated } from '@/auth/utils/token'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'
import { useI18nTranslations } from '@/i18n'

/**
 * Hook to fetch all wedding events
 */
export const useWeddingEvents = (query?: {
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()

  return useQuery<WeddingEventResponse[]>({
    queryKey: ['weddingEvents', queryParams],
    queryFn: async () => {
      return await getWeddingEvents(queryParams)
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch a single wedding event by ID
 */
export const useWeddingEvent = (eventId: number | null, enabled: boolean = true) => {
  const authenticated = isAuthenticated()

  return useQuery<WeddingEventResponse | null>({
    queryKey: ['weddingEvent', eventId],
    queryFn: async () => {
      if (!eventId) return null
      return await getWeddingEventById(eventId)
    },
    enabled: enabled && authenticated && eventId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to create a new wedding event
 */
export const useCreateWeddingEvent = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (data: WeddingEventCreateRequest) => {
      return await createWeddingEvent(data)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['weddingEvents'] })

      const { message, type } = handleApiResponseForToast(
        response,
        t('weddingEventCreatedSuccess'),
        t('weddingEventCreatedError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('weddingEventCreatedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to update a wedding event
 */
export const useUpdateWeddingEvent = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async ({ eventId, data }: { eventId: number; data: WeddingEventUpdateRequest }) => {
      return await updateWeddingEvent(eventId, data)
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weddingEvents'] })
      queryClient.invalidateQueries({ queryKey: ['weddingEvent', variables.eventId] })

      const { message, type } = handleApiResponseForToast(
        response,
        t('weddingEventUpdatedSuccess'),
        t('weddingEventUpdatedError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('weddingEventUpdatedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to delete a wedding event
 */
export const useDeleteWeddingEvent = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (eventId: number) => {
      await deleteWeddingEvent(eventId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weddingEvents'] })
      addToast(t('weddingEventDeletedSuccess'), 'success')
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('weddingEventDeletedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to fetch event info (all books) for a wedding event
 */
export const useEventInfo = (eventId: number | null, enabled: boolean = true) => {
  const authenticated = isAuthenticated()

  return useQuery<EventInfoResponse | null>({
    queryKey: ['eventInfo', eventId],
    queryFn: async () => {
      if (!eventId) return null
      return await getEventInfo(eventId)
    },
    enabled: enabled && authenticated && eventId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
