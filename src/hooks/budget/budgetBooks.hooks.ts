/**
 * BudgetBooks React Query Hooks
 * 
 * React Query hooks for BudgetBooks API operations.
 * Includes query hooks for fetching data and mutation hooks for updates,
 * with proper cache invalidation.
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query'
import { budgetBookKeys } from './budgetBooks.keys'
import {
  initBudgetBook,
  syncBudgetBook,
  syncBudgetBookDelta,
  getBudgetBook,
  getBudgetLines,
  createBudgetLine,
  createBudgetLinesBulk,
  updateBudgetLine,
  updateBudgetLinesBulk,
  deleteBudgetLine,
  toggleBudgetLineDone,
  toggleBudgetLineFavorite,
  getBudgetLinesCustom,
  getBudgetLinesDone,
  markBudgetLinesDoneBulk,
  getBudgetLinesNotDone,
  getBudgetLinesFavorite,
  getBudgetLinesNotFavorite,
  getBudgetLinesDeleted,
  getBudgetLinesNotDeleted,
  deleteBudgetLinesBulk,
  favoriteBudgetLinesBulk,
  getBudgetLine,
  getBudgetCategories,
  createBudgetCategory,
  getBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory,
} from '@/services/api/budgetBooks.api'
import type {
  GetBudgetBookResponse,
  GetBudgetLinesResponse,
  GetBudgetCategoriesResponse,
  GetBudgetLineResponse,
  GetBudgetCategoryResponse,
  BudgetBooksQuery,
  BudgetBooksBaseQuery,
  BudgetBookRequest,
  BudgetLineRequest,
  BudgetLineUpdateRequest,
  BudgetLineCategoryRequest,
  BudgetLineCategoryUpdateRequest,
  ApiError,
  UserType,
} from '@/types/responses/budgetBooks.types'
import type { SyncBookDeltaRequest, SyncBookDeltaResponse } from '@/types/syncDelta'

// Helper functions for cache invalidation
const invalidateBudgetBookQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: budgetBookKeys.all() })
}

const invalidateBudgetLinesQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['budgetBook', 'lines'] })
  queryClient.invalidateQueries({ queryKey: budgetBookKeys.book() })
}

const invalidateBudgetCategoriesQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['budgetBook', 'categories'] })
}

// Query Hooks

/**
 * Hook to fetch a budget book
 */
export const useBudgetBook = (
  query?: BudgetBooksQuery,
  options?: Omit<UseQueryOptions<GetBudgetBookResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetBookResponse, ApiError>({
    queryKey: budgetBookKeys.book(query),
    queryFn: () => getBudgetBook(query),
    ...options,
  })
}

/**
 * Hook to fetch all budget lines
 */
export const useBudgetLines = (
  query?: BudgetBooksQuery,
  options?: Omit<UseQueryOptions<GetBudgetLinesResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetLinesResponse, ApiError>({
    queryKey: budgetBookKeys.lines(query),
    queryFn: () => getBudgetLines(query),
    ...options,
  })
}

/**
 * Hook to fetch custom filtered budget lines
 */
export const useBudgetLinesCustom = (
  filters: { isDeleted: boolean; isDone: boolean; isFavorite: boolean },
  query?: BudgetBooksQuery,
  options?: Omit<UseQueryOptions<GetBudgetLinesResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetLinesResponse, ApiError>({
    queryKey: budgetBookKeys.linesCustom(filters, query),
    queryFn: () => getBudgetLinesCustom(filters.isDeleted, filters.isDone, filters.isFavorite, query),
    ...options,
  })
}

/**
 * Hook to fetch done budget lines
 */
export const useBudgetLinesDone = (
  query?: BudgetBooksBaseQuery,
  options?: Omit<UseQueryOptions<GetBudgetLinesResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetLinesResponse, ApiError>({
    queryKey: budgetBookKeys.linesDone(query),
    queryFn: () => getBudgetLinesDone(query),
    ...options,
  })
}

/**
 * Hook to fetch not done budget lines
 */
export const useBudgetLinesNotDone = (
  query?: BudgetBooksBaseQuery,
  options?: Omit<UseQueryOptions<GetBudgetLinesResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetLinesResponse, ApiError>({
    queryKey: budgetBookKeys.linesNotDone(query),
    queryFn: () => getBudgetLinesNotDone(query),
    ...options,
  })
}

/**
 * Hook to fetch favorite budget lines
 */
export const useBudgetLinesFavorite = (
  query?: BudgetBooksBaseQuery,
  options?: Omit<UseQueryOptions<GetBudgetLinesResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetLinesResponse, ApiError>({
    queryKey: budgetBookKeys.linesFavorite(query),
    queryFn: () => getBudgetLinesFavorite(query),
    ...options,
  })
}

/**
 * Hook to fetch not favorite budget lines
 */
export const useBudgetLinesNotFavorite = (
  query?: BudgetBooksBaseQuery,
  options?: Omit<UseQueryOptions<GetBudgetLinesResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetLinesResponse, ApiError>({
    queryKey: budgetBookKeys.linesNotFavorite(query),
    queryFn: () => getBudgetLinesNotFavorite(query),
    ...options,
  })
}

/**
 * Hook to fetch deleted budget lines
 */
export const useBudgetLinesDeleted = (
  query?: BudgetBooksBaseQuery,
  options?: Omit<UseQueryOptions<GetBudgetLinesResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetLinesResponse, ApiError>({
    queryKey: budgetBookKeys.linesDeleted(query),
    queryFn: () => getBudgetLinesDeleted(query),
    ...options,
  })
}

/**
 * Hook to fetch not deleted budget lines
 */
export const useBudgetLinesNotDeleted = (
  query?: BudgetBooksBaseQuery,
  options?: Omit<UseQueryOptions<GetBudgetLinesResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetLinesResponse, ApiError>({
    queryKey: budgetBookKeys.linesNotDeleted(query),
    queryFn: () => getBudgetLinesNotDeleted(query),
    ...options,
  })
}

/**
 * Hook to fetch a single budget line
 */
export const useBudgetLine = (
  eventLineId: number,
  budgetlineId: string,
  query?: BudgetBooksBaseQuery,
  options?: Omit<UseQueryOptions<GetBudgetLineResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetLineResponse, ApiError>({
    queryKey: budgetBookKeys.line(parseInt(budgetlineId), query),
    queryFn: () => getBudgetLine(eventLineId, budgetlineId, query),
    enabled: !!eventLineId && !!budgetlineId,
    ...options,
  })
}

/**
 * Hook to fetch all budget categories
 */
export const useBudgetCategories = (
  query?: BudgetBooksBaseQuery,
  options?: Omit<UseQueryOptions<GetBudgetCategoriesResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetCategoriesResponse, ApiError>({
    queryKey: budgetBookKeys.categories(query),
    queryFn: () => getBudgetCategories(query),
    ...options,
  })
}

/**
 * Hook to fetch a single budget category
 */
export const useBudgetCategory = (
  lineCategoryId: number,
  query?: BudgetBooksBaseQuery,
  options?: Omit<UseQueryOptions<GetBudgetCategoryResponse, ApiError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<GetBudgetCategoryResponse, ApiError>({
    queryKey: budgetBookKeys.category(lineCategoryId, query),
    queryFn: () => getBudgetCategory(lineCategoryId, query),
    enabled: !!lineCategoryId,
    ...options,
  })
}

// Mutation Hooks

/**
 * Hook to initialize a budget book
 */
export const useBudgetInitMutation = (
  query?: { clientId?: string; userType?: UserType },
  options?: Omit<UseMutationOptions<void, ApiError, void>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, void>({
    mutationFn: () => initBudgetBook(query),
    onSuccess: () => {
      invalidateBudgetBookQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to sync a budget book
 */
export const useBudgetSyncMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, BudgetBookRequest & { query?: BudgetBooksQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, BudgetBookRequest & { query?: BudgetBooksQuery }>({
    mutationFn: ({ query, ...data }) => syncBudgetBook(data, query),
    onSuccess: () => {
      invalidateBudgetBookQueries(queryClient)
      invalidateBudgetLinesQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to sync a budget book (delta)
 */
export const useBudgetSyncDeltaMutation = (
  options?: Omit<
    UseMutationOptions<
      SyncBookDeltaResponse<GetBudgetBookResponse>,
      ApiError,
      { data: SyncBookDeltaRequest<BudgetLineRequest, BudgetLineCategoryRequest>; query?: BudgetBooksQuery }
    >,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient()

  return useMutation<
    SyncBookDeltaResponse<GetBudgetBookResponse>,
    ApiError,
    { data: SyncBookDeltaRequest<BudgetLineRequest, BudgetLineCategoryRequest>; query?: BudgetBooksQuery }
  >({
    mutationFn: ({ data, query }) => syncBudgetBookDelta(data as unknown as import('@/types/syncDelta').SyncBookDeltaRequest<BudgetLineRequest, BudgetLineCategoryRequest>, query),
    onSuccess: () => {
      invalidateBudgetBookQueries(queryClient)
      invalidateBudgetLinesQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to create a budget line
 */
export const useCreateBudgetLineMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, BudgetLineRequest & { query?: BudgetBooksQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, BudgetLineRequest & { query?: BudgetBooksQuery }>({
    mutationFn: ({ query, ...data }) => createBudgetLine(data, query),
    onSuccess: () => {
      invalidateBudgetLinesQueries(queryClient)
      invalidateBudgetBookQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to create multiple budget lines
 */
export const useCreateBudgetLinesBulkMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, { data: BudgetLineRequest[]; query?: BudgetBooksQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, { data: BudgetLineRequest[]; query?: BudgetBooksQuery }>({
    mutationFn: ({ data, query }) => createBudgetLinesBulk(data, query),
    onSuccess: () => {
      invalidateBudgetLinesQueries(queryClient)
      invalidateBudgetBookQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to update a budget line
 */
export const useUpdateBudgetLineMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, { eventLineId: number; budgetlineId: string; data: BudgetLineUpdateRequest; query?: BudgetBooksBaseQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, { eventLineId: number; budgetlineId: string; data: BudgetLineUpdateRequest; query?: BudgetBooksBaseQuery }>({
    mutationFn: ({ eventLineId, budgetlineId, data, query }) => updateBudgetLine(eventLineId, budgetlineId, data, query),
    onSuccess: () => {
      invalidateBudgetLinesQueries(queryClient)
      invalidateBudgetBookQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to update multiple budget lines
 */
export const useUpdateBudgetLinesBulkMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, { data: BudgetLineUpdateRequest[]; query?: BudgetBooksBaseQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, { data: BudgetLineUpdateRequest[]; query?: BudgetBooksBaseQuery }>({
    mutationFn: ({ data, query }) => updateBudgetLinesBulk(data, query),
    onSuccess: () => {
      invalidateBudgetLinesQueries(queryClient)
      invalidateBudgetBookQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to delete a budget line
 */
export const useDeleteBudgetLineMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, { eventLineId: number; budgetlineId: string; query?: BudgetBooksBaseQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, { eventLineId: number; budgetlineId: string; query?: BudgetBooksBaseQuery }>({
    mutationFn: ({ eventLineId, budgetlineId, query }) => deleteBudgetLine(eventLineId, budgetlineId, query),
    onSuccess: () => {
      invalidateBudgetLinesQueries(queryClient)
      invalidateBudgetBookQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to toggle done status for a budget line
 */
export const useToggleBudgetLineDoneMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, { eventLineId: number; budgetlineId: string; query?: BudgetBooksBaseQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, { eventLineId: number; budgetlineId: string; query?: BudgetBooksBaseQuery }>({
    mutationFn: ({ eventLineId, budgetlineId, query }) => toggleBudgetLineDone(eventLineId, budgetlineId, query),
    onSuccess: () => {
      invalidateBudgetLinesQueries(queryClient)
      invalidateBudgetBookQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to toggle favorite status for a budget line
 */
export const useToggleBudgetLineFavoriteMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, { eventLineId: number; budgetlineId: string; query?: BudgetBooksBaseQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, { eventLineId: number; budgetlineId: string; query?: BudgetBooksBaseQuery }>({
    mutationFn: ({ eventLineId, budgetlineId, query }) => toggleBudgetLineFavorite(eventLineId, budgetlineId, query),
    onSuccess: () => {
      invalidateBudgetLinesQueries(queryClient)
      invalidateBudgetBookQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to mark multiple budget lines as done/not done
 */
export const useMarkBudgetLinesDoneBulkMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, { ids: number[]; value: boolean; query?: BudgetBooksBaseQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, { ids: number[]; value: boolean; query?: BudgetBooksBaseQuery }>({
    mutationFn: ({ ids, value, query }) => markBudgetLinesDoneBulk(ids, value, query),
    onSuccess: () => {
      invalidateBudgetLinesQueries(queryClient)
      invalidateBudgetBookQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to delete multiple budget lines
 */
export const useDeleteBudgetLinesBulkMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, { ids: number[]; value: boolean; query?: BudgetBooksBaseQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, { ids: number[]; value: boolean; query?: BudgetBooksBaseQuery }>({
    mutationFn: ({ ids, value, query }) => deleteBudgetLinesBulk(ids, value, query),
    onSuccess: () => {
      invalidateBudgetLinesQueries(queryClient)
      invalidateBudgetBookQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to toggle favorite status for multiple budget lines
 */
export const useFavoriteBudgetLinesBulkMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, { ids: number[]; value: boolean; query?: BudgetBooksBaseQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, { ids: number[]; value: boolean; query?: BudgetBooksBaseQuery }>({
    mutationFn: ({ ids, value, query }) => favoriteBudgetLinesBulk(ids, value, query),
    onSuccess: () => {
      invalidateBudgetLinesQueries(queryClient)
      invalidateBudgetBookQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to create a budget category
 */
export const useCreateBudgetCategoryMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, BudgetLineCategoryRequest & { query?: BudgetBooksBaseQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, BudgetLineCategoryRequest & { query?: BudgetBooksBaseQuery }>({
    mutationFn: ({ query, ...data }) => createBudgetCategory(data, query),
    onSuccess: () => {
      invalidateBudgetCategoriesQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to update a budget category
 */
export const useUpdateBudgetCategoryMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, { lineCategoryId: number; data: BudgetLineCategoryUpdateRequest; query?: BudgetBooksBaseQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, { lineCategoryId: number; data: BudgetLineCategoryUpdateRequest; query?: BudgetBooksBaseQuery }>({
    mutationFn: ({ lineCategoryId, data, query }) => updateBudgetCategory(lineCategoryId, data, query),
    onSuccess: () => {
      invalidateBudgetCategoriesQueries(queryClient)
      invalidateBudgetLinesQueries(queryClient)
    },
    ...options,
  })
}

/**
 * Hook to delete a budget category
 */
export const useDeleteBudgetCategoryMutation = (
  options?: Omit<UseMutationOptions<void, ApiError, { lineCategoryId: number; query?: BudgetBooksBaseQuery }>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, { lineCategoryId: number; query?: BudgetBooksBaseQuery }>({
    mutationFn: ({ lineCategoryId, query }) => deleteBudgetCategory(lineCategoryId, query),
    onSuccess: () => {
      invalidateBudgetCategoriesQueries(queryClient)
      invalidateBudgetLinesQueries(queryClient)
    },
    ...options,
  })
}

