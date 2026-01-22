'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DecisionGroupCard } from './DecisionGroupCard'
import { CommunityEmptyState } from './CommunityEmptyState'
import type { DecisionGroupResponse } from '@/types/responses/community'
import { useI18nTranslations } from '@/i18n'

export interface DecisionGroupsFeedProps {
  className?: string
  decisionGroups?: DecisionGroupResponse[]
}

export const DecisionGroupsFeed = ({ className, decisionGroups = [] }: DecisionGroupsFeedProps) => {
  const t = useI18nTranslations("community")
  const router = useRouter()

  return (
    <div className={cn('flex-1 space-y-6', className)}>
      {decisionGroups.length > 0 ? (
        decisionGroups.map(group => (
          <DecisionGroupCard
            key={group.id}
            decisionGroup={group}
            onClick={() => router.push(`/community/decision-groups/${group.id}`)}
          />
        ))
      ) : (
        <CommunityEmptyState
          title={t("decisionGroupDetails.noDecisionGroupsTitle")}
          message={t("decisionGroupDetails.noDecisionGroupsMessage")}
          compact
        />
      )}
    </div>
  )
}













