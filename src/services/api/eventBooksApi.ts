// EventBooks API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  EventBookRequest,
  EventLineRequest,
  EventLineCategoryRequest,
  EventLineCategory,
  EventBook,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'
import type { SyncBookDeltaRequest, SyncBookDeltaResponse } from '@/types/syncDelta'

/**
 * Initialize event books for a client
 */
export const initEventBooks = async (params?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<void> => {
  try {
    // Normalize params: set clientId and userType to null, keep eventId
    const normalizedParams = params ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: params.eventId,
    } : undefined
    await apiClient.api.postEventBooksInit(normalizedParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize event books')
  }
}

/**
 * Add models to event books
 */
export const addEventBookModels = async (params?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<void> => {
  try {
    const normalizedParams = params ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: params.eventId,
    } : undefined
    await apiClient.api.postEventBooksAddModels(normalizedParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add event book models')
  }
}

/**
 * Sync event book data
 */
export const syncEventBooks = async (
  data: EventBookRequest,
  params?: {
    clientId?: string
    userType?: UserType
    eventId?: number
  }
): Promise<void> => {
  try {
    await apiClient.api.postEventBooksSyncBook(data, params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to sync event books')
  }
}

/**
 * Sync event book data (delta)
 */
export const syncEventBooksDelta = async (
  data: SyncBookDeltaRequest<EventLineRequest, EventLineCategoryRequest>,
  params?: {
    clientId?: string
    userType?: UserType
    eventId?: number
  }
): Promise<SyncBookDeltaResponse<EventBook | null>> => {
  try {
    const response = await apiClient.api.postEventBooksSyncBookDelta(data, params)
    const responseAny: any = response as { data?: { data?: unknown } | unknown } | unknown
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as SyncBookDeltaResponse<EventBook | null>
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to sync event books (delta)')
  }
}

/**
 * Create event book category
 */
export const createEventBookCategory = async (
  data: EventLineCategoryRequest,
  params?: {
    clientId?: string
  }
): Promise<void> => {
  try {
    await apiClient.api.postEventBooksCreateCategory(data, params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create event book category')
  }
}

/**
 * Create event book event line
 */
export const createEventBookEventLine = async (
  data: EventLineRequest,
  params?: {
    clientId?: string
    userType?: UserType
    eventId?: number
  }
): Promise<void> => {
  try {
    await apiClient.api.postEventBooksCreate(data, params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create event book event line')
  }
}

/**
 * Get event books
 */
export const getEventBooks = async (params?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<EventBook | null> => {
  try {
    const response = await apiClient.api.getEventBooksGetBook(params)
    // Response unwrapping pattern: check response.data.data first, then response.data, then response
    const responseAny = response as { data?: { data?: EventBook } | EventBook } | EventBook
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: EventBook }).data
      }
      if (data) {
        return data as EventBook
      }
    }
    return (responseAny as unknown as EventBook) ?? null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch event books')
  }
}

/**
 * Get all event book categories
 */
export const getEventBooksCategories = async (
  query?: { clientId?: string }
): Promise<EventLineCategory[]> => {
  try {
    const response = await apiClient.api.getEventBooksGetAllCategories(query)
    const responseAny = response as { data?: EventLineCategory[] | { data?: EventLineCategory[] } }
    
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data
    }
    if (responseAny?.data && typeof responseAny.data === 'object' && 'data' in responseAny.data) {
      const nestedData = (responseAny.data as { data?: EventLineCategory[] }).data
      if (Array.isArray(nestedData)) {
        return nestedData
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch event book categories')
  }
}

/**
 * Delete event book category
 */
export const deleteEventBookCategory = async (
  lineCategoryId: number,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.deleteEventBooksDeleteCategory(lineCategoryId, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete event book category')
  }
}

