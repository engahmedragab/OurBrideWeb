/**
 * Reel Response
 */

import type { BaseEntityResponse } from '../common'
import type { UserResponse } from './user-response'
import type { ReviewResponse } from '@/types/responses/review-response'
import type {
  CategorySummaryResponse,
  ItemSummaryResponse,
  PreparationSummaryResponse,
  ProviderSummaryResponse,
  BazaarEventSummaryResponse,
  TagResponse,
} from './index'

export interface ReelResponse extends BaseEntityResponse {
  // Basic Information
  title: string
  description: string
  caption: string

  // Video Information
  videoUrl: string
  thumbnailUrl: string
  duration: number | null
  width: number | null
  height: number | null
  fileSize: number | null // long in C#

  // Status and Visibility
  isPublished: boolean
  isFeatured: boolean
  isPinned: boolean
  allowComments: boolean
  isAnonymous: boolean
  requiresApproval: boolean
  isApproved: boolean

  // Reel Type
  reelType: string

  // Music/Audio Information
  musicTitle: string
  musicArtist: string
  musicUrl: string

  // User Information
  userId: string // Guid
  user: UserResponse | null

  // Editor/Approver Information
  approvedBy: string | null // Guid
  approvedByUser: UserResponse | null
  approvedAt: string | null // ISO date string

  // Analytics
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  favoriteCount: number
  reviewCount: number
  playCount: number

  // Publishing
  publishedAt: string | null // ISO date string
  scheduledPublishDate: string | null // ISO date string

  // Ratings
  rate: number | null

  // Reviews
  reviews: ReviewResponse[]

  // Many-to-Many Relations
  categories: CategorySummaryResponse[]
  items: ItemSummaryResponse[]
  preparations: PreparationSummaryResponse[]
  providers: ProviderSummaryResponse[]
  bazaarEvents: BazaarEventSummaryResponse[]
  tags: TagResponse[]
}




