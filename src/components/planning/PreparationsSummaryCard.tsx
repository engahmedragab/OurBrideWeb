'use client'

import { planningTypography } from './typography'
import { useI18nTranslations } from '@/i18n'

export interface PreparationsSummaryCardProps {
  total: number
  completed: number
}

export const PreparationsSummaryCard = ({
  total,
  completed,
}: PreparationsSummaryCardProps) => {
  const t = useI18nTranslations('eventsPlanning.preparations.summary')
  const inProgress = total - completed
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className={`${planningTypography.sectionTitle} text-gray-900 mb-1`}>
        {t('title')}
      </h3>
      <p className={`${planningTypography.secondary} mb-3`}>
        {t('completedOfTotal', { completed, total })}
      </p>

      {/* Progress Bar - Uses same green as StatusBadge completed status */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="text-center">
          <p className={`${planningTypography.statNumber} text-gray-900`}>{total}</p>
          <p className={`${planningTypography.statLabel} mt-0.5 whitespace-nowrap text-[11px] sm:text-xs`}>{t('total')}</p>
        </div>
        <div className="text-center">
          <p className={`${planningTypography.statNumber} text-green-500`}>{completed}</p>
          <p className={`${planningTypography.statLabel} mt-0.5 whitespace-nowrap text-[11px] sm:text-xs`}>{t('completed')}</p>
        </div>
        <div className="text-center">
          <p className={`${planningTypography.statNumber} text-yellow-600`}>{inProgress}</p>
          <p className={`${planningTypography.statLabel} mt-0.5 whitespace-nowrap text-[11px] sm:text-xs`}>{t('stillOnTheWay')}</p>
        </div>
      </div>
    </div>
  )
}
