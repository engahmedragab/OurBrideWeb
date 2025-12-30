'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DecisionGroupCard } from './DecisionGroupCard'
import type { DecisionGroupResponse } from '@/types/responses/community'

export interface DecisionGroupsFeedProps {
  className?: string
  decisionGroups?: DecisionGroupResponse[]
}

export const DecisionGroupsFeed = ({ className, decisionGroups = [] }: DecisionGroupsFeedProps) => {
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
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No decision groups available yet</p>
        </div>
      )}
    </div>
  )
}









