'use client'

import { EventWeekHeader } from './EventWeekHeader'
import { EventDayTimeline } from './EventDayTimeline'
import { cn } from '@/lib/utils'

export interface EventCalendarLayoutProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  className?: string
}

/**
 * EventCalendarLayout Component
 * Main layout for the calendar center column with week header and timeline
 */
export const EventCalendarLayout = ({
  selectedDate = new Date(),
  onDateSelect,
  className,
}: EventCalendarLayoutProps) => {
  const getWeekDays = (date: Date) => {
    const weekDays: Array<{ day: number; label: string; date: Date; isSelected: boolean }> = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), diff + i)
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      weekDays.push({
        day: currentDate.getDate(),
        label: dayLabels[currentDate.getDay()],
        date: currentDate,
        isSelected:
          currentDate.getDate() === selectedDate.getDate() &&
          currentDate.getMonth() === selectedDate.getMonth() &&
          currentDate.getFullYear() === selectedDate.getFullYear(),
      })
    }

    return weekDays
  }

  const weekDays = getWeekDays(selectedDate)

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Week Header */}
      <EventWeekHeader
        weekDays={weekDays}
        onDaySelect={(date) => onDateSelect?.(date)}
      />

      {/* Day Timeline */}
      <div className="bg-white rounded-3xl shadow-[0px_0px_9px_0px_rgba(143,144,166,0.15)] p-5">
        <h2 className="text-20 font-medium text-gray-900 mb-4">
          {formatDate(selectedDate)}
        </h2>
        <div className="overflow-x-auto">
          <EventDayTimeline selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  )
}
