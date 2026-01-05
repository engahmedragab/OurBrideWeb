// Unified Community Content API service functions

import { apiClient } from '@/services/api/apiClient'
import type { UnifiedCommunityContentResponse } from '@/types/responses/community'

/**
 * Get all unified content by category ID
 */
export const getAllByCategoryId = async (
  categoryId: number,
  params?: {
    page?: number
    pageSize?: number
  }
): Promise<UnifiedCommunityContentResponse[]> => {
  try {
    const response = await apiClient.api.getUnifiedContentGetByCategory(
      categoryId,
      params
    )
    const responseAny: any = response

    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as UnifiedCommunityContentResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as UnifiedCommunityContentResponse[]
    }

    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch unified content by category'
    )
  }
}

/**
 * Get all unified content by item ID
 */
export const getAllByItemId = async (
  itemId: number,
  params?: {
    page?: number
    pageSize?: number
  }
): Promise<UnifiedCommunityContentResponse[]> => {
  try {
    const response = await apiClient.api.getUnifiedContentGetByItem(
      itemId,
      params
    )
    const responseAny: any = response

    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as UnifiedCommunityContentResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as UnifiedCommunityContentResponse[]
    }

    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch unified content by item'
    )
  }
}

/**
 * Get all unified content by preparation ID
 */
export const getAllByPreparationId = async (
  preparationId: number,
  params?: {
    page?: number
    pageSize?: number
  }
): Promise<UnifiedCommunityContentResponse[]> => {
  try {
    const response = await apiClient.api.getUnifiedContentGetByPreparation(
      preparationId,
      params
    )
    const responseAny: any = response

    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as UnifiedCommunityContentResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as UnifiedCommunityContentResponse[]
    }

    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch unified content by preparation'
    )
  }
}

/**
 * Get all unified content by provider ID
 */
export const getAllByProviderId = async (
  providerId: number,
  params?: {
    page?: number
    pageSize?: number
  }
): Promise<UnifiedCommunityContentResponse[]> => {
  try {
    const response = await apiClient.api.getUnifiedContentGetByProvider(
      providerId,
      params
    )
    const responseAny: any = response

    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as UnifiedCommunityContentResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as UnifiedCommunityContentResponse[]
    }

    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch unified content by provider'
    )
  }
}

/**
 * Get all unified content by bazaar event ID
 */
export const getAllByBazaarEventId = async (
  bazaarEventId: number,
  params?: {
    page?: number
    pageSize?: number
  }
): Promise<UnifiedCommunityContentResponse[]> => {
  try {
    const response = await apiClient.api.getUnifiedContentGetByBazaarEvent(
      bazaarEventId,
      params
    )
    const responseAny: any = response

    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as UnifiedCommunityContentResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as UnifiedCommunityContentResponse[]
    }

    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch unified content by bazaar event'
    )
  }
}

/**
 * Search unified content with optional filters
 */
export const search = async (params?: {
  categoryId?: number
  itemId?: number
  preparationId?: number
  providerId?: number
  bazaarEventId?: number
  tagIds?: string
  page?: number
  pageSize?: number
}): Promise<UnifiedCommunityContentResponse[]> => {
  try {
    // Filter out undefined values to ensure API is called with valid params
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== undefined)
        )
      : undefined

    // Log API call for debugging
    console.log('[UnifiedContentSearch] Calling API with params:', cleanParams)

    const response = await apiClient.api.getUnifiedContentSearch(cleanParams)

    console.log('[UnifiedContentSearch] API response:', response)
    const responseAny: any = response

    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as UnifiedCommunityContentResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as UnifiedCommunityContentResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as UnifiedCommunityContentResponse[]
    }

    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to search unified content'
    )
  }
}
