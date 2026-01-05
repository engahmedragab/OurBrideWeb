/**
 * Decision Group Response
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
  DecisionOptionResponse,
} from './index'

export interface DecisionGroupResponse extends BaseEntityResponse {
  // Basic Information
  title: string
  description: string
  question: string

  // Status and Visibility
  isPublished: boolean
  isActive: boolean
  isFeatured: boolean
  isPinned: boolean
  allowComments: boolean
  isAnonymous: boolean
  requiresApproval: boolean
  isApproved: boolean
  isMultipleChoice: boolean

  // Decision Type
  decisionType: string

  // User Information
  userId: string // Guid
  user: UserResponse | null

  // Editor/Approver Information
  approvedBy: string | null // Guid
  approvedByUser: UserResponse | null
  approvedAt: string | null // ISO date string

  // Voting/Decision Settings
  votingStartDate: string | null // ISO date string
  votingEndDate: string | null // ISO date string
  totalVotes: number
  totalParticipants: number
  allowMultipleVotes: boolean
  showResultsBeforeEnd: boolean

  // Analytics
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  favoriteCount: number
  reviewCount: number

  // Publishing
  publishedAt: string | null // ISO date string
  scheduledPublishDate: string | null // ISO date string

  // Ratings
  rate: number | null

  // Reviews
  reviews: ReviewResponse[]

  // Decision Options
  options: DecisionOptionResponse[]

  // Many-to-Many Relations
  categories: CategorySummaryResponse[]
  items: ItemSummaryResponse[]
  preparations: PreparationSummaryResponse[]
  providers: ProviderSummaryResponse[]
  bazaarEvents: BazaarEventSummaryResponse[]
  tags: TagResponse[]
}
