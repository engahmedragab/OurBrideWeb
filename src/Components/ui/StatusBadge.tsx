'use client'

import { CheckCircle2, X, Snowflake } from 'lucide-react'
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
    icon: CheckCircle2,
    defaultLabel: 'Done',
  },
  delivered: {
    bgColor: 'bg-green-500',
    icon: CheckCircle2,
    defaultLabel: 'Done',
  },
  cancelled: {
    bgColor: 'bg-red-500',
    icon: X,
    defaultLabel: 'Canceled',
  },
  inProgress: {
    bgColor: 'bg-blue-500',
    icon: Snowflake,
    defaultLabel: 'In Progress',
  },
}

export const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full text-14 font-normal text-white',
        config.bgColor,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label || config.defaultLabel}</span>
    </div>
  )
}
