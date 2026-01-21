/**
 * ServiceBooks API Functions
 * API service for managing service books and lines
 */

import { apiClient } from '@/services/api/apiClient'
import type { ServiceBookResponse, ServiceLineResponse, ServiceLineCategoryResponse } from '@/types/responses'
import type {
  ServiceBookRequest,
  ServiceLineRequest,
  ServiceLineUpdateRequest,
  ServiceLineCategoryRequest,
  ServiceLineCategoryUpdateRequest,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'
import type { SyncBookDeltaRequest, SyncBookDeltaResponse } from '@/types/syncDelta'

export interface ServiceBooksQuery {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Normalize query parameters - set clientId and userType to null, keep eventId
 */
const normalizeQuery = (query?: ServiceBooksQuery) => {
  if (!query) return undefined
  return {
    clientId: null as unknown as string | undefined,
    userType: null as unknown as UserType | undefined,
    eventId: query.eventId,
  }
}

/**
 * Initialize service books for a client
 */
export const initServiceBooks = async (params?: {
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
    await apiClient.api.postServiceBooksInit(normalizedParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize service books')
  }
}

/**
 * Add models to service books
 */
export const addServiceBookModels = async (params?: {
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
    await apiClient.api.postServiceBooksAddModels(normalizedParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add service book models')
  }
}

/**
 * Sync service book data
 */
export const syncServiceBook = async (
  data: ServiceBookRequest,
  query?: ServiceBooksQuery
): Promise<void> => {
  try {
    const params = normalizeQuery(query)
    await apiClient.api.postServiceBooksSyncBook(data, params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to sync service book')
  }
}

/**
 * Sync service book data (delta)
 */
export const syncServiceBookDelta = async (
  data: SyncBookDeltaRequest<ServiceLineRequest, ServiceLineCategoryRequest>,
  query?: ServiceBooksQuery
): Promise<SyncBookDeltaResponse<ServiceBookResponse | null>> => {
  try {
    const params = normalizeQuery(query)
    const response = await apiClient.api.postServiceBooksSyncBookDelta(data, params)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as unknown as SyncBookDeltaResponse<ServiceBookResponse | null>
      }
      if (data && typeof data === 'object') {
        return data as unknown as SyncBookDeltaResponse<ServiceBookResponse | null>
      }
    }
    return responseAny as unknown as SyncBookDeltaResponse<ServiceBookResponse | null>
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to sync service book (delta)')
  }
}

/**
 * Get service book
 */
export const getServiceBook = async (
  query?: ServiceBooksQuery
): Promise<ServiceBookResponse | null> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getServiceBooksGetBook(normalizedQuery)
    const responseAny = response as unknown as { data?: { data?: ServiceBookResponse } | ServiceBookResponse } | ServiceBookResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ServiceBookResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as ServiceBookResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ServiceBookResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch service book')
  }
}

/**
 * Get all service lines
 */
export const getServiceLines = async (
  query?: ServiceBooksQuery
): Promise<ServiceLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getServiceBooksGetAll(normalizedQuery)
    const responseAny = response as unknown as { data?: ServiceLineResponse[] | { data?: ServiceLineResponse[]; items?: ServiceLineResponse[] } } | ServiceLineResponse[]
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (data && typeof data === 'object') {
        if ('data' in data && Array.isArray(data.data)) {
          return data.data
        }
        if ('items' in data && Array.isArray(data.items)) {
          return data.items
        }
      }
    }
    if (Array.isArray(responseAny)) {
      return responseAny
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch service lines')
  }
}

/**
 * Get service line by ID
 */
export const getServiceLineById = async (
  lineId: number,
  query?: { clientId?: string; eventId?: number }
): Promise<ServiceLineResponse | null> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    const response = await apiClient.api.getServiceBooksGet(lineId, String(lineId), normalizedQuery)
    const responseAny = response as unknown as { data?: { data?: ServiceLineResponse } | ServiceLineResponse } | ServiceLineResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ServiceLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as ServiceLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ServiceLineResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch service line')
  }
}

/**
 * Create a service line
 */
export const createServiceLine = async (
  data: ServiceLineRequest,
  query?: ServiceBooksQuery
): Promise<ServiceLineResponse> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.postServiceBooksCreate(data, normalizedQuery)
    const responseAny = response as unknown as { data?: { data?: ServiceLineResponse } | ServiceLineResponse } | ServiceLineResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ServiceLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as ServiceLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ServiceLineResponse
    }
    throw new Error('Invalid response format from create service line endpoint')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create service line')
  }
}

/**
 * Create multiple service lines (bulk)
 */
export const createServiceLinesBulk = async (
  data: ServiceLineRequest[],
  query?: ServiceBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.postServiceBooksCreateAll(data, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create service lines')
  }
}

/**
 * Update a service line
 */
export const updateServiceLine = async (
  lineId: number,
  data: ServiceLineUpdateRequest,
  query?: ServiceBooksQuery
): Promise<ServiceLineResponse> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      // eventId is excluded if the API doesn't accept it
    } : undefined
    const response = await apiClient.api.putServiceBooksUpdate(lineId, String(lineId), data, normalizedQuery)
    const responseAny = response as unknown as { data?: { data?: ServiceLineResponse } | ServiceLineResponse } | ServiceLineResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ServiceLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as ServiceLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ServiceLineResponse
    }
    throw new Error('Invalid response format from update service line endpoint')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update service line')
  }
}

/**
 * Update multiple service lines (bulk)
 */
export const updateServiceLinesBulk = async (
  data: ServiceLineUpdateRequest[],
  query?: { clientId?: string; userType?: UserType; eventId?: number }
): Promise<void> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    await apiClient.api.putServiceBooksUpdateAll(data, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update service lines')
  }
}

/**
 * Delete a service line
 */
export const deleteServiceLine = async (
  lineId: number,
  query?: ServiceBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.deleteServiceBooksDelete(lineId, String(lineId), normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete service line')
  }
}

/**
 * Delete multiple service lines (bulk)
 */
export const deleteServiceLinesBulk = async (
  lineIds: number[],
  query?: { value?: boolean; clientId?: string; userType?: UserType; eventId?: number }
): Promise<void> => {
  try {
    const normalizedQuery = query ? {
      value: query.value,
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    await apiClient.api.deleteServiceBooksDeleteAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete service lines')
  }
}

/**
 * Toggle service line done status
 */
export const toggleServiceLineDone = async (
  lineId: number,
  query?: ServiceBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.putServiceBooksDone(lineId, String(lineId), normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle service line done status')
  }
}

/**
 * Toggle service line favorite status
 */
export const toggleServiceLineFavorite = async (
  lineId: number,
  query?: ServiceBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.putServiceBooksFavorite(lineId, String(lineId), normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle service line favorite status')
  }
}

/**
 * Get custom filtered service lines
 */
export const getServiceLinesCustom = async (
  isDeleted: boolean,
  isDone: boolean,
  isFavorite: boolean,
  query?: ServiceBooksQuery
): Promise<ServiceLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getServiceBooksGetAllCustom(isDeleted, isDone, isFavorite, normalizedQuery)
    const responseAny = response as unknown as { data?: ServiceLineResponse[] | { data?: ServiceLineResponse[] } } | ServiceLineResponse[]
    
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch custom service lines')
  }
}

/**
 * Get done service lines
 */
export const getServiceLinesDone = async (
  query?: ServiceBooksQuery
): Promise<ServiceLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getServiceBooksGetAllDone(normalizedQuery)
    const responseAny = response as unknown as { data?: ServiceLineResponse[] | { data?: ServiceLineResponse[] } } | ServiceLineResponse[]
    
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch done service lines')
  }
}

/**
 * Get not done service lines
 */
export const getServiceLinesNotDone = async (
  query?: { clientId?: string; userType?: UserType; eventId?: number }
): Promise<ServiceLineResponse[]> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    const response = await apiClient.api.getServiceBooksGetAllNotDone(normalizedQuery)
    const responseAny = response as unknown as { data?: ServiceLineResponse[] | { data?: ServiceLineResponse[] } } | ServiceLineResponse[]
    
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not done service lines')
  }
}

/**
 * Get favorite service lines
 */
export const getServiceLinesFavorite = async (
  query?: ServiceBooksQuery
): Promise<ServiceLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getServiceBooksGetAllFavorite(normalizedQuery)
    const responseAny = response as unknown as { data?: ServiceLineResponse[] | { data?: ServiceLineResponse[] } } | ServiceLineResponse[]
    
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch favorite service lines')
  }
}

/**
 * Get not favorite service lines
 */
export const getServiceLinesNotFavorite = async (
  query?: { clientId?: string; userType?: UserType; eventId?: number }
): Promise<ServiceLineResponse[]> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    const response = await apiClient.api.getServiceBooksGetAllNotFavorite(normalizedQuery)
    const responseAny = response as unknown as { data?: ServiceLineResponse[] | { data?: ServiceLineResponse[] } } | ServiceLineResponse[]
    
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not favorite service lines')
  }
}

/**
 * Get deleted service lines
 */
export const getServiceLinesDeleted = async (
  query?: ServiceBooksQuery
): Promise<ServiceLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getServiceBooksGetAllDelete(normalizedQuery)
    const responseAny = response as unknown as { data?: ServiceLineResponse[] | { data?: ServiceLineResponse[] } } | ServiceLineResponse[]
    
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch deleted service lines')
  }
}

/**
 * Get not deleted service lines
 */
export const getServiceLinesNotDeleted = async (
  query?: ServiceBooksQuery
): Promise<ServiceLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getServiceBooksGetAllNotDelete(normalizedQuery)
    const responseAny = response as unknown as { data?: ServiceLineResponse[] | { data?: ServiceLineResponse[] } } | ServiceLineResponse[]
    
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not deleted service lines')
  }
}

/**
 * Mark multiple service lines as done (bulk)
 */
export const markServiceLinesDoneBulk = async (
  lineIds: number[],
  query?: { value?: boolean; clientId?: string; userType?: UserType; eventId?: number }
): Promise<void> => {
  try {
    const normalizedQuery = query ? {
      value: query.value,
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    await apiClient.api.putServiceBooksDoneAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to mark service lines as done')
  }
}

/**
 * Mark multiple service lines as favorite (bulk)
 */
export const favoriteServiceLinesBulk = async (
  lineIds: number[],
  query?: { value?: boolean; clientId?: string; userType?: UserType; eventId?: number }
): Promise<void> => {
  try {
    const normalizedQuery = query ? {
      value: query.value,
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    await apiClient.api.putServiceBooksFavoriteAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to favorite service lines')
  }
}

/**
 * Get all service line categories
 */
export const getServiceCategories = async (
  query?: { clientId?: string }
): Promise<ServiceLineCategoryResponse[]> => {
  try {
    const response = await apiClient.api.getServiceBooksGetAllCategories(query)
    const responseAny = response as unknown as { data?: ServiceLineCategoryResponse[] | { data?: ServiceLineCategoryResponse[] } } | ServiceLineCategoryResponse[]
    
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch service categories')
  }
}

/**
 * Create a service line category
 */
/**
 * Get service line category by ID
 */
export const getServiceCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<ServiceLineCategoryResponse | null> => {
  try {
    const response = await apiClient.api.getServiceBooksGetCategory(categoryId, query)
    const responseAny = response as unknown as { data?: { data?: ServiceLineCategoryResponse } | ServiceLineCategoryResponse } | ServiceLineCategoryResponse
    
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ServiceLineCategoryResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as ServiceLineCategoryResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ServiceLineCategoryResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch service category')
  }
}

/**
 * Update a service line category
 */
export const updateServiceCategory = async (
  categoryId: number,
  data: ServiceLineCategoryUpdateRequest,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.putServiceBooksUpdateCategory(categoryId, data, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update service category')
  }
}

/**
 * Delete a service line category
 */
export const deleteServiceCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.deleteServiceBooksDeleteCategory(categoryId, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete service category')
  }
}
