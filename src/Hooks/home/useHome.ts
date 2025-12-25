import { useQuery } from '@tanstack/react-query'
import { getHomeData, getStoreHomeData } from '@/services/api/home.api'

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

