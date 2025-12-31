/**
 * Community Profile Response
 */

import type { UnifiedCommunityContentResponse } from './unified-community-content-response'
import type { UserProfileInfo } from './user-profile-info-response'
import type { ProviderProfileInfo } from './provider-profile-info-response'
import type { BazaarEventProfileInfo } from './bazaar-event-profile-info-response'

export interface CommunityProfileResponse {
  id: number
  profileType: string // "User", "Provider", "BazaarEvent"
  profileId: number
  displayName: string
  bio: string
  avatarUrl: string
  coverImageUrl: string

  // Statistics
  totalPosts: number
  totalBlogs: number
  totalArticles: number
  totalReels: number
  totalDecisionGroups: number
  totalContests: number
  totalContent: number // Sum of all content types
  totalLikes: number
  totalFollowers: number
  totalFollowing: number
  totalFavorites: number
  totalViews: number

  // User relationship status
  isLiked: boolean
  isFollowing: boolean
  isFavorited: boolean

  // Content collections (paginated)
  recentContent: UnifiedCommunityContentResponse[]
  featuredContent: UnifiedCommunityContentResponse[]

  // Additional profile info based on type
  userInfo: UserProfileInfo | null
  providerInfo: ProviderProfileInfo | null
  bazaarEventInfo: BazaarEventProfileInfo | null
}










