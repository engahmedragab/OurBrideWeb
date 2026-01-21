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
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as unknown as FollowResponse
      }
      if (data && typeof data === 'object') {
        return data as unknown as FollowResponse
      }
    }
    return responseAny as unknown as FollowResponse
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
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as unknown as FollowResponse
      }
      if (data && typeof data === 'object') {
        return data as unknown as FollowResponse
      }
    }
    return responseAny as unknown as FollowResponse
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
}): Promise<FollowResponse[]> => {
  try {
    const response = await apiClient.api.getFollowGetAll(query)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle the actual response structure: { data: [...], success, statusCode, message, errors }
    // The API might return: response.data.data or response.data
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as FollowResponse[]
      }
      if (Array.isArray(data)) {
        return data as FollowResponse[]
      }
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items as FollowResponse[]
      }
    }
    
    // Fallback for direct array
    if (Array.isArray(responseAny)) {
      return responseAny as FollowResponse[]
    }
    
    return []
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
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as unknown as FollowResponse
      }
      if (data && typeof data === 'object') {
        return data as unknown as FollowResponse
      }
    }
    return responseAny as unknown as FollowResponse
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
    // Cast source to the expected Source type from the API client
    const response = await apiClient.api.getFollowGetBySource(source as unknown as Parameters<typeof apiClient.api.getFollowGetBySource>[0], sourceId, query)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as unknown as PaginatedList<FollowResponse>
      }
      if (data && typeof data === 'object') {
        return data as unknown as PaginatedList<FollowResponse>
      }
    }
    return responseAny as unknown as PaginatedList<FollowResponse>
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch follows by source'
    )
  }
}
