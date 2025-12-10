'use client'

import { CheckCircle2, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatusBadgeType =
  | 'completed'
  | 'delivered'
  | 'cancelled'
  | 'inProgress'

export interface StatusBadgeProps {
  status: StatusBadgeType
  label?: string
  className?: string
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

export const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const config = statusConfig[status]
  const Icon = config.icon
  const textColor = config.textColor || 'text-white'

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-14 font-normal',
        config.bgColor,
        textColor,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label || config.defaultLabel}</span>
    </div>
  )
}
