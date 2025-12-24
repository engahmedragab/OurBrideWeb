// Follow API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  CreateFollowRequest,
  UpdateFollowRequest,
} from '@/../client/common/api/gen/ourbride-api'
import type {
  PaginatedList,
  FollowResponse,
} from '@/types/responses'

/**
 * Get follow by ID
 */
export const getFollowById = async (
  id: number,
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
    userId?: string
  }
): Promise<FollowResponse> => {
  try {
    const response = await apiClient.api.getFollowGetById(id, query)
    const responseAny = response as any
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as FollowResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch follow'
    )
  }
}

/**
 * Update follow
 */
export const updateFollow = async (
  id: number,
  data: UpdateFollowRequest,
  query?: {
    userId?: string
  }
): Promise<FollowResponse> => {
  try {
    const response = await apiClient.api.putFollowUpdate(id, data, query)
    const responseAny = response as any
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as FollowResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update follow'
    )
  }
}

/**
 * Delete follow
 */
export const deleteFollow = async (
  id: number,
  query?: {
    userId?: string
  }
): Promise<void> => {
  try {
    await apiClient.api.deleteFollowDelete(id, query)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to delete follow'
    )
  }
}

/**
 * Get all follows (paginated)
 */
export const getAllFollows = async (query?: {
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
}): Promise<PaginatedList<FollowResponse>> => {
  try {
    const response = await apiClient.api.getFollowGetAll(query)
    const responseAny = response as any
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as PaginatedList<FollowResponse>
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch follows'
    )
  }
}

/**
 * Create follow
 */
export const createFollow = async (
  data: CreateFollowRequest,
  query?: {
    userId?: string
  }
): Promise<FollowResponse> => {
  try {
    const response = await apiClient.api.postFollowCreate(data, query)
    const responseAny = response as any
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as FollowResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create follow'
    )
  }
}

/**
 * Get follows by source
 * Note: This endpoint requires both source and sourceId parameters
 */
export const getFollowsBySource = async (
  source: string,
  sourceId: number,
  query?: {
    page?: number
    pageSize?: number
  }
): Promise<PaginatedList<FollowResponse>> => {
  try {
    const response = await apiClient.api.getFollowGetBySource(source as any, sourceId, query)
    const responseAny = response as any
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as PaginatedList<FollowResponse>
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch follows by source'
    )
  }
}
