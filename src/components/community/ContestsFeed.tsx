'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ContestCard } from './ContestCard'
import { CommunityEmptyState } from './CommunityEmptyState'
import type { LeaderboardContestResponse } from '@/types/responses/community'

export interface ContestsFeedProps {
  className?: string
  contests?: LeaderboardContestResponse[]
}

export const ContestsFeed = ({ className, contests = [] }: ContestsFeedProps) => {
  const router = useRouter()

  return (
    <div className={cn('flex-1 space-y-6', className)}>
      {contests.length > 0 ? (
        contests.map(contest => (
          <ContestCard
            key={contest.id}
            contest={contest}
            onClick={() => router.push(`/community/contests/${contest.id}`)}
          />
        ))
      ) : (
        <CommunityEmptyState
          title="No Contests Available"
          message="There are no contests to display at the moment."
          compact
        />
      )}
    </div>
  )
}













