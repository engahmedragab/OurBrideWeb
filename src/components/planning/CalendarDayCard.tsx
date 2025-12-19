'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface CalendarDayCardProps {
  dayId: string
  date: Date
  eventsCount?: number
  variant?: 'default' | 'selected' | 'hasEvents'
  isSelected?: boolean
  isBigDay?: boolean
  onClick?: () => void
  className?: string
}

export const CalendarDayCard = ({
  dayId,
  date,
  eventsCount = 0,
  variant = 'default',
  isSelected: propIsSelected,
  isBigDay = false,
  onClick,
  className,
}: CalendarDayCardProps) => {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/events/planning/calendar/${dayId}`)
    }
  }

  const dayNumber = date.getDate()
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })

  const isSelected = propIsSelected ?? variant === 'selected'
  const hasEvents = variant === 'hasEvents' || eventsCount > 0

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex flex-1 flex-col gap-2 items-center p-2 rounded-lg border transition-all hover:shadow-sm',
        isSelected
          ? 'bg-brand-100 border-brand-400'
          : 'bg-white border-gray-100',
        className
      )}
    >
      <p className="text-12 text-gray-900">{dayName}</p>
      <p className="text-20 font-normal text-gray-900">{dayNumber}</p>
      {isBigDay && (
        <div className="w-full">
          <div className="bg-brand-100 border-[0.5px] border-brand-400 rounded px-1 py-1">
            <p className="text-10 text-brand-700 truncate">Big Day</p>
          </div>
        </div>
      )}
      {!isBigDay && hasEvents && eventsCount > 0 && (
        <div className="w-full flex flex-col gap-1">
          <div className="bg-green-100 border-[0.5px] border-green-500 rounded px-1 py-1">
            <p className="text-10 text-green-700 truncate">Event</p>
          </div>
          {eventsCount > 1 && (
            <div className="bg-white border-[0.5px] border-gray-500 rounded px-1 py-1">
              <p className="text-8 font-medium text-gray-500">+ {eventsCount - 1} More</p>
            </div>
          )}
        </div>
      )}
    </button>
  )
}

