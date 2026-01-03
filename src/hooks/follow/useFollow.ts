import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllFollows,
  getFollowById,
  createFollow,
  updateFollow,
  deleteFollow,
  getFollowsBySource,
} from '@/services/api/followApi'
import type { FollowResponse } from '@/types/responses'
import type {
  CreateFollowRequest,
  UpdateFollowRequest,
} from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

/**
 * Hook to fetch all follows
 */
export const useFollows = (query?: {
  providerId?: number
  branchId?: number
  staffId?: string
  userId?: string
  page?: number
  pageSize?: number
  source?: string
  followType?: string
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
    queryKey: ['follows', queryParams],
    queryFn: async () => {
      return await getAllFollows(queryParams)
    },
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to fetch a single follow by ID
 */
export const useFollow = (
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
    queryKey: ['follow', id, query],
    queryFn: async () => {
      const follow = await getFollowById(id, query)
      return follow
    },
    enabled: enabled && !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to fetch follows by source
 * Note: This endpoint requires both source and sourceId parameters
 */
export const useFollowsBySource = (
  source: string,
  sourceId: number,
  query?: {
    page?: number
    pageSize?: number
    enabled?: boolean
  }
) => {
  const { enabled = true, ...queryParams } = query || {}
  return useQuery({
    queryKey: ['follows', 'source', source, sourceId, queryParams],
    queryFn: async () => {
      const follows = await getFollowsBySource(source, sourceId, queryParams)
      return follows
    },
    enabled: enabled && !!source && !!sourceId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to create a follow
 */
export const useCreateFollow = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (data: {
      data: CreateFollowRequest
      query?: { userId?: string }
    }): Promise<FollowResponse> => {
      return await createFollow(data.data, data.query)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['follows'] })
      const { message, type } = handleApiResponseForToast(
        response,
        'Followed successfully',
        'Failed to follow'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to follow'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to update a follow
 */
export const useUpdateFollow = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (data: {
      id: number
      data: UpdateFollowRequest
      query?: { userId?: string }
    }): Promise<FollowResponse> => {
      return await updateFollow(data.id, data.data, data.query)
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['follows'] })
      queryClient.invalidateQueries({ queryKey: ['follow', variables.id] })
      const { message, type } = handleApiResponseForToast(
        response,
        'Follow updated successfully',
        'Failed to update follow'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update follow'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to delete a follow
 */
export const useDeleteFollow = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (data: {
      id: number
      query?: { userId?: string }
    }): Promise<void> => {
      return await deleteFollow(data.id, data.query)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['follows'] })
      queryClient.invalidateQueries({ queryKey: ['follow', variables.id] })
      queryClient.removeQueries({ queryKey: ['follow', variables.id] })
      addToast('Unfollowed successfully', 'success')
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unfollow'
      addToast(errorMessage, 'error')
    },
  })
}
