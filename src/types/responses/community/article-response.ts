/**
 * Article Response
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

export interface ArticleResponse extends BaseEntityResponse {
  // Basic Information
  title: string
  content: string
  summary: string
  excerpt: string

  // SEO and Metadata
  metaTitle: string
  metaDescription: string
  keywords: string

  // Status and Visibility
  isPublished: boolean
  isFeatured: boolean
  isPinned: boolean
  allowComments: boolean
  isAnonymous: boolean
  requiresApproval: boolean
  isApproved: boolean

  // Article Type
  articleType: string

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
  readingTime: number

  // Publishing
  publishedAt: string | null // ISO date string
  scheduledPublishDate: string | null // ISO date string

  // Author Information
  authorName: string
  authorBio: string

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





