/**
 * Contest Leaderboard Response
 */

import type { BaseEntityResponse } from '../common'
import type { ContestParticipantResponse } from './contest-participant-response'

export interface ContestLeaderboardResponse extends BaseEntityResponse {
  contestId: number
  participantId: number
  participant: ContestParticipantResponse | null
  rank: number
  score: number
  points: number
  votes: number
  likes: number
  views: number
  lastUpdated: string // ISO date string
}





