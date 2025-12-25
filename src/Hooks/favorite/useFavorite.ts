import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllFavorites,
  getFavoriteById,
  createFavorite,
  updateFavorite,
  deleteFavorite,
  getFavoritesBySource,
} from '@/services/api/favoriteApi'
import type { FavoriteResponse, PaginatedList } from '@/types/responses'
import type {
  CreateFavoriteRequest,
  UpdateFavoriteRequest,
  Source,
} from '@/../client/common/api/gen/ourbride-api'

/**
 * Hook to fetch all favorites
 */
export const useFavorites = (query?: {
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
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = query || {}
  return useQuery({
    queryKey: ['favorites', queryParams],
    queryFn: async () => {
      const favorites = await getAllFavorites(queryParams)
      return favorites
    },
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to fetch a single favorite by ID
 */
export const useFavorite = (
  id: number,
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
    userId?: string
  },
  enabled = true
) => {
  return useQuery({
    queryKey: ['favorite', id, query],
    queryFn: async () => {
      const favorite = await getFavoriteById(id, query)
      return favorite
    },
    enabled: enabled && !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to fetch favorites by source
 */
export const useFavoritesBySource = (
  source: Source,
  sourceId: number,
  query?: {
    page?: number
    pageSize?: number
    enabled?: boolean
  }
) => {
  const { enabled = true, ...queryParams } = query || {}
  return useQuery({
    queryKey: ['favorites', 'source', source, sourceId, queryParams],
    queryFn: async () => {
      const favorites = await getFavoritesBySource(source, sourceId, queryParams)
      return favorites
    },
    enabled: enabled && !!source && !!sourceId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to create a favorite
 */
export const useCreateFavorite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      data: CreateFavoriteRequest
      query?: { userId?: string }
    }): Promise<FavoriteResponse> => {
      return await createFavorite(data.data, data.query)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

/**
 * Hook to update a favorite
 */
export const useUpdateFavorite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      id: number
      data: UpdateFavoriteRequest
      query?: { userId?: string }
    }): Promise<FavoriteResponse> => {
      return await updateFavorite(data.id, data.data, data.query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favorite', variables.id] })
    },
  })
}

/**
 * Hook to delete a favorite
 */
export const useDeleteFavorite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      id: number
      query?: { userId?: string }
    }): Promise<void> => {
      return await deleteFavorite(data.id, data.query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favorite', variables.id] })
      queryClient.removeQueries({ queryKey: ['favorite', variables.id] })
    },
  })
}
