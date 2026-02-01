'use client'

import { cn } from '@/lib/utils'
import { planningTypography } from './typography'
import { useI18nTranslations } from '@/i18n'

export interface PriceSummaryProps {
  totalCost: number
  remaining: number
}

export const PriceSummary = ({ totalCost, remaining }: PriceSummaryProps) => {
  const t = useI18nTranslations('preparations')

  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className={cn(planningTypography.secondary, 'text-gray-600')}>
         {t('priceSummary.totalCost')}
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
        {t('priceSummary.remaining')}

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

