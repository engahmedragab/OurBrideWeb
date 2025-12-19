'use client'

import { cn } from '@/lib/utils'
import { planningTypography } from './typography'

export interface PriceSummaryProps {
  totalCost: number
  remaining: number
}

export const PriceSummary = ({ totalCost, remaining }: PriceSummaryProps) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className={cn(planningTypography.secondary, 'text-gray-600')}>
          Total Cost
        </span>
        <span
          className={cn(
            planningTypography.bodyMedium,
            'text-primary font-semibold'
          )}
        >
          {totalCost.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className={cn(planningTypography.secondary, 'text-gray-600')}>
          Remaining
        </span>
        <span
          className={cn(
            planningTypography.bodyMedium,
            'text-gray-900 font-semibold'
          )}
        >
          {remaining.toFixed(2)}
        </span>
      </div>
    </div>
  )
}

