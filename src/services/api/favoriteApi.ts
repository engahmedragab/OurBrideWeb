// Favorite API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  CreateFavoriteRequest,
  UpdateFavoriteRequest,
  Source,
} from '@/../client/common/api/gen/ourbride-api'
import type {
  PaginatedList,
  FavoriteResponse,
} from '@/types/responses'

/**
 * Get favorite by ID
 */
export const getFavoriteById = async (
  id: number,
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
    userId?: string
  }
): Promise<FavoriteResponse> => {
  try {
    const response = await apiClient.api.getFavoriteGetById(id, query)
    const responseAny = response as unknown
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as FavoriteResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch favorite'
    )
  }
}

/**
 * Update favorite
 */
export const updateFavorite = async (
  id: number,
  data: UpdateFavoriteRequest,
  query?: {
    userId?: string
  }
): Promise<FavoriteResponse> => {
  try {
    const response = await apiClient.api.putFavoriteUpdate(id, data, query)
    const responseAny = response as unknown
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as FavoriteResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update favorite'
    )
  }
}

/**
 * Delete favorite
 */
export const deleteFavorite = async (
  id: number,
  query?: {
    userId?: string
  }
): Promise<void> => {
  try {
    await apiClient.api.deleteFavoriteDelete(id, query)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete favorite'
    )
  }
}

/**
 * Get all favorites (paginated)
 */
export const getAllFavorites = async (query?: {
  providerId?: number
  branchId?: number
  staffId?: string
  userId?: string
  page?: number
  pageSize?: number
  source?: string
  favoriteType?: string
  category?: string
  status?: string
  tags?: string
  priority?: number
  startDate?: string
  endDate?: string
}): Promise<PaginatedList<FavoriteResponse>> => {
  try {
    const response = await apiClient.api.getFavoriteGetAll(query)
    const responseAny = response as unknown
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as PaginatedList<FavoriteResponse>
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch favorites'
    )
  }
}

/**
 * Create favorite
 */
export const createFavorite = async (
  data: CreateFavoriteRequest,
  query?: {
    userId?: string
  }
): Promise<FavoriteResponse> => {
  try {
    const response = await apiClient.api.postFavoriteCreate(data, query)
    const responseAny = response as unknown
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as FavoriteResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create favorite'
    )
  }
}

/**
 * Get favorites by source
 */
export const getFavoritesBySource = async (
  source: Source,
  sourceId: number,
  query?: {
    page?: number
    pageSize?: number
  }
): Promise<PaginatedList<FavoriteResponse>> => {
  try {
    const response = await apiClient.api.getFavoriteGetBySource(source, sourceId, query)
    const responseAny = response as unknown
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as PaginatedList<FavoriteResponse>
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch favorites by source'
    )
  }
}
