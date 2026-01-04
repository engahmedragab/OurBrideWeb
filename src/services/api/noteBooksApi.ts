/**
 * NoteBooks API Functions
 * API service for managing note books and lines
 */

import { apiClient } from '@/services/api/apiClient'
import type { NoteBookResponse, NoteLineResponse, NoteLineCategoryResponse } from '@/types/responses'
import type {
  NoteBookRequest,
  NoteLineRequest,
  NoteLineUpdateRequest,
  NoteLineCategoryRequest,
  NoteLineCategoryUpdateRequest,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'

export interface NoteBooksQuery {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Normalize query parameters - remove null/empty values, keep only defined values
 */
const normalizeQuery = (query?: NoteBooksQuery) => {
  if (!query) return undefined
  const normalized: any = {}
  if (query.eventId !== undefined && query.eventId !== null) {
    normalized.eventId = query.eventId
  }
  if (query.userType !== undefined && query.userType !== null) {
    normalized.userType = query.userType
  }
  if (query.clientId !== undefined && query.clientId !== null && query.clientId.trim() !== '') {
    normalized.clientId = query.clientId
  }
  return Object.keys(normalized).length > 0 ? normalized : undefined
}

/**
 * Initialize note books for a client
 */
export const initNoteBooks = async (params?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<void> => {
  try {
    const normalizedParams = normalizeQuery(params)
    await apiClient.api.postNoteBooksInit(normalizedParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize note books')
  }
}

/**
 * Sync note book data
 */
export const syncNoteBook = async (
  data: NoteBookRequest,
  query?: NoteBooksQuery
): Promise<void> => {
  try {
    const params = normalizeQuery(query)
    await apiClient.api.postNoteBooksSyncBook(data, params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to sync note book')
  }
}

/**
 * Get note book
 */
export const getNoteBook = async (
  query?: NoteBooksQuery
): Promise<NoteBookResponse | null> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getNoteBooksGetBook(normalizedQuery)
    const responseAny: any = response as { data?: { data?: NoteBookResponse } | NoteBookResponse } | NoteBookResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: NoteBookResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as NoteBookResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as NoteBookResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch note book')
  }
}

/**
 * Get all note lines
 */
export const getNoteLines = async (
  query?: NoteBooksQuery
): Promise<NoteLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getNoteBooksGetAll(normalizedQuery)
    const responseAny: any = response as { data?: NoteLineResponse[] | { data?: NoteLineResponse[]; items?: NoteLineResponse[] } } | NoteLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch note lines')
  }
}

/**
 * Get note line by ID
 */
export const getNoteLineById = async (
  lineId: number,
  query?: { clientId?: string; eventId?: number }
): Promise<NoteLineResponse | null> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    const response = await apiClient.api.getNoteBooksGet(lineId, String(lineId), normalizedQuery)
    const responseAny: any = response as { data?: { data?: NoteLineResponse } | NoteLineResponse } | NoteLineResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: NoteLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as NoteLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as NoteLineResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch note line')
  }
}

/**
 * Create a note line
 */
export const createNoteLine = async (
  data: NoteLineRequest,
  query?: NoteBooksQuery
): Promise<NoteLineResponse> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.postNoteBooksCreate(data, normalizedQuery)
    const responseAny: any = response as { data?: { data?: NoteLineResponse } | NoteLineResponse } | NoteLineResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: NoteLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as NoteLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as NoteLineResponse
    }
    throw new Error('Invalid response format from create note line endpoint')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create note line')
  }
}

/**
 * Create multiple note lines (bulk)
 */
export const createNoteLinesBulk = async (
  data: NoteLineRequest[],
  query?: NoteBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.postNoteBooksCreateAll(data, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create note lines')
  }
}

/**
 * Update a note line
 */
export const updateNoteLine = async (
  lineId: number,
  data: NoteLineUpdateRequest,
  query?: NoteBooksQuery
): Promise<NoteLineResponse> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      // eventId is excluded if the API doesn't accept it
    } : undefined
    const response = await apiClient.api.putNoteBooksUpdate(lineId, String(lineId), data, normalizedQuery)
    const responseAny: any = response as { data?: { data?: NoteLineResponse } | NoteLineResponse } | NoteLineResponse
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: NoteLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as NoteLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as NoteLineResponse
    }
    throw new Error('Invalid response format from update note line endpoint')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update note line')
  }
}

/**
 * Update multiple note lines (bulk)
 */
export const updateNoteLinesBulk = async (
  data: NoteLineUpdateRequest[],
  query?: { clientId?: string; userType?: UserType; eventId?: number }
): Promise<void> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    await apiClient.api.putNoteBooksUpdateAll(data, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update note lines')
  }
}

/**
 * Delete a note line
 */
export const deleteNoteLine = async (
  lineId: number,
  query?: NoteBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.deleteNoteBooksDelete(lineId, String(lineId), normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete note line')
  }
}

/**
 * Delete multiple note lines (bulk)
 */
export const deleteNoteLinesBulk = async (
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
    await apiClient.api.deleteNoteBooksDeleteAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete note lines')
  }
}

/**
 * Toggle note line done status
 */
export const toggleNoteLineDone = async (
  lineId: number,
  query?: NoteBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.putNoteBooksDone(lineId, String(lineId), normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle note line done status')
  }
}

/**
 * Toggle note line favorite status
 */
export const toggleNoteLineFavorite = async (
  lineId: number,
  query?: NoteBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.putNoteBooksFavorite(lineId, String(lineId), normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to toggle note line favorite status')
  }
}

/**
 * Get custom filtered note lines
 */
export const getNoteLinesCustom = async (
  isDeleted: boolean,
  isDone: boolean,
  isFavorite: boolean,
  query?: NoteBooksQuery
): Promise<NoteLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getNoteBooksGetAllCustom(isDeleted, isDone, isFavorite, normalizedQuery)
    const responseAny: any = response as { data?: NoteLineResponse[] | { data?: NoteLineResponse[] } } | NoteLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch custom note lines')
  }
}

/**
 * Get done note lines
 */
export const getNoteLinesDone = async (
  query?: NoteBooksQuery
): Promise<NoteLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getNoteBooksGetAllDone(normalizedQuery)
    const responseAny: any = response as { data?: NoteLineResponse[] | { data?: NoteLineResponse[] } } | NoteLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch done note lines')
  }
}

/**
 * Get not done note lines
 */
export const getNoteLinesNotDone = async (
  query?: { clientId?: string; userType?: UserType; eventId?: number }
): Promise<NoteLineResponse[]> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    const response = await apiClient.api.getNoteBooksGetAllNotDone(normalizedQuery)
    const responseAny: any = response as { data?: NoteLineResponse[] | { data?: NoteLineResponse[] } } | NoteLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not done note lines')
  }
}

/**
 * Get favorite note lines
 */
export const getNoteLinesFavorite = async (
  query?: NoteBooksQuery
): Promise<NoteLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getNoteBooksGetAllFavorite(normalizedQuery)
    const responseAny: any = response as { data?: NoteLineResponse[] | { data?: NoteLineResponse[] } } | NoteLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch favorite note lines')
  }
}

/**
 * Get not favorite note lines
 */
export const getNoteLinesNotFavorite = async (
  query?: { clientId?: string; userType?: UserType; eventId?: number }
): Promise<NoteLineResponse[]> => {
  try {
    const normalizedQuery = query ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: query.eventId,
    } : undefined
    const response = await apiClient.api.getNoteBooksGetAllNotFavorite(normalizedQuery)
    const responseAny: any = response as { data?: NoteLineResponse[] | { data?: NoteLineResponse[] } } | NoteLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not favorite note lines')
  }
}

/**
 * Get deleted note lines
 */
export const getNoteLinesDeleted = async (
  query?: NoteBooksQuery
): Promise<NoteLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getNoteBooksGetAllDelete(normalizedQuery)
    const responseAny: any = response as { data?: NoteLineResponse[] | { data?: NoteLineResponse[] } } | NoteLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch deleted note lines')
  }
}

/**
 * Get not deleted note lines
 */
export const getNoteLinesNotDeleted = async (
  query?: NoteBooksQuery
): Promise<NoteLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getNoteBooksGetAllNotDelete(normalizedQuery)
    const responseAny: any = response as { data?: NoteLineResponse[] | { data?: NoteLineResponse[] } } | NoteLineResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch not deleted note lines')
  }
}

/**
 * Mark multiple note lines as done (bulk)
 */
export const markNoteLinesDoneBulk = async (
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
    await apiClient.api.putNoteBooksDoneAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to mark note lines as done')
  }
}

/**
 * Mark multiple note lines as favorite (bulk)
 */
export const favoriteNoteLinesBulk = async (
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
    await apiClient.api.putNoteBooksFavoriteAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to favorite note lines')
  }
}

/**
 * Get all note line categories
 */
export const getNoteCategories = async (
  query?: { clientId?: string }
): Promise<NoteLineCategoryResponse[]> => {
  try {
    const response = await apiClient.api.getNoteBooksGetAllCategories(query)
    const responseAny: any = response as { data?: NoteLineCategoryResponse[] | { data?: NoteLineCategoryResponse[] } } | NoteLineCategoryResponse[]
    
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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch note categories')
  }
}

/**
 * Create a note line category
 */
export const createNoteCategory = async (
  data: NoteLineCategoryRequest,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.postNoteBooksCreateCategory(data, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create note category')
  }
}

/**
 * Get note line category by ID
 */
export const getNoteCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<NoteLineCategoryResponse | null> => {
  try {
    const response = await apiClient.api.getNoteBooksGetCategory(categoryId, query)
    const responseAny: any = response as { data?: { data?: NoteLineCategoryResponse } | NoteLineCategoryResponse } | NoteLineCategoryResponse
    
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: NoteLineCategoryResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as NoteLineCategoryResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as NoteLineCategoryResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch note category')
  }
}

/**
 * Update a note line category
 */
export const updateNoteCategory = async (
  categoryId: number,
  data: NoteLineCategoryUpdateRequest,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.putNoteBooksUpdateCategory(categoryId, data, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update note category')
  }
}

/**
 * Delete a note line category
 */
export const deleteNoteCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.deleteNoteBooksDeleteCategory(categoryId, query)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete note category')
  }
}
