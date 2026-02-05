'use client'

import { CheckCircle2, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18nTranslations } from '@/i18n'

export type StatusBadgeType =
  | 'completed'
  | 'delivered'
  | 'cancelled'
  | 'inProgress'

export interface StatusBadgeProps {
  status: StatusBadgeType
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

const statusConfig = {
  completed: {
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    icon: CheckCircle2,
    defaultLabel: 'Done',
  },
  delivered: {
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    icon: CheckCircle2,
    defaultLabel: 'Done',
  },
  cancelled: {
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    icon: X,
    defaultLabel: 'Canceled',
  },
  inProgress: {
    bgColor: 'bg-yellow-55',
    textColor: 'text-yellow-650',
    icon: Loader2,
    defaultLabel: 'In Progress',
  },
}

export const StatusBadge = ({
  status,
  label,
  className,
  size = 'md',
}: StatusBadgeProps) => {
  const t = useI18nTranslations('statusBadge')
  const config = statusConfig[status]
  const Icon = config.icon
  const textColor = config.textColor || 'text-white'
  const sizeClasses =
    size === 'sm'
      ? {
          container: 'gap-1 px-1.5 py-0.5 text-[9px] leading-none',
          icon: 'h-3.5 w-3.5',
        }
      : {
          container: 'gap-1 px-2 py-1.5 text-[12px]',
          icon: 'h-3.5 w-3.5',
        }

  return (
    <div
      className={cn(
        'flex items-center rounded-full font-normal',
        sizeClasses.container,
        config.bgColor,
        textColor,
        className
      )}
    >
      <Icon className={sizeClasses.icon} />
      <span>{label || t(`default.${status}`)}</span>
    </div>
  )
}
