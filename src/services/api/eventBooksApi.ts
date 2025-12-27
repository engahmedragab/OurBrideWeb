// EventBooks API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  EventBookRequest,
  EventLineRequest,
  EventLineCategoryRequest,
  EventBook,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'

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
 * Sync event book data
 */
export const syncEventBooks = async (
  data: EventBookRequest,
  params?: {
    clientId?: string
    userType?: UserType
  }
): Promise<void> => {
  try {
    await apiClient.api.postEventBooksSyncBook(data, params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to sync event books')
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
    const responseAny: any = response as { data?: { data?: EventBook } | EventBook }
    if (responseAny?.data && typeof responseAny.data === 'object' && 'data' in responseAny.data) {
      return (responseAny.data as { data: EventBook }).data
    }
    if (responseAny?.data) {
      return responseAny.data as EventBook
    }
    return (responseAny as unknown as EventBook) ?? null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch event books')
  }
}

