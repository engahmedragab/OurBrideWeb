'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useI18nTranslations } from '@/i18n'

export interface ItemsSummaryCardProps {
  title: string
  total: number
  completed: number
  rightSlot?: React.ReactNode
  className?: string
}

export const ItemsSummaryCard = ({
  title,
  total,
  completed,
  rightSlot,
  className,
}: ItemsSummaryCardProps) => {
  const pending = Math.max(0, total - completed)
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0
  const t = useI18nTranslations('items')
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-4', className)}>
      {/* Header */}
      <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
        <h3 className="min-w-0 text-lg font-semibold text-gray-900 truncate">{title}</h3>
        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>

      {/* Subtitle */}
      <p className="mb-3 text-xs text-gray-500">
      {t('progress.itemsCompleted', {completed,total,})}
      </p>

      {/* Progress Bar */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{total}</p>
          <p className="mt-0.5 text-xs text-gray-500">{t('itemForm.checkbox.total')}</p>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-green-500">{completed}</p>
          <p className="mt-0.5 text-xs text-gray-500">{t('itemForm.checkbox.completed')}</p>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-yellow-600">{pending}</p>
          <p className="mt-0.5 text-xs text-gray-500">{t('itemForm.checkbox.stillOnTheWay')}</p>
        </div>
      </div>
    </div>
  )
}
