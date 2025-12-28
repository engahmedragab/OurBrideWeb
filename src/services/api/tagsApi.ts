// Community Tags API service functions

import { apiClient } from '@/services/api/apiClient'
import type { TagResponse } from '@/types/responses/community'
import type {
  CreateCommunityTagRequest,
  UpdateCommunityTagRequest,
} from '@/../client/common/api/gen/ourbride-api'

/**
 * Get all tags
 */
export const getAllTags = async (): Promise<TagResponse[]> => {
  try {
    const response = await apiClient.api.getTagsGetAll()
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as TagResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as TagResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as TagResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as TagResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch tags')
  }
}

/**
 * Get tag by ID
 */
export const getTagById = async (id: number): Promise<TagResponse | null> => {
  try {
    const response = await apiClient.api.getTagsGetById(id)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as TagResponse
    }
    if (responseAny?.data) {
      return responseAny.data as TagResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as TagResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch tag')
  }
}

/**
 * Get tag by slug
 */
export const getTagBySlug = async (slug: string): Promise<TagResponse | null> => {
  try {
    const response = await apiClient.api.getTagsGetBySlug(slug)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as TagResponse
    }
    if (responseAny?.data) {
      return responseAny.data as TagResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as TagResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch tag by slug')
  }
}

/**
 * Get active tags
 */
export const getActiveTags = async (): Promise<TagResponse[]> => {
  try {
    const allTags = await getAllTags()
    return allTags.filter(tag => tag.isActive)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch active tags')
  }
}

/**
 * Get featured tags
 */
export const getFeaturedTags = async (): Promise<TagResponse[]> => {
  try {
    const allTags = await getAllTags()
    return allTags.filter(tag => tag.isFeatured)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch featured tags')
  }
}

/**
 * Get most used tags
 */
export const getMostUsedTags = async (count: number = 10): Promise<TagResponse[]> => {
  try {
    const allTags = await getAllTags()
    return allTags
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, count)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch most used tags')
  }
}

/**
 * Search tags
 */
export const searchTags = async (searchTerm: string): Promise<TagResponse[]> => {
  try {
    const response = await apiClient.api.getTagsSearch({ searchTerm })
    const responseAny: any = response
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as TagResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as TagResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as TagResponse[]
    }
    if (Array.isArray(responseAny)) {
      return responseAny as TagResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to search tags')
  }
}

/**
 * Create a new tag
 */
export const createTag = async (data: CreateCommunityTagRequest): Promise<TagResponse | null> => {
  try {
    const response = await apiClient.api.postTagsCreate(data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as TagResponse
    }
    if (responseAny?.data) {
      return responseAny.data as TagResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as TagResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create tag')
  }
}

/**
 * Update a tag
 */
export const updateTag = async (id: number, data: UpdateCommunityTagRequest): Promise<TagResponse | null> => {
  try {
    const response = await apiClient.api.putTagsUpdate(id, data)
    const responseAny: any = response
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as TagResponse
    }
    if (responseAny?.data) {
      return responseAny.data as TagResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as TagResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update tag')
  }
}

/**
 * Delete a tag
 */
export const deleteTag = async (id: number): Promise<boolean> => {
  try {
    await apiClient.api.deleteTagsDelete(id)
    return true
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete tag')
  }
}





