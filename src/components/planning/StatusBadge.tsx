'use client'

import { cn } from '@/lib/utils'
import { useI18nTranslations } from '@/i18n'

export type ServiceStatus = 'completed' | 'in-progress'

export interface StatusBadgeProps {
  status: ServiceStatus
  className?: string
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const t = useI18nTranslations('eventsPlanning.preparations.status')
  const isCompleted = status === 'completed'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        isCompleted
          ? 'bg-green-100 text-green-500 border-green-500'
          : 'bg-yellow-100 text-yellow-600 border-yellow-600',
        className
      )}
    >
      {isCompleted ? t('completed') : t('stillOnTheWay')}
    </span>
  )
}

