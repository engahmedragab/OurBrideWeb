import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export type EventStatus = 'pending' | 'confirmed' | 'canceled'

export interface CalendarEventBlockProps {
  title: string
  customerName?: string
  status: EventStatus
  timeRange?: string
  className?: string
}

/**
 * CalendarEventBlock Component
 * Displays an event block in the calendar timeline with status-based styling
 */
export const CalendarEventBlock = ({
  title,
  customerName,
  status,
  timeRange,
  className,
}: CalendarEventBlockProps) => {
  const statusStyles = {
    pending: {
      bg: 'bg-blue-100',
      border: 'border-blue-400',
      titleColor: 'text-blue-500',
      textColor: 'text-blue-300',
      iconColor: 'text-blue-300',
    },
    confirmed: {
      bg: 'bg-green-100',
      border: 'border-green-500',
      titleColor: 'text-green-600',
      textColor: 'text-green-500',
      iconColor: 'text-green-500',
    },
    canceled: {
      bg: 'bg-red-100',
      border: 'border-red-400',
      titleColor: 'text-red-500',
      textColor: 'text-red-300',
      iconColor: 'text-red-300',
    },
  }

  const styles = statusStyles[status]
  const statusLabel =
    status === 'pending'
      ? 'Pending'
      : status === 'confirmed'
        ? 'Confirmed'
        : 'Canceled'

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-3 border-l-[3px]',
        styles.bg,
        styles.border,
        className
      )}
    >
      {/* Top Row: Title + Status */}
      <div className="flex gap-0.5 items-start">
        <p
          className={cn(
            'flex-1 text-16 font-medium truncate',
            styles.titleColor
          )}
        >
          {title}
        </p>
        <p className={cn('text-16 font-normal truncate', styles.titleColor)}>
          {statusLabel}
        </p>
      </div>

      {/* Bottom Row: Customer Name + Time */}
      <div className="flex gap-0.5 items-start">
        {customerName && (
          <p
            className={cn(
              'flex-1 text-12 font-normal truncate',
              styles.textColor
            )}
          >
            {customerName}
          </p>
        )}
        {timeRange && (
          <div className="flex gap-0.5 items-center shrink-0">
            <Clock className={cn('size-4', styles.iconColor)} />
            <p className={cn('text-14 font-normal', styles.textColor)}>
              {timeRange}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
