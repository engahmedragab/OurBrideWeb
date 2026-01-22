'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ContestCard } from './ContestCard'
import { CommunityEmptyState } from './CommunityEmptyState'
import type { LeaderboardContestResponse } from '@/types/responses/community'
import { useI18nTranslations } from '@/i18n'

export interface ContestsFeedProps {
  className?: string
  contests?: LeaderboardContestResponse[]
}

export const ContestsFeed = ({ className, contests = [] }: ContestsFeedProps) => {
  const t = useI18nTranslations("community")
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
          title={t("states.noContestsTitle")}
          message={t("states.noContestsMessage")}
          compact
        />
      )}
    </div>
  )
}













