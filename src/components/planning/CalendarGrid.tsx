'use client'

import { useMemo } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay } from 'date-fns'
import { CalendarDayCard } from './CalendarDayCard'
import { cn } from '@/lib/utils'

export interface CalendarDay {
  dayId: string
  date: Date
  eventsCount?: number
  variant?: 'default' | 'selected' | 'hasEvents'
  isBigDay?: boolean
}

export interface CalendarGridProps {
  year: number
  month: number
  days?: CalendarDay[]
  onDaySelect?: (dayId: string) => void
  selectedDayId?: string
  className?: string
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const CalendarGrid = ({
  year,
  month,
  days = [],
  onDaySelect,
  selectedDayId,
  className,
}: CalendarGridProps) => {
  const monthDays = useMemo(() => {
    const currentMonth = new Date(year, month, 1)
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const allDays = eachDayOfInterval({ start, end })

    const firstDayOfWeek = getDay(start)
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    const daysMap = new Map(
      days.map(day => [format(day.date, 'yyyy-MM-dd'), day])
    )

    const monthDaysList = allDays.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd')
      const dayData = daysMap.get(dateKey)
      const dayId = dayData?.dayId || dateKey

      return {
        dayId,
        date,
        eventsCount: dayData?.eventsCount || 0,
        isBigDay: dayData?.isBigDay || false,
        variant:
          selectedDayId === dayId
            ? 'selected'
            : (dayData?.eventsCount || 0) > 0
              ? 'hasEvents'
              : 'default',
      }
    })

    const emptyDays = Array(adjustedFirstDay).fill(null)
    return [...emptyDays, ...monthDaysList]
  }, [year, month, days, selectedDayId])

  const handleDayClick = (dayId: string) => {
    if (onDaySelect) {
      onDaySelect(dayId)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex gap-[23px] items-center mb-4">
        {WEEKDAYS.map(day => (
          <p key={day} className="flex-1 text-12 text-gray-900 text-center">
            {day}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: Math.ceil(monthDays.length / 7) }).map(
          (_, weekIndex) => (
            <div key={weekIndex} className="flex gap-2 items-center w-full">
              {monthDays
                .slice(weekIndex * 7, (weekIndex + 1) * 7)
                .map((day, dayIndex) =>
                  day ? (
                    <CalendarDayCard
                      key={day.dayId}
                      dayId={day.dayId}
                      date={day.date}
                      eventsCount={day.eventsCount}
                      variant={day.variant}
                      isSelected={selectedDayId === day.dayId}
                      isBigDay={day.isBigDay}
                      onClick={() => handleDayClick(day.dayId)}
                      className="flex-1"
                    />
                  ) : (
                    <div key={`empty-${dayIndex}`} className="flex-1" />
                  )
                )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

