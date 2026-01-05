/**
 * TodoBooks API Functions
 * API service for managing todo books and lines
 */

import { apiClient } from '@/services/api/apiClient'
import type {
  TodoBookResponse,
  TodoLineResponse,
  TodoLineCategoryResponse,
} from '@/types/responses'
import type {
  TodoBookRequest,
  TodoLineRequest,
  TodoLineUpdateRequest,
  TodoLineCategoryRequest,
  TodoLineCategoryUpdateRequest,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'

export interface TodoBooksQuery {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Normalize query parameters - set clientId and userType to null, keep eventId
 */
const normalizeQuery = (query?: TodoBooksQuery) => {
  if (!query) return undefined
  return {
    clientId: null as unknown as string | undefined,
    userType: null as unknown as UserType | undefined,
    eventId: query.eventId,
  }
}

/**
 * Initialize todo books for a client
 */
export const initTodoBooks = async (params?: {
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
    await apiClient.api.postTodoBooksInit(normalizedParams)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to initialize todo books'
    )
  }
}

/**
 * Sync todo book data
 */
export const syncTodoBook = async (
  data: TodoBookRequest,
  query?: TodoBooksQuery
): Promise<void> => {
  try {
    const params = normalizeQuery(query)
    await apiClient.api.postTodoBooksSyncBook(data, params)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to sync todo book'
    )
  }
}

/**
 * Get todo book
 */
export const getTodoBook = async (
  query?: TodoBooksQuery
): Promise<TodoBookResponse | null> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getTodoBooksGetBook(normalizedQuery)
    const responseAny: any = response as
      | { data?: { data?: TodoBookResponse } | TodoBookResponse }
      | TodoBookResponse

    // Handle different response structures
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: TodoBookResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as TodoBookResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as TodoBookResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch todo book'
    )
  }
}

/**
 * Get all todo lines
 */
export const getTodoLines = async (
  query?: TodoBooksQuery
): Promise<TodoLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getTodoBooksGetAll(normalizedQuery)
    const responseAny: any = response as
      | {
          data?:
            | TodoLineResponse[]
            | { data?: TodoLineResponse[]; items?: TodoLineResponse[] }
        }
      | TodoLineResponse[]

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
      error instanceof Error ? error.message : 'Failed to fetch todo lines'
    )
  }
}

/**
 * Get todo line by ID
 */
export const getTodoLineById = async (
  lineId: number,
  query?: { clientId?: string; eventId?: number }
): Promise<TodoLineResponse | null> => {
  try {
    const normalizedQuery = query
      ? {
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          eventId: query.eventId,
        }
      : undefined
    const response = await apiClient.api.getTodoBooksGet(
      lineId,
      String(lineId),
      normalizedQuery
    )
    const responseAny: any = response as
      | { data?: { data?: TodoLineResponse } | TodoLineResponse }
      | TodoLineResponse

    // Handle different response structures
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: TodoLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as TodoLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as TodoLineResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch todo line'
    )
  }
}

/**
 * Create a todo line
 */
export const createTodoLine = async (
  data: TodoLineRequest,
  query?: TodoBooksQuery
): Promise<TodoLineResponse> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.postTodoBooksCreate(
      data,
      normalizedQuery
    )
    const responseAny: any = response as
      | { data?: { data?: TodoLineResponse } | TodoLineResponse }
      | TodoLineResponse

    // Handle different response structures
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: TodoLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as TodoLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as TodoLineResponse
    }
    throw new Error('Invalid response format from create todo line endpoint')
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create todo line'
    )
  }
}

/**
 * Create multiple todo lines (bulk)
 */
export const createTodoLinesBulk = async (
  data: TodoLineRequest[],
  query?: TodoBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.postTodoBooksCreateAll(data, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create todo lines'
    )
  }
}

/**
 * Update a todo line
 */
export const updateTodoLine = async (
  lineId: number,
  data: TodoLineUpdateRequest,
  query?: TodoBooksQuery
): Promise<TodoLineResponse> => {
  try {
    const normalizedQuery = query
      ? {
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          // eventId is excluded if the API doesn't accept it
        }
      : undefined
    const response = await apiClient.api.putTodoBooksUpdate(
      lineId,
      String(lineId),
      data,
      normalizedQuery
    )
    const responseAny: any = response as
      | { data?: { data?: TodoLineResponse } | TodoLineResponse }
      | TodoLineResponse

    // Handle different response structures
    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: TodoLineResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as TodoLineResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as TodoLineResponse
    }
    throw new Error('Invalid response format from update todo line endpoint')
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update todo line'
    )
  }
}

/**
 * Update multiple todo lines (bulk)
 */
export const updateTodoLinesBulk = async (
  data: TodoLineUpdateRequest[],
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
    await apiClient.api.putTodoBooksUpdateAll(data, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update todo lines'
    )
  }
}

/**
 * Delete a todo line
 */
export const deleteTodoLine = async (
  lineId: number,
  query?: TodoBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.deleteTodoBooksDelete(
      lineId,
      String(lineId),
      normalizedQuery
    )
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete todo line'
    )
  }
}

/**
 * Delete multiple todo lines (bulk)
 */
export const deleteTodoLinesBulk = async (
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
    await apiClient.api.putTodoBooksDeleteAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete todo lines'
    )
  }
}

/**
 * Toggle todo line done status
 */
export const toggleTodoLineDone = async (
  lineId: number,
  query?: TodoBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.putTodoBooksDone(
      lineId,
      String(lineId),
      normalizedQuery
    )
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to toggle todo line done status'
    )
  }
}

/**
 * Toggle todo line favorite status
 */
export const toggleTodoLineFavorite = async (
  lineId: number,
  query?: TodoBooksQuery
): Promise<void> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    await apiClient.api.putTodoBooksFavorite(
      lineId,
      String(lineId),
      normalizedQuery
    )
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to toggle todo line favorite status'
    )
  }
}

/**
 * Get custom filtered todo lines
 */
export const getTodoLinesCustom = async (
  isDeleted: boolean,
  isDone: boolean,
  isFavorite: boolean,
  query?: TodoBooksQuery
): Promise<TodoLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getTodoBooksGetAllCustom(
      isDeleted,
      isDone,
      isFavorite,
      normalizedQuery
    )
    const responseAny: any = response as
      | { data?: TodoLineResponse[] | { data?: TodoLineResponse[] } }
      | TodoLineResponse[]

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
        : 'Failed to fetch custom todo lines'
    )
  }
}

/**
 * Get done todo lines
 */
export const getTodoLinesDone = async (
  query?: TodoBooksQuery
): Promise<TodoLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response = await apiClient.api.getTodoBooksGetAllDone(normalizedQuery)
    const responseAny: any = response as
      | { data?: TodoLineResponse[] | { data?: TodoLineResponse[] } }
      | TodoLineResponse[]

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
      error instanceof Error ? error.message : 'Failed to fetch done todo lines'
    )
  }
}

/**
 * Get not done todo lines
 */
export const getTodoLinesNotDone = async (query?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<TodoLineResponse[]> => {
  try {
    const normalizedQuery = query
      ? {
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          eventId: query.eventId,
        }
      : undefined
    const response =
      await apiClient.api.getTodoBooksGetAllNotDone(normalizedQuery)
    const responseAny: any = response as
      | { data?: TodoLineResponse[] | { data?: TodoLineResponse[] } }
      | TodoLineResponse[]

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
        : 'Failed to fetch not done todo lines'
    )
  }
}

/**
 * Get favorite todo lines
 */
export const getTodoLinesFavorite = async (
  query?: TodoBooksQuery
): Promise<TodoLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response =
      await apiClient.api.getTodoBooksGetAllFavorite(normalizedQuery)
    const responseAny: any = response as
      | { data?: TodoLineResponse[] | { data?: TodoLineResponse[] } }
      | TodoLineResponse[]

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
        : 'Failed to fetch favorite todo lines'
    )
  }
}

/**
 * Get not favorite todo lines
 */
export const getTodoLinesNotFavorite = async (query?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<TodoLineResponse[]> => {
  try {
    const normalizedQuery = query
      ? {
          clientId: null as unknown as string | undefined,
          userType: null as unknown as UserType | undefined,
          eventId: query.eventId,
        }
      : undefined
    const response =
      await apiClient.api.getTodoBooksGetAllNotFavorite(normalizedQuery)
    const responseAny: any = response as
      | { data?: TodoLineResponse[] | { data?: TodoLineResponse[] } }
      | TodoLineResponse[]

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
        : 'Failed to fetch not favorite todo lines'
    )
  }
}

/**
 * Get deleted todo lines
 */
export const getTodoLinesDeleted = async (
  query?: TodoBooksQuery
): Promise<TodoLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response =
      await apiClient.api.getTodoBooksGetAllDelete(normalizedQuery)
    const responseAny: any = response as
      | { data?: TodoLineResponse[] | { data?: TodoLineResponse[] } }
      | TodoLineResponse[]

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
        : 'Failed to fetch deleted todo lines'
    )
  }
}

/**
 * Get not deleted todo lines
 */
export const getTodoLinesNotDeleted = async (
  query?: TodoBooksQuery
): Promise<TodoLineResponse[]> => {
  try {
    const normalizedQuery = normalizeQuery(query)
    const response =
      await apiClient.api.getTodoBooksGetAllNotDelete(normalizedQuery)
    const responseAny: any = response as
      | { data?: TodoLineResponse[] | { data?: TodoLineResponse[] } }
      | TodoLineResponse[]

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
        : 'Failed to fetch not deleted todo lines'
    )
  }
}

/**
 * Mark multiple todo lines as done (bulk)
 */
export const markTodoLinesDoneBulk = async (
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
    await apiClient.api.putTodoBooksDoneAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to mark todo lines as done'
    )
  }
}

/**
 * Mark multiple todo lines as favorite (bulk)
 */
export const favoriteTodoLinesBulk = async (
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
    await apiClient.api.putTodoBooksFavoriteAll(lineIds, normalizedQuery)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to favorite todo lines'
    )
  }
}

/**
 * Get all todo line categories
 */
export const getTodoCategories = async (query?: {
  clientId?: string
}): Promise<TodoLineCategoryResponse[]> => {
  try {
    const response = await apiClient.api.getTodoBooksGetAllCategories(query)
    const responseAny: any = response as
      | {
          data?:
            | TodoLineCategoryResponse[]
            | { data?: TodoLineCategoryResponse[] }
        }
      | TodoLineCategoryResponse[]

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
      error instanceof Error ? error.message : 'Failed to fetch todo categories'
    )
  }
}

/**
 * Create a todo line category
 */
export const createTodoCategory = async (
  data: TodoLineCategoryRequest,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.postTodoBooksCreateCategory(data, query)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create todo category'
    )
  }
}

/**
 * Get todo line category by ID
 */
export const getTodoCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<TodoLineCategoryResponse | null> => {
  try {
    const response = await apiClient.api.getTodoBooksGetCategory(
      categoryId,
      query
    )
    const responseAny: any = response as
      | {
          data?: { data?: TodoLineCategoryResponse } | TodoLineCategoryResponse
        }
      | TodoLineCategoryResponse

    if (
      responseAny &&
      typeof responseAny === 'object' &&
      'data' in responseAny
    ) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data: TodoLineCategoryResponse }).data
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as TodoLineCategoryResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as TodoLineCategoryResponse
    }
    return null
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch todo category'
    )
  }
}

/**
 * Update a todo line category
 */
export const updateTodoCategory = async (
  categoryId: number,
  data: TodoLineCategoryUpdateRequest,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.putTodoBooksUpdateCategory(categoryId, data, query)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update todo category'
    )
  }
}

/**
 * Delete a todo line category
 */
export const deleteTodoCategory = async (
  categoryId: number,
  query?: { clientId?: string }
): Promise<void> => {
  try {
    await apiClient.api.postTodoBooksDeleteCategory(categoryId, query)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete todo category'
    )
  }
}
