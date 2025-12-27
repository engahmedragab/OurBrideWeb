/**
 * Unified Content Search React Query Hook
 */

import { useQuery } from '@tanstack/react-query'
import { search } from '@/services/api/unifiedContentApi'
import type { UnifiedCommunityContentResponse } from '@/types/responses/community'

/**
 * Hook to search unified community content
 */
export const useUnifiedContentSearch = (
  params?: {
    categoryId?: number
    itemId?: number
    preparationId?: number
    providerId?: number
    bazaarEventId?: number
    tagIds?: string
    page?: number
    pageSize?: number
    enabled?: boolean
  }
) => {
  const { enabled = true, ...searchParams } = params || {}

  return useQuery<UnifiedCommunityContentResponse[]>({
    queryKey: ['community', 'unified-content', 'search', searchParams],
    queryFn: async () => {
      return await search(searchParams)
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

