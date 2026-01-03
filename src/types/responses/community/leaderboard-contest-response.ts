/**
 * Leaderboard Contest Response
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
  ContestParticipantResponse,
  ContestLeaderboardResponse,
} from './index'

export interface LeaderboardContestResponse extends BaseEntityResponse {
  // Basic Information
  title: string
  description: string
  rules: string
  prizes: string

  // Status and Visibility
  isPublished: boolean
  isActive: boolean
  isFeatured: boolean
  isPinned: boolean
  allowComments: boolean
  isAnonymous: boolean
  requiresApproval: boolean
  isApproved: boolean

  // Contest Type
  contestType: string
  scoringMethod: string

  // User Information
  userId: string // Guid
  user: UserResponse | null

  // Editor/Approver Information
  approvedBy: string | null // Guid
  approvedByUser: UserResponse | null
  approvedAt: string | null // ISO date string

  // Contest Settings
  startDate: string | null // ISO date string
  endDate: string | null // ISO date string
  registrationStartDate: string | null // ISO date string
  registrationEndDate: string | null // ISO date string
  maxParticipants: number
  minParticipants: number
  currentParticipants: number
  allowLateRegistration: boolean

  // Analytics
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  favoriteCount: number
  reviewCount: number
  totalSubmissions: number
  totalVotes: number

  // Publishing
  publishedAt: string | null // ISO date string
  scheduledPublishDate: string | null // ISO date string

  // Ratings
  rate: number | null

  // Reviews
  reviews: ReviewResponse[]

  // Participants
  participants: ContestParticipantResponse[]

  // Leaderboard
  leaderboard: ContestLeaderboardResponse[]

  // Many-to-Many Relations
  categories: CategorySummaryResponse[]
  items: ItemSummaryResponse[]
  preparations: PreparationSummaryResponse[]
  providers: ProviderSummaryResponse[]
  bazaarEvents: BazaarEventSummaryResponse[]
  tags: TagResponse[]
}


















