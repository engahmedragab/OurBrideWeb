'use client'

import { useState, useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  isToday,
  isTomorrow,
} from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from './Popover'
import { Input } from './Input'
import { cn } from '@/lib/utils'

export type DatePickerTimeSlot =
  | 'any'
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'custom'

export interface CustomDatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  onTimeSlotChange?: (slot: DatePickerTimeSlot) => void
  selectedTimeSlot?: DatePickerTimeSlot
  placeholder?: string
  className?: string
  disabled?: boolean
}

/**
 * CustomDatePicker Component
 * A comprehensive date and time picker with quick date selection, calendar view, and time slots
 */
export const CustomDatePicker = ({
  value,
  onChange,
  onTimeSlotChange,
  selectedTimeSlot = 'any',
  placeholder = 'Pick a date',
  className,
  disabled = false,
}: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() =>
    value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date()
  )
  const [selectedTime, setSelectedTime] =
    useState<DatePickerTimeSlot>(selectedTimeSlot)

  const today = new Date()
  const tomorrow = addDays(today, 1)

  // Format dates for quick selection
  const todayLabel = format(today, 'EEE, MMM d')
  const tomorrowLabel = format(tomorrow, 'EEE, MMM d')

  // Calendar grid generation
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const handleQuickDateSelect = (date: Date) => {
    if (onChange) {
      onChange(date)
    }
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
  }

  const handleDaySelect = (date: Date) => {
    if (onChange) {
      onChange(date)
    }
    // Update month view if selected day is in different month
    if (!isSameMonth(date, currentMonth)) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    }
  }

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      if (direction === 'prev') {
        return subMonths(prev, 1)
      } else {
        return addMonths(prev, 1)
      }
    })
  }

  const handleTimeSlotSelect = (slot: DatePickerTimeSlot) => {
    setSelectedTime(slot)
    if (onTimeSlotChange) {
      onTimeSlotChange(slot)
    }
  }

  const displayValue = useMemo(() => {
    if (!value) return ''
    return format(value, 'EEE, MMM d, yyyy')
  }, [value])

  const timeSlots = [
    { id: 'any' as DatePickerTimeSlot, label: 'Any time', timeRange: null },
    {
      id: 'morning' as DatePickerTimeSlot,
      label: 'Morning',
      timeRange: '9 AM - 12 PM',
    },
    {
      id: 'afternoon' as DatePickerTimeSlot,
      label: 'Afternoon',
      timeRange: '12 PM - 5 PM',
    },
    {
      id: 'evening' as DatePickerTimeSlot,
      label: 'Evening',
      timeRange: '5 PM - 11 PM',
    },
    { id: 'custom' as DatePickerTimeSlot, label: 'Custom', timeRange: null },
  ]

  return (
    <div className={cn('w-full', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              type="text"
              readOnly
              value={displayValue}
              placeholder={placeholder}
              prefixIcon={CalendarIcon}
              variant="fill"
              size="lg"
              className={cn(
                'h-12 cursor-pointer',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              disabled={disabled}
              onClick={() => !disabled && setIsOpen(true)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-auto p-0 bg-white border border-gray-200 rounded-xl shadow-xl"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Quick Date Selection (Left Panel) */}
            <div className="p-4 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50 lg:bg-white">
              <div className="flex flex-row lg:flex-col gap-3 min-w-[200px]">
                {/* Today Card */}
                <button
                  onClick={() => handleQuickDateSelect(today)}
                  className={cn(
                    'flex flex-col p-4 rounded-xl bg-white border border-gray-200 shadow-sm',
                    'hover:shadow-md transition-all duration-200',
                    'text-left min-w-[160px]',
                    value &&
                      isSameDay(value, today) &&
                      'ring-2 ring-brand-500 border-brand-500'
                  )}
                >
                  <span className="text-20 font-bold text-gray-900 mb-1">
                    Today
                  </span>
                  <span className="text-14 text-gray-600">{todayLabel}</span>
                </button>

                {/* Tomorrow Card */}
                <button
                  onClick={() => handleQuickDateSelect(tomorrow)}
                  className={cn(
                    'flex flex-col p-4 rounded-xl bg-white border border-gray-200 shadow-sm',
                    'hover:shadow-md transition-all duration-200',
                    'text-left min-w-[160px]',
                    value &&
                      isSameDay(value, tomorrow) &&
                      'ring-2 ring-brand-500 border-brand-500'
                  )}
                >
                  <span className="text-20 font-bold text-gray-900 mb-1">
                    Tomorrow
                  </span>
                  <span className="text-14 text-gray-600">{tomorrowLabel}</span>
                </button>
              </div>
            </div>

            {/* Calendar View (Center Panel) */}
            <div className="p-6 flex-1">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => handleMonthChange('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h3 className="text-18 font-semibold text-gray-900">
                  {format(currentMonth, 'MMM d, yyyy')}
                </h3>
                <button
                  onClick={() => handleMonthChange('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map(day => (
                  <div
                    key={day}
                    className="text-12 font-medium text-gray-500 text-center py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth)
                  const isSelected = value && isSameDay(day, value)
                  const isTodayDate = isToday(day)

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => isCurrentMonth && handleDaySelect(day)}
                      disabled={!isCurrentMonth}
                      className={cn(
                        'h-10 w-10 rounded-full text-14 font-medium transition-colors',
                        'flex items-center justify-center',
                        !isCurrentMonth && 'text-gray-300 cursor-not-allowed',
                        isCurrentMonth && 'text-gray-900 hover:bg-gray-100',
                        isSelected &&
                          'bg-brand-500 text-white hover:bg-brand-600 ring-2 ring-brand-200',
                        isTodayDate &&
                          !isSelected &&
                          'bg-gray-100 text-gray-900 font-semibold'
                      )}
                    >
                      {format(day, 'd')}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Time Slot Selection (Bottom Panel) */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="text-14 font-medium text-gray-900 whitespace-nowrap">
                Select time
              </label>
              <div className="flex flex-wrap gap-2 flex-1">
                {timeSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => handleTimeSlotSelect(slot.id)}
                    className={cn(
                      'flex flex-col items-center justify-center px-4 py-2.5 rounded-xl',
                      'bg-white border border-gray-200 shadow-sm',
                      'hover:shadow-md transition-all duration-200',
                      'min-w-[100px]',
                      selectedTime === slot.id &&
                        'ring-2 ring-brand-500 border-brand-500 bg-brand-50'
                    )}
                  >
                    <span className="text-14 font-medium text-gray-900">
                      {slot.label}
                    </span>
                    {slot.timeRange && (
                      <span className="text-12 text-gray-500 mt-0.5">
                        {slot.timeRange}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
