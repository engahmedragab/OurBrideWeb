/**
 * OccasionBooks API Functions
 * API service for managing occasion books and lines
 */

import { apiClient } from '@/services/api/apiClient'
import type { OccasionBookResponse, OccasionLineResponse, OccasionLineCategoryResponse } from '@/types/responses'
import type {
  OccasionBookRequest,
  OccasionLineRequest,
  OccasionLineUpdateRequest,
  OccasionLineCategoryRequest,
  OccasionLineCategoryUpdateRequest,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'

export interface OccasionBooksQuery {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Initialize occasion books for a client
 */
export const initOccasionBooks = async (params?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<void> => {
  try {
    // Extract eventId and pass other params to API
    const { eventId, ...apiParams } = params || {}
    await apiClient.api.postOccasionsBooksInit(apiParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize occasion books')
  }
}

/**
 * Sync occasion book data
 */
export const syncOccasionBook = async (
  data: OccasionBookRequest,
  query?: OccasionBooksQuery
): Promise<void> => {
  try {
    const params = query ? {
      clientId: query.clientId,
      userType: query.userType,
      eventId: query.eventId,
    } : undefined
    await apiClient.api.postOccasionsBooksSyncBook(data, params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to sync occasion book')
  }
}

/**
 * Get occasion book
 */
export const getOccasionBook = async (
  query?: OccasionBooksQuery
): Promise<OccasionBookResponse | null> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGetBook(query)
    const responseAny = response as unknown
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as OccasionBookResponse
    }
    if (responseAny?.data) {
      return responseAny.data as OccasionBookResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as OccasionBookResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch occasion book')
  }
}

/**
 * Get all occasion lines
 */
export const getOccasionLines = async (
  query?: OccasionBooksQuery
): Promise<OccasionLineResponse[]> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGetAll(query)
    const responseAny = response as unknown
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as OccasionLineResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as OccasionLineResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as OccasionLineResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as OccasionLineResponse[]
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch occasion lines')
  }
}

/**
 * Get occasion line by ID
 */
export const getOccasionLineById = async (
  lineId: number,
  query?: { clientId?: string; eventId?: number }
): Promise<OccasionLineResponse | null> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGet(lineId, String(lineId), query)
    const responseAny = response as unknown
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as OccasionLineResponse
    }
    if (responseAny?.data) {
      return responseAny.data as OccasionLineResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as OccasionLineResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch occasion line')
  }
}

/**
 * Create an occasion line
 */
export const createOccasionLine = async (
  data: OccasionLineRequest,
  query?: OccasionBooksQuery
): Promise<OccasionLineResponse> => {
  try {
    const response = await apiClient.api.postOccasionsBooksCreate(data, query)
    const responseAny = response as unknown
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as OccasionLineResponse
    }
    if (responseAny?.data) {
      return responseAny.data as OccasionLineResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as OccasionLineResponse
    }
    throw new Error('Invalid response format from create occasion line endpoint')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create occasion line')
  }
}

/**
 * Create multiple occasion lines (bulk)
 */
export const createOccasionLinesBulk = async (
  data: OccasionLineRequest[],
  query?: OccasionBooksQuery
): Promise<void> => {
  try {
    await apiClient.api.postOccasionsBooksCreateAll(data, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create occasion lines')
  }
}

/**
 * Update an occasion line
 */
export const updateOccasionLine = async (
  lineId: number,
  data: OccasionLineUpdateRequest,
  query?: OccasionBooksQuery
): Promise<OccasionLineResponse> => {
  try {
    // Extract eventId as putOccasionsBooksUpdate doesn't accept it in query
    const { eventId, ...apiQuery } = query || {}
    const response = await apiClient.api.putOccasionsBooksUpdate(lineId, String(lineId), data, apiQuery)
    const responseAny = response as unknown
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as OccasionLineResponse
    }
    if (responseAny?.data) {
      return responseAny.data as OccasionLineResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as OccasionLineResponse
    }
    throw new Error('Invalid response format from update occasion line endpoint')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update occasion line')
  }
}

/**
 * Update multiple occasion lines (bulk)
 */
export const updateOccasionLinesBulk = async (
  data: OccasionLineUpdateRequest[],
  query?: { clientId?: string; userType?: UserType }
): Promise<void> => {
  try {
    await apiClient.api.putOccasionsBooksUpdateAll(data, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update occasion lines')
  }
}

/**
 * Delete an occasion line
 */
export const deleteOccasionLine = async (
  lineId: number,
  query?: OccasionBooksQuery
): Promise<void> => {
  try {
    await apiClient.api.deleteOccasionsBooksDelete(lineId, String(lineId), query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete occasion line')
  }
}

/**
 * Delete multiple occasion lines (bulk)
 */
export const deleteOccasionLinesBulk = async (
  lineIds: number[],
  query?: { value?: boolean; clientId?: string; userType?: UserType; eventId?: number }
): Promise<void> => {
  try {
    await apiClient.api.deleteOccasionsBooksDeleteAll(lineIds, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete occasion lines')
  }
}

/**
 * Toggle occasion line done status
 */
export const toggleOccasionLineDone = async (
  lineId: number,
  query?: OccasionBooksQuery
): Promise<void> => {
  try {
    await apiClient.api.putOccasionsBooksDone(lineId, String(lineId), query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle occasion line done status')
  }
}

/**
 * Toggle occasion line favorite status
 */
export const toggleOccasionLineFavorite = async (
  lineId: number,
  query?: OccasionBooksQuery
): Promise<void> => {
  try {
    await apiClient.api.putOccasionsBooksFavorite(lineId, String(lineId), query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle occasion line favorite status')
  }
}

/**
 * Get custom filtered occasion lines
 */
export const getOccasionLinesCustom = async (
  isDeleted: boolean,
  isDone: boolean,
  isFavorite: boolean,
  query?: OccasionBooksQuery
): Promise<OccasionLineResponse[]> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGetAllCustom(isDeleted, isDone, isFavorite, query)
    const responseAny = response as unknown
    
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as OccasionLineResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as OccasionLineResponse[]
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch custom occasion lines')
  }
}

/**
 * Get done occasion lines
 */
export const getOccasionLinesDone = async (
  query?: OccasionBooksQuery
): Promise<OccasionLineResponse[]> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGetAllDone(query)
    const responseAny = response as unknown
    
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as OccasionLineResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as OccasionLineResponse[]
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch done occasion lines')
  }
}

/**
 * Get not done occasion lines
 */
export const getOccasionLinesNotDone = async (
  query?: { clientId?: string; userType?: UserType }
): Promise<OccasionLineResponse[]> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGetAllNotDone(query)
    const responseAny = response as unknown
    
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as OccasionLineResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as OccasionLineResponse[]
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not done occasion lines')
  }
}

/**
 * Get favorite occasion lines
 */
export const getOccasionLinesFavorite = async (
  query?: OccasionBooksQuery
): Promise<OccasionLineResponse[]> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGetAllFavorite(query)
    const responseAny = response as unknown
    
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as OccasionLineResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as OccasionLineResponse[]
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch favorite occasion lines')
  }
}

/**
 * Get not favorite occasion lines
 */
export const getOccasionLinesNotFavorite = async (
  query?: { clientId?: string; userType?: UserType }
): Promise<OccasionLineResponse[]> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGetAllNotFavorite(query)
    const responseAny = response as unknown
    
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as OccasionLineResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as OccasionLineResponse[]
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not favorite occasion lines')
  }
}

/**
 * Get deleted occasion lines
 */
export const getOccasionLinesDeleted = async (
  query?: OccasionBooksQuery
): Promise<OccasionLineResponse[]> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGetAllDelete(query)
    const responseAny = response as unknown
    
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as OccasionLineResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as OccasionLineResponse[]
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch deleted occasion lines')
  }
}

/**
 * Get not deleted occasion lines
 */
export const getOccasionLinesNotDeleted = async (
  query?: OccasionBooksQuery
): Promise<OccasionLineResponse[]> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGetAllNotDelete(query)
    const responseAny = response as unknown
    
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as OccasionLineResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as OccasionLineResponse[]
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not deleted occasion lines')
  }
}

/**
 * Mark multiple occasion lines as done (bulk)
 */
export const markOccasionLinesDoneBulk = async (
  lineIds: number[],
  query?: { value?: boolean; clientId?: string; userType?: UserType }
): Promise<void> => {
  try {
    await apiClient.api.putOccasionsBooksDoneAll(lineIds, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to mark occasion lines as done')
  }
}

/**
 * Mark multiple occasion lines as favorite (bulk)
 */
export const favoriteOccasionLinesBulk = async (
  lineIds: number[],
  query?: { value?: boolean; clientId?: string; userType?: UserType; eventId?: number }
): Promise<void> => {
  try {
    await apiClient.api.putOccasionsBooksFavoriteAll(lineIds, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to favorite occasion lines')
  }
}

/**
 * Get all occasion line categories
 */
export const getOccasionCategories = async (
  query?: { clientId?: string }
): Promise<OccasionLineResponse[]> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGetAllCategories(query)
    const responseAny = response as unknown
    
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data
    }
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch occasion categories')
  }
}

/**
 * Create an occasion line category
 */
export const createOccasionCategory = async (
  data: OccasionLineCategoryRequest,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.postOccasionsBooksCreateCategory(data, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create occasion category')
  }
}

/**
 * Get occasion line category by ID
 */
export const getOccasionCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<OccasionLineCategoryResponse | null> => {
  try {
    const response = await apiClient.api.getOccasionsBooksGetCategory(categoryId, query)
    const responseAny = response as unknown
    
    if (responseAny?.data?.data) {
      return responseAny.data.data
    }
    if (responseAny?.data) {
      return responseAny.data
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch occasion category')
  }
}

/**
 * Update an occasion line category
 */
export const updateOccasionCategory = async (
  categoryId: number,
  data: OccasionLineCategoryUpdateRequest,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.putOccasionsBooksUpdateCategory(categoryId, data, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update occasion category')
  }
}

/**
 * Delete an occasion line category
 */
export const deleteOccasionCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.deleteOccasionsBooksDeleteCategory(categoryId, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete occasion category')
  }
}
