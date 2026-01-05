/**
 * GuestBooks API Functions
 * API service for managing guest books and lines
 */

import { apiClient } from '@/services/api/apiClient'
import type {
  GuestBookResponse,
  GuestLineResponse,
  GuestLineCategoryResponse,
} from '@/types/responses'
import type {
  GuestBookRequest,
  GuestLineRequest,
  GuestLineUpdateRequest,
  GuestLineCategoryRequest,
  GuestLineCategoryUpdateRequest,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'

export interface GuestBooksQuery {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Normalize query parameters - set clientId and userType to null, keep eventId
 */
const normalizeQuery = (query?: GuestBooksQuery) => {
  if (!query) return undefined
  return {
    clientId: null as unknown as string | undefined,
    userType: null as unknown as UserType | undefined,
    eventId: query.eventId,
  }
}

/**
 * Initialize guest books for a client
 */
export const initGuestBooks = async (params?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<void> => {
  try {
    const normalizedParams = params
      ? {
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          eventId: params.eventId,
        }
      : undefined
    await apiClient.api.postGuestBooksInit(normalizedParams)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to initialize guest books'
    )
  }
}

/**
 * Sync guest book data
 */
export const syncGuestBook = async (
  data: GuestBookRequest,
  query?: GuestBooksQuery
): Promise<void> => {
  try {
    const params = normalizeQuery(query)

    // Log categories being sent (for debugging)
    const newCategories = data.lineCategories?.filter(cat => cat.id === 0) || []
    const existingCategories =
      data.lineCategories?.filter(cat => cat.id && cat.id > 0) || []
    console.log(
      `[API] Syncing guest book - New categories: ${newCategories.length}, Existing categories: ${existingCategories.length}`
    )
    if (newCategories.length > 0) {
      console.log(
        '[API] New categories details:',
        newCategories.map(c => ({
          name: c.name,
          guestRelevant: c.guestRelevant,
        }))
      )
    }

    await apiClient.api.postGuestBooksSyncBook(data, params)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to sync guest book'
    )
  }
}

/**
 * Get guest book
 */
export const getGuestBook = async (
  query?: GuestBooksQuery
): Promise<GuestBookResponse | null> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getGuestBooksGetBook(normalizedQuery)
    const responseAny: any = response as
      | {
          data?:
            | {
                data?: GuestBookResponse
              }
            | GuestBookResponse
        }
      | GuestBookResponse
      | {
          data?: GuestBookResponse
          success?: boolean
          statusCode?: number
        }

    // Handle different response structures
    // Case 1: { data: { data: GuestBookResponse } }
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: GuestBookResponse }).data
      }
      // Case 2: { data: GuestBookResponse } (nested in wrapper with success/statusCode)
      if (data && typeof data === 'object' && 'id' in data) {
        return data as GuestBookResponse
      }
    }
    // Case 3: Direct GuestBookResponse
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'id' in responseAny &&
      !('success' in responseAny)
    ) {
      return responseAny as GuestBookResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch guest book'
    )
  }
}

/**
 * Get all guest lines
 */
export const getGuestLines = async (
  query?: GuestBooksQuery
): Promise<GuestLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getGuestBooksGetAll(normalizedQuery)
    const responseAny: any = response as
      | {
          data?:
            | GuestLineResponse[]
            | { data?: GuestLineResponse[]; items?: GuestLineResponse[] }
        }
      | GuestLineResponse[]

    // Handle different response structures
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
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
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch guest lines'
    )
  }
}

/**
 * Get guest line by ID
 */
export const getGuestLineById = async (
  lineId: number,
  query?: { clientId?: string; eventId?: number }
): Promise<GuestLineResponse | null> => {
  try {
    const normalizedQuery = query
      ? {
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          eventId: query.eventId,
        }
      : undefined
    const response = await apiClient.api.getGuestBooksGet(
      lineId,
      String(lineId),
      normalizedQuery
    )
    const responseAny: any = response as
      | { data?: { data?: GuestLineResponse } | GuestLineResponse }
      | GuestLineResponse

    // Handle different response structures
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: GuestLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as GuestLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as GuestLineResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch guest line'
    )
  }
}

/**
 * Create a guest line
 */
export const createGuestLine = async (
  data: GuestLineRequest,
  query?: GuestBooksQuery
): Promise<GuestLineResponse> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.postGuestBooksCreate(
      data,
      normalizedQuery
    )
    const responseAny: any = response as
      | { data?: { data?: GuestLineResponse } | GuestLineResponse }
      | GuestLineResponse

    // Handle different response structures
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: GuestLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as GuestLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as GuestLineResponse
    }
    throw new Error('Invalid response format from create guest line endpoint')
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create guest line'
    )
  }
}

/**
 * Create multiple guest lines (bulk)
 */
export const createGuestLinesBulk = async (
  data: GuestLineRequest[],
  query?: GuestBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.postGuestBooksCreateAll(data, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create guest lines'
    )
  }
}

/**
 * Update a guest line
 */
export const updateGuestLine = async (
  lineId: number,
  data: GuestLineUpdateRequest,
  query?: GuestBooksQuery
): Promise<GuestLineResponse> => {
  try {
    const normalizedQuery = query
      ? {
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          // eventId is excluded if the API doesn't accept it
        }
      : undefined
    const response = await apiClient.api.putGuestBooksUpdate(
      lineId,
      String(lineId),
      data,
      normalizedQuery
    )
    const responseAny: any = response as
      | { data?: { data?: GuestLineResponse } | GuestLineResponse }
      | GuestLineResponse

    // Handle different response structures
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: GuestLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as GuestLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as GuestLineResponse
    }
    throw new Error('Invalid response format from update guest line endpoint')
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update guest line'
    )
  }
}

/**
 * Update multiple guest lines (bulk)
 */
export const updateGuestLinesBulk = async (
  data: GuestLineUpdateRequest[],
  query?: { clientId?: string; userType?: UserType; eventId?: number }
): Promise<void> => {
  try {
    const normalizedQuery = query
      ? {
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          eventId: query.eventId,
        }
      : undefined
    await apiClient.api.putGuestBooksUpdateAll(data, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update guest lines'
    )
  }
}

/**
 * Delete a guest line
 */
export const deleteGuestLine = async (
  lineId: number,
  query?: GuestBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.deleteGuestBooksDelete(
      lineId,
      String(lineId),
      normalizedQuery
    )
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete guest line'
    )
  }
}

/**
 * Delete multiple guest lines (bulk)
 */
export const deleteGuestLinesBulk = async (
  lineIds: number[],
  query?: {
    value?: boolean
    clientId?: string
    userType?: UserType
    eventId?: number
  }
): Promise<void> => {
  try {
    const normalizedQuery = query
      ? {
          value: query.value,
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          eventId: query.eventId,
        }
      : undefined
    await apiClient.api.deleteGuestBooksDeleteAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete guest lines'
    )
  }
}

/**
 * Toggle guest line done status
 */
export const toggleGuestLineDone = async (
  lineId: number,
  query?: GuestBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.putGuestBooksDone(
      lineId,
      String(lineId),
      normalizedQuery
    )
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to toggle guest line done status'
    )
  }
}

/**
 * Toggle guest line favorite status
 */
export const toggleGuestLineFavorite = async (
  lineId: number,
  query?: GuestBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.putGuestBooksFavorite(
      lineId,
      String(lineId),
      normalizedQuery
    )
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to toggle guest line favorite status'
    )
  }
}

/**
 * Get custom filtered guest lines
 */
export const getGuestLinesCustom = async (
  isDeleted: boolean,
  isDone: boolean,
  isFavorite: boolean,
  query?: GuestBooksQuery
): Promise<GuestLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getGuestBooksGetAllCustom(
      isDeleted,
      isDone,
      isFavorite,
      normalizedQuery
    )
    const responseAny: any = response as
      | { data?: GuestLineResponse[] | { data?: GuestLineResponse[] } }
      | GuestLineResponse[]

    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray(data.data)
      ) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch custom guest lines'
    )
  }
}

/**
 * Get done guest lines
 */
export const getGuestLinesDone = async (
  query?: GuestBooksQuery
): Promise<GuestLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response =
      await apiClient.api.getGuestBooksGetAllDone(normalizedQuery)
    const responseAny: any = response as
      | { data?: GuestLineResponse[] | { data?: GuestLineResponse[] } }
      | GuestLineResponse[]

    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray(data.data)
      ) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch done guest lines'
    )
  }
}

/**
 * Get not done guest lines
 */
export const getGuestLinesNotDone = async (query?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<GuestLineResponse[]> => {
  try {
    const normalizedQuery = query
      ? {
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          eventId: query.eventId,
        }
      : undefined
    const response =
      await apiClient.api.getGuestBooksGetAllNotDone(normalizedQuery)
    const responseAny: any = response as
      | { data?: GuestLineResponse[] | { data?: GuestLineResponse[] } }
      | GuestLineResponse[]

    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray(data.data)
      ) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch not done guest lines'
    )
  }
}

/**
 * Get favorite guest lines
 */
export const getGuestLinesFavorite = async (
  query?: GuestBooksQuery
): Promise<GuestLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response =
      await apiClient.api.getGuestBooksGetAllFavorite(normalizedQuery)
    const responseAny: any = response as
      | { data?: GuestLineResponse[] | { data?: GuestLineResponse[] } }
      | GuestLineResponse[]

    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray(data.data)
      ) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch favorite guest lines'
    )
  }
}

/**
 * Get not favorite guest lines
 */
export const getGuestLinesNotFavorite = async (query?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<GuestLineResponse[]> => {
  try {
    const normalizedQuery = query
      ? {
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          eventId: query.eventId,
        }
      : undefined
    const response =
      await apiClient.api.getGuestBooksGetAllNotFavorite(normalizedQuery)
    const responseAny: any = response as
      | { data?: GuestLineResponse[] | { data?: GuestLineResponse[] } }
      | GuestLineResponse[]

    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray(data.data)
      ) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch not favorite guest lines'
    )
  }
}

/**
 * Get deleted guest lines
 */
export const getGuestLinesDeleted = async (
  query?: GuestBooksQuery
): Promise<GuestLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response =
      await apiClient.api.getGuestBooksGetAllDelete(normalizedQuery)
    const responseAny: any = response as
      | { data?: GuestLineResponse[] | { data?: GuestLineResponse[] } }
      | GuestLineResponse[]

    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray(data.data)
      ) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch deleted guest lines'
    )
  }
}

/**
 * Get not deleted guest lines
 */
export const getGuestLinesNotDeleted = async (
  query?: GuestBooksQuery
): Promise<GuestLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response =
      await apiClient.api.getGuestBooksGetAllNotDelete(normalizedQuery)
    const responseAny: any = response as
      | { data?: GuestLineResponse[] | { data?: GuestLineResponse[] } }
      | GuestLineResponse[]

    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray(data.data)
      ) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch not deleted guest lines'
    )
  }
}

/**
 * Mark multiple guest lines as done (bulk)
 */
export const markGuestLinesDoneBulk = async (
  lineIds: number[],
  query?: {
    value?: boolean
    clientId?: string
    userType?: UserType
    eventId?: number
  }
): Promise<void> => {
  try {
    const normalizedQuery = query
      ? {
          value: query.value,
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          eventId: query.eventId,
        }
      : undefined
    await apiClient.api.putGuestBooksDoneAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to mark guest lines as done'
    )
  }
}

/**
 * Mark multiple guest lines as favorite (bulk)
 */
export const favoriteGuestLinesBulk = async (
  lineIds: number[],
  query?: {
    value?: boolean
    clientId?: string
    userType?: UserType
    eventId?: number
  }
): Promise<void> => {
  try {
    const normalizedQuery = query
      ? {
          value: query.value,
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          eventId: query.eventId,
        }
      : undefined
    await apiClient.api.putGuestBooksFavoriteAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to favorite guest lines'
    )
  }
}

/**
 * Get all guest line categories
 */
export const getGuestCategories = async (query?: {
  clientId?: string
}): Promise<GuestLineCategoryResponse[]> => {
  try {
    const response = await apiClient.api.getGuestBooksGetAllCategories(query)
    const responseAny: any = response as
      | {
          data?:
            | GuestLineCategoryResponse[]
            | { data?: GuestLineCategoryResponse[] }
        }
      | GuestLineCategoryResponse[]

    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data
      }
      if (
        data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray(data.data)
      ) {
        return data.data
      }
    }
    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch guest categories'
    )
  }
}

/**
 * Create a guest line category
 */
export const createGuestCategory = async (
  data: GuestLineCategoryRequest,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.postGuestBooksCreateCategory(data, query)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create guest category'
    )
  }
}

/**
 * Get guest line category by ID
 */
export const getGuestCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<GuestLineCategoryResponse | null> => {
  try {
    const response = await apiClient.api.getGuestBooksGetCategory(
      categoryId,
      query
    )
    const responseAny: any = response as
      | {
          data?:
            | { data?: GuestLineCategoryResponse }
            | GuestLineCategoryResponse
        }
      | GuestLineCategoryResponse

    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: GuestLineCategoryResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as GuestLineCategoryResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as GuestLineCategoryResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch guest category'
    )
  }
}

/**
 * Update a guest line category
 */
export const updateGuestCategory = async (
  categoryId: number,
  data: GuestLineCategoryUpdateRequest,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.putGuestBooksUpdateCategory(categoryId, data, query)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update guest category'
    )
  }
}

/**
 * Delete a guest line category
 */
export const deleteGuestCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.deleteGuestBooksDeleteCategory(categoryId, query)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete guest category'
    )
  }
}
