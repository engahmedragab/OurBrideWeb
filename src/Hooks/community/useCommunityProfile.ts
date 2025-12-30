/**
 * Community Profile React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserProfile,
  getProviderProfile,
  getBazaarEventProfile,
  toggleLike,
  toggleFollow,
  toggleFavorite,
  isLiked,
  isFollowing,
  isFavorited,
} from '@/services/api/communityProfilesApi'
import type { CommunityProfileResponse } from '@/types/responses/community'
import { isAuthenticated } from '@/auth/utils/token'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

/**
 * Hook to fetch user profile
 */
export const useUserProfile = (userId: string | null, enabled: boolean = true) => {
  const authenticated = isAuthenticated()

  return useQuery<CommunityProfileResponse | null>({
    queryKey: ['communityProfile', 'user', userId],
    queryFn: async () => {
      if (!userId) return null
      return await getUserProfile(userId)
    },
    enabled: enabled && authenticated && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch provider profile
 */
export const useProviderProfile = (providerId: number | null, enabled: boolean = true) => {
  const authenticated = isAuthenticated()

  return useQuery<CommunityProfileResponse | null>({
    queryKey: ['communityProfile', 'provider', providerId],
    queryFn: async () => {
      if (!providerId) return null
      return await getProviderProfile(providerId)
    },
    enabled: enabled && authenticated && !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch bazaar event profile
 */
export const useBazaarEventProfile = (bazaarEventId: number | null, enabled: boolean = true) => {
  const authenticated = isAuthenticated()

  return useQuery<CommunityProfileResponse | null>({
    queryKey: ['communityProfile', 'bazaarEvent', bazaarEventId],
    queryFn: async () => {
      if (!bazaarEventId) return null
      return await getBazaarEventProfile(bazaarEventId)
    },
    enabled: enabled && authenticated && !!bazaarEventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch community profile by type
 */
export const useCommunityProfile = (
  profileType: 'User' | 'Provider' | 'BazaarEvent',
  id: string | number | null,
  enabled: boolean = true
) => {
  const userProfile = useUserProfile(
    profileType === 'User' ? (id as string) : null,
    enabled && profileType === 'User'
  )
  const providerProfile = useProviderProfile(
    profileType === 'Provider' ? (id as number) : null,
    enabled && profileType === 'Provider'
  )
  const bazaarEventProfile = useBazaarEventProfile(
    profileType === 'BazaarEvent' ? (id as number) : null,
    enabled && profileType === 'BazaarEvent'
  )

  // Return the appropriate query based on profile type
  if (profileType === 'User') {
    return userProfile
  }
  if (profileType === 'Provider') {
    return providerProfile
  }
  return bazaarEventProfile
}

/**
 * Hook to toggle like on a profile
 */
export const useToggleProfileLike = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (params: {
      profileType?: string
      profileId?: number
      profileUserId?: string
    }) => {
      return await toggleLike(params)
    },
    onSuccess: (response, variables) => {
      // Invalidate profile queries to refetch updated like status
      queryClient.invalidateQueries({
        queryKey: ['communityProfile'],
      })
      
      const { message, type } = handleApiResponseForToast(
        response,
        'Like toggled successfully',
        'Failed to toggle like'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle like'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to toggle follow on a profile
 */
export const useToggleProfileFollow = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (params: {
      profileType?: string
      profileId?: number
      profileUserId?: string
    }) => {
      return await toggleFollow(params)
    },
    onSuccess: (response, variables) => {
      // Invalidate profile queries to refetch updated follow status
      queryClient.invalidateQueries({
        queryKey: ['communityProfile'],
      })
      
      const { message, type } = handleApiResponseForToast(
        response,
        'Follow toggled successfully',
        'Failed to toggle follow'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle follow'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to toggle favorite on a profile
 */
export const useToggleProfileFavorite = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (params: {
      profileType?: string
      profileId?: number
      profileUserId?: string
    }) => {
      return await toggleFavorite(params)
    },
    onSuccess: (response, variables) => {
      // Invalidate profile queries to refetch updated favorite status
      queryClient.invalidateQueries({
        queryKey: ['communityProfile'],
      })
      
      const { message, type } = handleApiResponseForToast(
        response,
        'Favorite toggled successfully',
        'Failed to toggle favorite'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle favorite'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to check if profile is liked
 */
export const useProfileIsLiked = (params: {
  profileType?: string
  profileId?: number
  profileUserId?: string
}) => {
  return useQuery<boolean>({
    queryKey: ['communityProfile', 'isLiked', params],
    queryFn: async () => {
      return await isLiked(params)
    },
    enabled: !!(params.profileType && (params.profileId || params.profileUserId)),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to check if profile is being followed
 */
export const useProfileIsFollowing = (params: {
  profileType?: string
  profileId?: number
  profileUserId?: string
}) => {
  return useQuery<boolean>({
    queryKey: ['communityProfile', 'isFollowing', params],
    queryFn: async () => {
      return await isFollowing(params)
    },
    enabled: !!(params.profileType && (params.profileId || params.profileUserId)),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to check if profile is favorited
 */
export const useProfileIsFavorited = (params: {
  profileType?: string
  profileId?: number
  profileUserId?: string
}) => {
  return useQuery<boolean>({
    queryKey: ['communityProfile', 'isFavorited', params],
    queryFn: async () => {
      return await isFavorited(params)
    },
    enabled: !!(params.profileType && (params.profileId || params.profileUserId)),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}









