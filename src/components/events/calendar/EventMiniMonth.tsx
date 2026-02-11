'use client'

import { useState, useMemo, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getEventsForDate } from './mockEvents'
import { formatDateSafe } from '@/lib/date-utils'
import { useIsRTL } from '@/i18n/hooks'

const BIG_DAY_STORAGE_KEY = 'ourbride_big_days'

const getBigDays = (): string[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(BIG_DAY_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export interface EventMiniMonthProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  className?: string
  checkBigDays?: boolean
}

/**
 * EventMiniMonth Component
 * Displays a compact month calendar widget with real calendar functionality
 */
export const EventMiniMonth = ({
  selectedDate = new Date(),
  onDateSelect,
  className,
  checkBigDays = false,
}: EventMiniMonthProps) => {
  const isRtl = useIsRTL()
  const [currentMonth, setCurrentMonth] = useState(() => {
    return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  })

  // Update currentMonth when selectedDate changes from outside
  useEffect(() => {
    const newMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    
    if (
      currentMonthStart.getTime() !== newMonth.getTime()
    ) {
      setCurrentMonth(newMonth)
    }
  }, [selectedDate])

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Array<{
      day: number
      isOtherMonth: boolean
      hasEvent: boolean
      isSelected: boolean
      date: Date
    }> = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      const date = new Date(year, month, -startingDayOfWeek + i + 1)
      days.push({
        day: date.getDate(),
        isOtherMonth: true,
        hasEvent: false,
        isSelected: false,
        date,
      })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isSelected =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()

      // Check if this day has events
      const eventsForDay = getEventsForDate(date)
      const hasEvent = eventsForDay.length > 0
      
      // Check if this day is a big day (for planning calendar)
      const isBigDay = checkBigDays ? getBigDays().includes(formatDateSafe(date)) : false

      days.push({
        day,
        isOtherMonth: false,
        hasEvent: hasEvent || isBigDay,
        isSelected,
        date,
      })
    }

    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        day,
        isOtherMonth: true,
        hasEvent: false,
        isSelected: false,
        date,
      })
    }

    return days
  }, [currentMonth, selectedDate])

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const handleDaySelect = (date: Date) => {
    if (!date) return
    onDateSelect?.(date)
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    }
  }

  return (
    <div
      className={cn(
        'bg-white flex flex-col gap-4 p-5 rounded-3xl shadow-[0px_0px_9px_0px_rgba(143,144,166,0.15)]',
        className
      )}
    >
      {/* Header */}
      <div className="flex gap-2 items-center justify-center">
        <button
          onClick={() => handleMonthChange('prev')}
          className="flex items-center justify-center size-5 hover:opacity-70 transition-opacity"
        >
          <ChevronDown
            className={cn(
              'size-5 text-gray-500',
              isRtl ? '-rotate-90' : 'rotate-90'
            )}
          />
        </button>
        <div className="flex h-6 items-center justify-center px-2 py-0.5 rounded">
          <p className="text-11 font-normal text-gray-500 text-center whitespace-nowrap">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </p>
        </div>
        <button
          onClick={() => handleMonthChange('next')}
          className="flex items-center justify-center size-5 hover:opacity-70 transition-opacity"
        >
          <ChevronDown
            className={cn(
              'size-5 text-gray-500',
              isRtl ? 'rotate-90' : '-rotate-90'
            )}
          />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-1 flex-col gap-0">
        {/* Weekday Headers */}
        <div className="flex items-center justify-between w-full mb-0">
          {weekDays.map((day, index) => (
            <div key={day} className="flex items-center justify-center rounded size-6">
              <p
                className={cn(
                  'text-11 font-normal text-center whitespace-nowrap',
                  index === 0 || index === 6 ? 'text-brand-500' : 'text-gray-500'
                )}
              >
                {day}
              </p>
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-0 w-full">
          {calendarDays.map((dateInfo, index) => (
            <button
              key={index}
              onClick={() => handleDaySelect(dateInfo.date)}
              className={cn(
                'flex items-center justify-center rounded size-8 transition-colors',
                dateInfo.isSelected && 'bg-brand-500 rounded-full',
                dateInfo.hasEvent && !dateInfo.isSelected && 'bg-brand-100 rounded-full',
                !dateInfo.isOtherMonth && !dateInfo.isSelected && 'hover:bg-gray-50'
              )}
            >
              <p
                className={cn(
                  'text-16 font-normal text-center whitespace-nowrap',
                  dateInfo.isSelected
                    ? 'text-white'
                    : dateInfo.hasEvent && !dateInfo.isSelected
                      ? 'text-brand-500'
                      : dateInfo.isOtherMonth
                        ? 'text-gray-500'
                        : 'text-gray-900'
                )}
              >
                {dateInfo.day}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
