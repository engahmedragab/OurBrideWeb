/**
 * ItemBooks API Functions
 * API service for managing item books and lines
 */

import { apiClient } from '@/services/api/apiClient'
import type { ItemBookResponse, ItemLineResponse, ItemLineCategoryResponse } from '@/types/responses'
import type {
  ItemBookRequest,
  ItemLineRequest,
  ItemLineUpdateRequest,
  ItemLineCategoryRequest,
  ItemLineCategoryUpdateRequest,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'
import { ContentType } from '@/../client/common/api/gen/ourbride-api'
import type { SyncBookDeltaRequest, SyncBookDeltaResponse } from '@/types/syncDelta'

export interface ItemBooksQuery {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Normalize query parameters - set clientId and userType to null, keep eventId
 */
const normalizeQuery = (query?: ItemBooksQuery) => {
  if (!query) return undefined
  return {
    clientId: null as unknown as string | undefined,
    userType: null as unknown as UserType | undefined,
    eventId: query.eventId,
  }
}

/**
 * Initialize item books for a client
 */
export const initItemBooks = async (params?: {
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
    await apiClient.api.postItemBooksInit(normalizedParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize item books')
  }
}

/**
 * Add models to item books
 */
export const addItemBookModels = async (params?: {
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
    await apiClient.api.postItemBooksAddModels(normalizedParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add item book models')
  }
}

/**
 * Sync item book data
 */
export const syncItemBook = async (
  data: ItemBookRequest,
  query?: ItemBooksQuery
): Promise<void> => {
  try {
    const params = normalizeQuery(query)
    await apiClient.api.postItemBooksSyncBook(data, params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to sync item book')
  }
}

/**
 * Sync item book data (delta)
 */
export const syncItemBookDelta = async (
  data: SyncBookDeltaRequest<ItemLineRequest, ItemLineCategoryRequest>,
  query?: ItemBooksQuery
): Promise<SyncBookDeltaResponse<ItemBookResponse | null>> => {
  try {
    const params = normalizeQuery(query)
    const response = await apiClient.api.postItemBooksSyncBookDelta(data, params)
    const responseAny: any = response as { data?: { data?: unknown } | unknown } | unknown
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as SyncBookDeltaResponse<ItemBookResponse | null>
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to sync item book (delta)')
  }
}

/**
 * Get item book
 */
export const getItemBook = async (
  query?: ItemBooksQuery
): Promise<ItemBookResponse | null> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getItemBooksGetBook(normalizedQuery)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as ItemBookResponse
    }
    if (responseAny?.data) {
      return responseAny.data as ItemBookResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ItemBookResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch item book')
  }
}

/**
 * Get all item lines
 */
export const getItemLines = async (
  query?: ItemBooksQuery
): Promise<ItemLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getItemBooksGetAll(normalizedQuery)
    const responseAny: any = response as { data?: ItemLineResponse[] | { data?: ItemLineResponse[]; items?: ItemLineResponse[] } } | ItemLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch item lines')
  }
}

/**
 * Get item line by ID
 */
export const getItemLineById = async (
  lineId: number,
  query?: { clientId?: string; eventId?: number }
): Promise<ItemLineResponse | null> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    const response = await apiClient.api.getItemBooksGet(lineId, String(lineId), normalizedQuery)
    const responseAny: any = response as { data?: { data?: ItemLineResponse } | ItemLineResponse } | ItemLineResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ItemLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as ItemLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ItemLineResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch item line')
  }
}

/**
 * Create an item line
 */
export const createItemLine = async (
  data: ItemLineRequest,
  query?: ItemBooksQuery
): Promise<ItemLineResponse> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.postItemBooksCreate(data, normalizedQuery)
    const responseAny: any = response as { data?: { data?: ItemLineResponse } | ItemLineResponse } | ItemLineResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ItemLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as ItemLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ItemLineResponse
    }
    throw new Error('Invalid response format from create item line endpoint')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create item line')
  }
}

/**
 * Create multiple item lines (bulk)
 */
export const createItemLinesBulk = async (
  data: ItemLineRequest[],
  query?: ItemBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.postItemBooksCreateAll(data, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create item lines')
  }
}

/**
 * Update an item line
 */
export const updateItemLine = async (
  lineId: number,
  data: ItemLineUpdateRequest,
  query?: ItemBooksQuery
): Promise<ItemLineResponse> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      // eventId is excluded if the API doesn't accept it
    } : undefined
    const response = await apiClient.api.putItemBooksUpdate(lineId, String(lineId), data, normalizedQuery)
    const responseAny: any = response as { data?: { data?: ItemLineResponse } | ItemLineResponse } | ItemLineResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ItemLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as ItemLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ItemLineResponse
    }
    throw new Error('Invalid response format from update item line endpoint')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update item line')
  }
}

/**
 * Update multiple item lines (bulk)
 */
export const updateItemLinesBulk = async (
  data: ItemLineUpdateRequest[],
  query?: { clientId?: string; userType?: UserType; eventId?: number }
): Promise<void> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    await apiClient.api.putItemBooksUpdateAll(data, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update item lines')
  }
}

/**
 * Delete an item line
 */
export const deleteItemLine = async (
  lineId: number,
  query?: ItemBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.deleteItemBooksDelete(lineId, String(lineId), normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete item line')
  }
}

/**
 * Delete multiple item lines (bulk)
 */
export const deleteItemLinesBulk = async (
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
    await apiClient.api.deleteItemBooksDeleteAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete item lines')
  }
}

/**
 * Toggle item line done status
 */
export const toggleItemLineDone = async (
  lineId: number,
  query?: ItemBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.putItemBooksDone(lineId, String(lineId), normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle item line done status')
  }
}

/**
 * Toggle item line favorite status
 */
export const toggleItemLineFavorite = async (
  lineId: number,
  query?: ItemBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.putItemBooksFavorite(lineId, String(lineId), normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle item line favorite status')
  }
}

/**
 * Get custom filtered item lines
 */
export const getItemLinesCustom = async (
  isDeleted: boolean,
  isDone: boolean,
  isFavorite: boolean,
  query?: ItemBooksQuery
): Promise<ItemLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getItemBooksGetAllCustom(isDeleted, isDone, isFavorite, normalizedQuery)
    const responseAny: any = response as { data?: ItemLineResponse[] | { data?: ItemLineResponse[] } } | ItemLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch custom item lines')
  }
}

/**
 * Get done item lines
 */
export const getItemLinesDone = async (
  query?: ItemBooksQuery
): Promise<ItemLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getItemBooksGetAllDone(normalizedQuery)
    const responseAny: any = response as { data?: ItemLineResponse[] | { data?: ItemLineResponse[] } } | ItemLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch done item lines')
  }
}

/**
 * Get not done item lines
 */
export const getItemLinesNotDone = async (
  query?: { clientId?: string; userType?: UserType; eventId?: number }
): Promise<ItemLineResponse[]> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    const response = await apiClient.api.getItemBooksGetAllNotDone(normalizedQuery)
    const responseAny: any = response as { data?: ItemLineResponse[] | { data?: ItemLineResponse[] } } | ItemLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not done item lines')
  }
}

/**
 * Get favorite item lines
 */
export const getItemLinesFavorite = async (
  query?: ItemBooksQuery
): Promise<ItemLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getItemBooksGetAllFavorite(normalizedQuery)
    const responseAny: any = response as { data?: ItemLineResponse[] | { data?: ItemLineResponse[] } } | ItemLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch favorite item lines')
  }
}

/**
 * Get not favorite item lines
 */
export const getItemLinesNotFavorite = async (
  query?: { clientId?: string; userType?: UserType; eventId?: number }
): Promise<ItemLineResponse[]> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    const response = await apiClient.api.getItemBooksGetAllNotFavorite(normalizedQuery)
    const responseAny: any = response as { data?: ItemLineResponse[] | { data?: ItemLineResponse[] } } | ItemLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not favorite item lines')
  }
}

/**
 * Get deleted item lines
 */
export const getItemLinesDeleted = async (
  query?: ItemBooksQuery
): Promise<ItemLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getItemBooksGetAllDelete(normalizedQuery)
    const responseAny: any = response as { data?: ItemLineResponse[] | { data?: ItemLineResponse[] } } | ItemLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch deleted item lines')
  }
}

/**
 * Get not deleted item lines
 */
export const getItemLinesNotDeleted = async (
  query?: ItemBooksQuery
): Promise<ItemLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getItemBooksGetAllNotDelete(normalizedQuery)
    const responseAny: any = response as { data?: ItemLineResponse[] | { data?: ItemLineResponse[] } } | ItemLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not deleted item lines')
  }
}

/**
 * Mark multiple item lines as done (bulk)
 */
export const markItemLinesDoneBulk = async (
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
    await apiClient.api.putItemBooksDoneAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to mark item lines as done')
  }
}

/**
 * Mark multiple item lines as favorite (bulk)
 */
export const favoriteItemLinesBulk = async (
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
    await apiClient.api.putItemBooksFavoriteAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to favorite item lines')
  }
}

/**
 * Get all item line categories
 */
export const getItemCategories = async (
  query?: { clientId?: string }
): Promise<ItemLineCategoryResponse[]> => {
  try {
    const response = await apiClient.api.getItemBooksGetAllCategories(query)
    const responseAny: any = response as { data?: ItemLineCategoryResponse[] | { data?: ItemLineCategoryResponse[] } } | ItemLineCategoryResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch item categories')
  }
}

/**
 * Create an item line category
 */
export const createItemCategory = async (
  data: ItemLineCategoryRequest,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.postItemBooksCreateCategory(data, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create item category')
  }
}

/**
 * Get item line category by ID
 */
export const getItemCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<ItemLineCategoryResponse | null> => {
  try {
    const response = await apiClient.api.getItemBooksGetCategory(categoryId, query)
    const responseAny: any = response as { data?: { data?: ItemLineCategoryResponse } | ItemLineCategoryResponse } | ItemLineCategoryResponse
    
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: ItemLineCategoryResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as ItemLineCategoryResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as ItemLineCategoryResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch item category')
  }
}

/**
 * Update an item line category
 */
export const updateItemCategory = async (
  categoryId: number,
  data: ItemLineCategoryUpdateRequest,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.putItemBooksUpdateCategory(categoryId, data, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update item category')
  }
}

/**
 * Delete an item line category
 */
export const deleteItemCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.deleteItemBooksDeleteCategory(categoryId, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete item category')
  }
}
