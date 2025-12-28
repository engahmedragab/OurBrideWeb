/**
 * Unified Community Content Response
 */

import type {
  PostResponse,
  BlogResponse,
  ArticleResponse,
  ReelResponse,
  DecisionGroupResponse,
  LeaderboardContestResponse,
} from './index'

export interface UnifiedCommunityContentResponse {
  contentType: string // "Post", "Blog", "Article", "Reel", "DecisionGroup", "Contest"
  id: number
  title: string
  summary: string
  isPublished: boolean
  isFeatured: boolean
  viewCount: number
  likeCount: number
  commentCount: number
  rate: number | null
  publishedAt: string | null // ISO date string
  creationDate: string // ISO date string
  userId: string | null // Guid
  userName: string

  // Type-specific data
  post: PostResponse | null
  blog: BlogResponse | null
  article: ArticleResponse | null
  reel: ReelResponse | null
  decisionGroup: DecisionGroupResponse | null
  contest: LeaderboardContestResponse | null
}





