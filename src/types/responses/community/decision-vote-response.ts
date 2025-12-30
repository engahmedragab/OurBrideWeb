/**
 * Decision Vote Response
 */

import type { BaseEntityResponse } from '../common'
import type { UserResponse } from './user-response'

export interface DecisionVoteResponse extends BaseEntityResponse {
  decisionGroupId: number
  decisionOptionId: number
  userId: string // Guid
  user: UserResponse | null
  votedAt: string // ISO date string
  isAnonymous: boolean
}









