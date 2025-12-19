'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateSafe, isSameDay, getToday } from '@/lib/date-utils'

export type PlanningMiniCalendarValue = Date | string

export interface PlanningMiniCalendarProps {
  value: PlanningMiniCalendarValue
  onChange: (next: Date) => void
  bigDay?: Date | string | Array<Date | string>
  className?: string
}

/**
 * Convert a value to a date key string (YYYY-MM-DD)
 */
const toDateKey = (value: Date | string): string => {
  if (typeof value === 'string') {
    return value
  }
  return formatDateSafe(value)
}

/**
 * Normalize bigDay prop to an array of date keys (YYYY-MM-DD)
 */
const normalizeBigDays = (bigDay?: Date | string | Array<Date | string>): string[] => {
  if (!bigDay) return []
  
  if (Array.isArray(bigDay)) {
    return bigDay.map(day => toDateKey(day)).filter(Boolean)
  }
  
  return [toDateKey(bigDay)]
}

/**
 * Check if a date matches any of the big days
 */
const checkIsBigDay = (date: Date, bigDayKeys: string[]): boolean => {
  if (bigDayKeys.length === 0) return false
  const dateKey = formatDateSafe(date)
  return bigDayKeys.includes(dateKey)
}

/**
 * Convert value prop to Date object
 */
const valueToDate = (value: PlanningMiniCalendarValue): Date => {
  if (typeof value === 'string') {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day, 12, 0, 0)
  }
  return value
}

/**
 * Get calendar grid for a given month (always 42 days = 6 weeks * 7 days)
 */
const getMonthGrid = (viewMonth: Date): Array<{
  day: number
  isOtherMonth: boolean
  date: Date
}> => {
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days: Array<{
    day: number
    isOtherMonth: boolean
    date: Date
  }> = []

  // Previous month days (leading days to fill the first week)
  for (let i = 0; i < startingDayOfWeek; i++) {
    const date = new Date(year, month, -startingDayOfWeek + i + 1)
    days.push({
      day: date.getDate(),
      isOtherMonth: true,
      date,
    })
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    days.push({
      day,
      isOtherMonth: false,
      date,
    })
  }

  // Next month days (trailing days to fill to 42 total)
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    days.push({
      day,
      isOtherMonth: true,
      date,
    })
  }

  return days
}

/**
 * PlanningMiniCalendar Component
 * A full month/year calendar picker with optional Big Day highlighting
 * Used specifically for the planning calendar page
 */
export const PlanningMiniCalendar = ({
  value,
  onChange,
  bigDay,
  className,
}: PlanningMiniCalendarProps) => {
  const selectedDate = valueToDate(value)
  const today = getToday()
  
  // Internal state for the visible month (viewMonth)
  const [viewMonth, setViewMonth] = useState(() => {
    // Initialize to the month of the selected date, or today if no selection
    return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  })

  // Dropdown states
  const [isMonthOpen, setIsMonthOpen] = useState(false)
  const [isYearOpen, setIsYearOpen] = useState(false)

  // Refs for click outside detection
  const monthDropdownRef = useRef<HTMLDivElement>(null)
  const yearDropdownRef = useRef<HTMLDivElement>(null)

  // Normalize big days once
  const normalizedBigDays = useMemo(() => normalizeBigDays(bigDay), [bigDay])

  // Helper to get month key (YYYY-MM) for comparison
  const getMonthKey = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  }

  // Ref to track the last value's month key to detect actual value changes
  const lastValueMonthKeyRef = useRef<string>(
    getMonthKey(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
  )

  // Update viewMonth ONLY when value prop actually changes (not when viewMonth changes internally)
  useEffect(() => {
    const selectedMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const selectedMonthKey = getMonthKey(selectedMonth)
    
    // Only update if the value prop's month actually changed (not just a re-render)
    if (selectedMonthKey !== lastValueMonthKeyRef.current) {
      lastValueMonthKeyRef.current = selectedMonthKey
      setViewMonth(selectedMonth)
    }
  }, [selectedDate]) // Only depend on selectedDate, NOT viewMonth

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMonthOpen(false)
      }
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setIsYearOpen(false)
      }
    }

    if (isMonthOpen || isYearOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMonthOpen, isYearOpen])

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMonthOpen(false)
        setIsYearOpen(false)
      }
    }

    if (isMonthOpen || isYearOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isMonthOpen, isYearOpen])

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

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

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const grid = getMonthGrid(viewMonth)
    
    return grid.map(({ day, isOtherMonth, date }) => {
      const isSelected = isSameDay(date, selectedDate)
      const dateIsBigDay = checkIsBigDay(date, normalizedBigDays)

      return {
        day,
        isOtherMonth,
        isBigDay: dateIsBigDay,
        isSelected,
        date,
      }
    })
  }, [viewMonth, selectedDate, normalizedBigDays])

  // Generate year range (currentYear - 10 to currentYear + 20)
  const currentYear = today.getFullYear()
  const years = useMemo(() => {
    const yearList: number[] = []
    for (let year = currentYear - 10; year <= currentYear + 20; year++) {
      yearList.push(year)
    }
    return yearList
  }, [currentYear])

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setViewMonth((prev) => {
      const year = prev.getFullYear()
      const month = prev.getMonth()
      if (direction === 'prev') {
        // Handle year boundary
        if (month === 0) {
          return new Date(year - 1, 11, 1)
        }
        return new Date(year, month - 1, 1)
      } else {
        // Handle year boundary
        if (month === 11) {
          return new Date(year + 1, 0, 1)
        }
        return new Date(year, month + 1, 1)
      }
    })
  }

  const handleMonthSelect = (monthIndex: number) => {
    setViewMonth((prev) => {
      return new Date(prev.getFullYear(), monthIndex, 1)
    })
    setIsMonthOpen(false)
  }

  const handleYearSelect = (year: number) => {
    setViewMonth((prev) => {
      return new Date(year, prev.getMonth(), 1)
    })
    setIsYearOpen(false)
  }

  const handleDaySelect = (date: Date) => {
    if (!date) return
    
    // Call onChange with the selected date
    onChange(date)
    
    // If the selected day belongs to a different month, update viewMonth to that month
    const selectedMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    setViewMonth((prev) => {
      const currentViewMonth = new Date(prev.getFullYear(), prev.getMonth(), 1)
      // Only update if different month
      if (selectedMonth.getTime() !== currentViewMonth.getTime()) {
        return selectedMonth
      }
      return prev
    })
  }

  return (
    <div
      className={cn(
        'bg-white flex flex-col gap-3 p-4 rounded-3xl shadow-[0px_0px_9px_0px_rgba(143,144,166,0.15)] w-full max-w-[240px]',
        className
      )}
    >
      {/* Header with Month/Year Dropdowns */}
      <div className="flex gap-1.5 items-center justify-center">
        <button
          onClick={() => handleMonthChange('prev')}
          className="flex items-center justify-center size-4 hover:opacity-70 transition-opacity flex-shrink-0"
          aria-label="Previous month"
        >
          <ChevronDown className="size-4 text-gray-500 rotate-90" />
        </button>

        {/* Month Dropdown */}
        <div className="relative" ref={monthDropdownRef}>
          <button
            onClick={() => {
              setIsMonthOpen(!isMonthOpen)
              setIsYearOpen(false)
            }}
            className="flex h-5 items-center justify-center px-2 py-0.5 rounded hover:bg-gray-100 transition-colors"
            aria-label="Select month"
          >
            <p className="text-10 font-normal text-gray-500 text-center whitespace-nowrap">
              {monthNames[viewMonth.getMonth()]}
            </p>
          </button>
          {isMonthOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-32 max-h-60 overflow-y-auto">
              {monthNames.map((month, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthSelect(index)}
                  className={cn(
                    'w-full px-3 py-2 text-left text-10 font-normal text-gray-700 hover:bg-gray-100 transition-colors',
                    index === viewMonth.getMonth() && 'bg-brand-50 text-brand-500'
                  )}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Year Dropdown */}
        <div className="relative" ref={yearDropdownRef}>
          <button
            onClick={() => {
              setIsYearOpen(!isYearOpen)
              setIsMonthOpen(false)
            }}
            className="flex h-5 items-center justify-center px-2 py-0.5 rounded hover:bg-gray-100 transition-colors"
            aria-label="Select year"
          >
            <p className="text-10 font-normal text-gray-500 text-center whitespace-nowrap">
              {viewMonth.getFullYear()}
            </p>
          </button>
          {isYearOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-20 max-h-60 overflow-y-auto">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={cn(
                    'w-full px-3 py-2 text-center text-10 font-normal text-gray-700 hover:bg-gray-100 transition-colors',
                    year === viewMonth.getFullYear() && 'bg-brand-50 text-brand-500'
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => handleMonthChange('next')}
          className="flex items-center justify-center size-4 hover:opacity-70 transition-opacity flex-shrink-0"
          aria-label="Next month"
        >
          <ChevronDown className="size-4 text-gray-500 -rotate-90" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-1 flex-col gap-0">
        {/* Weekday Headers */}
        <div className="flex items-center justify-between w-full mb-0">
          {weekDays.map((day, index) => (
            <div key={day} className="flex items-center justify-center rounded size-5">
              <p
                className={cn(
                  'text-10 font-normal text-center whitespace-nowrap',
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
          {calendarDays.map((dateInfo, index) => {
            // Priority: other month (muted) → bigDay → selected → default
            const isOtherMonth = dateInfo.isOtherMonth
            const showBigDay = dateInfo.isBigDay
            const showSelected = dateInfo.isSelected
            const isBoth = showBigDay && showSelected

            return (
              <button
                key={index}
                onClick={() => handleDaySelect(dateInfo.date)}
                className={cn(
                  'flex items-center justify-center rounded size-7 transition-colors',
                  // Selected day: brand-500 background, white text
                  showSelected && 'bg-brand-500 rounded-full',
                  // If selected is also bigDay, add green border to combine styles
                  isBoth && 'ring-2 ring-green-500 ring-offset-1',
                  // Big day (not selected): green background with border
                  showBigDay && !showSelected && 'bg-green-100 border border-green-500 rounded-full',
                  // Other month: muted style
                  isOtherMonth && 'opacity-50',
                  // Hover state (only for current month, non-selected days)
                  !isOtherMonth && !showSelected && 'hover:bg-gray-50'
                )}
                aria-label={`Select ${dateInfo.date.toLocaleDateString()}`}
              >
                <p
                  className={cn(
                    'text-14 font-normal text-center whitespace-nowrap',
                    // Selected: always white text
                    showSelected && 'text-white',
                    // Big day (not selected): green text
                    showBigDay && !showSelected && 'text-green-500',
                    // Other month: muted gray
                    isOtherMonth && !showSelected && 'text-gray-500',
                    // Default: dark gray
                    !showSelected && !showBigDay && !isOtherMonth && 'text-gray-900'
                  )}
                >
                  {dateInfo.day}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
