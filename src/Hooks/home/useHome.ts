import { useQuery } from '@tanstack/react-query'
import { getHomeData, getStoreHomeData, getCommunityHome, getMineInfo } from '@/services/api/home.api'
import type { CommunityHomeResponse } from '@/types/responses/community/community-home-response'

/**
 * Hook to fetch home page data
 */
export const useHome = (enabled = true) => {
  return useQuery({
    queryKey: ['home'],
    queryFn: async () => {
      const data = await getHomeData()
      return data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch store home page data
 */
export const useStoreHome = (enabled = true) => {
  return useQuery({
    queryKey: ['store-home'],
    queryFn: async () => {
      const data = await getStoreHomeData()
      return data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch community home page data
 */
export const useCommunityHome = (query?: {
  postsCount?: number
  articlesCount?: number
  suggestedUsersCount?: number
  topProvidersCount?: number
  tagIds?: string
  tagsCount?: number
}, enabled = true) => {
  return useQuery<CommunityHomeResponse>({
    queryKey: ['community-home', query],
    queryFn: async () => {
      const data = await getCommunityHome(query)
      return data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch mine info (user profile information)
 */
export const useMineInfo = (enabled = true) => {
  return useQuery({
    queryKey: ['mine-info'],
    queryFn: async () => {
      const data = await getMineInfo()
      return data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
