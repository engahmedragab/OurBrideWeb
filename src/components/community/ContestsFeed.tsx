'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ContestCard } from './ContestCard'
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
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No contests available yet</p>
        </div>
      )}
    </div>
  )
}










