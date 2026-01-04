import { useQuery } from '@tanstack/react-query'
import { getPlanningPreferences } from '@/services/profile/profileApi'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch all preparations (services) from API
 */
export const usePreparations = (options?: { enabled?: boolean }) => {
  const { enabled = true } = options || {}
  const authenticated = isAuthenticated()

  return useQuery({
    queryKey: ['preparations'],
    queryFn: async () => {
      return await getPlanningPreferences()
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

