/**
 * Community Home Response
 */

import type { PostResponse } from './post-response'
import type { ArticleResponse } from './article-response'
import type { TagResponse } from './tag-response'
import type { UserResponse } from './user-response'
import type { SuggestedUserResponse } from './suggested-user-response'
import type { SuggestedProviderResponse } from './suggested-provider-response'

export interface CommunityHomeResponse {
  // Recent posts for the feed
  recentPosts: PostResponse[]

  // Recent articles (limited preview for sidebar)
  recentArticles: ArticleResponse[]

  // Suggested users to follow
  suggestedUsers: SuggestedUserResponse[]

  // Top providers to follow
  topProviders: SuggestedProviderResponse[]

  // Current user profile information (if authenticated)
  currentUser: UserResponse | null

  // Featured/active tags for filtering
  tags: TagResponse[]
}
