/**
 * BudgetBooks API Functions
 * 
 * Wrapper functions for BudgetBooks API endpoints.
 * Handles response extraction and error handling with proper typing.
 */

import { apiClient } from '@/services/api/apiClient'
import type {
  BudgetBookRequest,
  BudgetLineRequest,
  BudgetLineUpdateRequest,
  BudgetLineCategoryRequest,
  BudgetLineCategoryUpdateRequest,
  UserType,
  RequestParams,
} from '@/../client/common/api/gen/ourbride-api'
import type {
  GetBudgetBookResponse,
  GetBudgetLinesResponse,
  GetBudgetCategoriesResponse,
  GetBudgetLineResponse,
  GetBudgetCategoryResponse,
  BudgetBooksQuery,
  BudgetBooksBaseQuery,
  ApiError,
} from './budgetBooks.types'

/**
 * Initialize a budget book
 */
export const initBudgetBook = async (
  query?: {
    clientId?: string
    userType?: UserType
  },
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.postBudgetBooksInit(query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to initialize budget book',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Sync a budget book
 * 
 * @param data - Budget book data including lines and categories
 * @example
 * ```typescript
 * await syncBudgetBook({
 *   id: 0,
 *   groomId: "uuid",
 *   brideId: "uuid",
 *   weddingPlannerId: "uuid",
 *   bookType: "Guest",
 *   bookClass: "Main",
 *   title: "string",
 *   clientName: "string",
 *   weddingDate: "2025-12-24T12:06:11.241Z",
 *   eventLocation: "string",
 *   lines: [{
 *     id: 0,
 *     bookId: 0,
 *     expense: "string",
 *     // ... other line fields
 *   }],
 *   lineCategories: [{
 *     id: 0,
 *     name: "string",
 *     // ... other category fields
 *   }],
 *   initialEstimated: 333333333
 * })
 * ```
 */
export const syncBudgetBook = async (
  data: BudgetBookRequest,
  query?: {
    clientId?: string
    userType?: UserType
  },
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.postBudgetBooksSyncBook(data, query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to sync budget book',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get budget book
 */
export const getBudgetBook = async (
  query?: BudgetBooksQuery,
  params?: RequestParams
): Promise<GetBudgetBookResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGetBook(query, params)
    return (response?.data ?? response) as unknown as GetBudgetBookResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch budget book',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get all budget lines
 */
export const getBudgetLines = async (
  query?: BudgetBooksQuery,
  params?: RequestParams
): Promise<GetBudgetLinesResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGetAll(query, params)
    return (response?.data ?? response) as unknown as GetBudgetLinesResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Create a budget line
 */
export const createBudgetLine = async (
  data: BudgetLineRequest,
  query?: BudgetBooksQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.postBudgetBooksCreate(data, query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to create budget line',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Create multiple budget lines
 */
export const createBudgetLinesBulk = async (
  data: BudgetLineRequest[],
  query?: BudgetBooksQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.postBudgetBooksCreateAll(data, query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to create budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Update a budget line
 */
export const updateBudgetLine = async (
  eventLineId: number,
  budgetlineId: string,
  data: BudgetLineUpdateRequest,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.putBudgetBooksUpdate(eventLineId, budgetlineId, data, query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to update budget line',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Update multiple budget lines
 */
export const updateBudgetLinesBulk = async (
  data: BudgetLineUpdateRequest[],
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.putBudgetBooksUpdateAll(data, query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to update budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Delete a budget line
 */
export const deleteBudgetLine = async (
  eventLineId: number,
  budgetlineId: string,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.deleteBudgetBooksDelete(eventLineId, budgetlineId, query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to delete budget line',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Toggle done status for a budget line
 */
export const toggleBudgetLineDone = async (
  eventLineId: number,
  budgetlineId: string,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.putBudgetBooksDone(eventLineId, budgetlineId, query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to toggle budget line done status',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Toggle favorite status for a budget line
 */
export const toggleBudgetLineFavorite = async (
  eventLineId: number,
  budgetlineId: string,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.putBudgetBooksFavorite(eventLineId, budgetlineId, query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to toggle budget line favorite status',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get custom filtered budget lines
 */
export const getBudgetLinesCustom = async (
  isDeleted: boolean,
  isDone: boolean,
  isFavorite: boolean,
  query?: BudgetBooksQuery,
  params?: RequestParams
): Promise<GetBudgetLinesResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGetAllCustom(
      isDeleted,
      isDone,
      isFavorite,
      query,
      params
    )
    return (response?.data ?? response) as unknown as GetBudgetLinesResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch custom budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get done budget lines
 */
export const getBudgetLinesDone = async (
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<GetBudgetLinesResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGetAllDone(query, params)
    return (response?.data ?? response) as unknown as GetBudgetLinesResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch done budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Mark multiple budget lines as done/not done
 */
export const markBudgetLinesDoneBulk = async (
  ids: number[],
  value: boolean,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.putBudgetBooksDoneAll(ids, { value, ...query }, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to mark budget lines as done',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get not done budget lines
 */
export const getBudgetLinesNotDone = async (
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<GetBudgetLinesResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGetAllNotDone(query, params)
    return (response?.data ?? response) as unknown as GetBudgetLinesResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch not done budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get favorite budget lines
 */
export const getBudgetLinesFavorite = async (
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<GetBudgetLinesResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGetAllFavorite(query, params)
    return (response?.data ?? response) as unknown as GetBudgetLinesResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch favorite budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get not favorite budget lines
 */
export const getBudgetLinesNotFavorite = async (
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<GetBudgetLinesResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGetAllNotFavorite(query, params)
    return (response?.data ?? response) as unknown as GetBudgetLinesResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch not favorite budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get deleted budget lines
 */
export const getBudgetLinesDeleted = async (
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<GetBudgetLinesResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGetAllDelete(query, params)
    return (response?.data ?? response) as unknown as GetBudgetLinesResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch deleted budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get not deleted budget lines
 */
export const getBudgetLinesNotDeleted = async (
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<GetBudgetLinesResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGetAllNotDelete(query, params)
    return (response?.data ?? response) as unknown as GetBudgetLinesResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch not deleted budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Delete multiple budget lines
 */
export const deleteBudgetLinesBulk = async (
  ids: number[],
  value: boolean,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.deleteBudgetBooksDeleteAll(ids, { value, ...query }, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to delete budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Toggle favorite status for multiple budget lines
 */
export const favoriteBudgetLinesBulk = async (
  ids: number[],
  value: boolean,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.putBudgetBooksFavoriteAll(ids, { value, ...query }, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to toggle favorite status for budget lines',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get a single budget line
 */
export const getBudgetLine = async (
  eventLineId: number,
  budgetlineId: string,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<GetBudgetLineResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGet(eventLineId, budgetlineId, query, params)
    return (response?.data ?? response) as unknown as GetBudgetLineResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch budget line',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get all budget categories
 */
export const getBudgetCategories = async (
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<GetBudgetCategoriesResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGetAllCategories(query, params)
    return (response?.data ?? response) as unknown as GetBudgetCategoriesResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch budget categories',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Create a budget category
 */
export const createBudgetCategory = async (
  data: BudgetLineCategoryRequest,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.postBudgetBooksCreateCategory(data, query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to create budget category',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Get a single budget category
 */
export const getBudgetCategory = async (
  lineCategoryId: number,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<GetBudgetCategoryResponse> => {
  try {
    const response = await apiClient.api.getBudgetBooksGetCategory(lineCategoryId, query, params)
    return (response?.data ?? response) as unknown as GetBudgetCategoryResponse
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch budget category',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Update a budget category
 */
export const updateBudgetCategory = async (
  lineCategoryId: number,
  data: BudgetLineCategoryUpdateRequest,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.putBudgetBooksUpdateCategory(lineCategoryId, data, query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to update budget category',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

/**
 * Delete a budget category
 */
export const deleteBudgetCategory = async (
  lineCategoryId: number,
  query?: BudgetBooksBaseQuery,
  params?: RequestParams
): Promise<void> => {
  try {
    await apiClient.api.deleteBudgetBooksDeleteCategory(lineCategoryId, query, params)
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to delete budget category',
      status: (error as { response?: { status?: number } })?.response?.status,
      details: error,
    }
    throw apiError
  }
}

