import { useQuery } from '@tanstack/react-query'
import { getHomeData, getStoreHomeData, getCommunityHome, getMineInfo, getProviderHome, getStoreHomeByProvider } from '@/services/api/home.api'
import { getUserMainIds } from '@/services/api/mineInfoApi'
import type { UserMainIdsResponse } from '@/types/responses'
import { useAuth } from '@/auth'
import type { CommunityHomeResponse } from '@/types/responses/community/community-home-response'
import type { ProviderHomeResponse } from '@/types/responses/provider-home-response'

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
  const { isAuthenticated, isLoading } = useAuth()
  const isEnabled = enabled && !isLoading && isAuthenticated
  return useQuery({
    queryKey: ['mine-info'],
    queryFn: async () => {
      const data = await getMineInfo()
      return data
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch user main IDs (follows, wishlists, cart, carts-with-providers)
 */
export const useMainIds = (
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
    page?: number
    pageSize?: number
  },
  enabled = true
) => {
  const { isAuthenticated, isLoading } = useAuth()
  const isEnabled = enabled && !isLoading && isAuthenticated
  return useQuery<UserMainIdsResponse>({
    queryKey: ['main-ids', query],
    queryFn: async () => {
      const data = await getUserMainIds(query)
      return data
    },
    enabled: isEnabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch provider home page data
 */
export const useProviderHome = (enabled = true) => {
  return useQuery<ProviderHomeResponse>({
    queryKey: ['provider-home'],
    queryFn: async () => {
      const data = await getProviderHome()
      return data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch store home page data by provider
 */
export const useStoreHomeByProvider = (
  query?: {
    providerId?: number
    branchId?: number
    staffId?: string
  },
  enabled = true
) => {
  return useQuery({
    queryKey: ['store-home-by-provider', query],
    queryFn: async () => {
      const data = await getStoreHomeByProvider(query)
      return data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
