/**
 * Contest Participant Response
 */

import type { BaseEntityResponse } from '../common'
import type { UserResponse } from './user-response'

export interface ContestParticipantResponse extends BaseEntityResponse {
  contestId: number
  userId: string // Guid
  user: UserResponse | null
  registeredAt: string // ISO date string
  submittedAt: string | null // ISO date string
  isActive: boolean
  isDisqualified: boolean
  disqualificationReason: string

  // Scoring
  totalPoints: number
  totalVotes: number
  totalLikes: number
  totalViews: number
  score: number
  rank: number

  // Submission
  submissionContent: string
  submissionUrl: string
}










