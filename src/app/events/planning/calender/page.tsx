'use client'

import { useState, useEffect } from 'react'
import { EventWeekHeader } from '@/components/events/calendar/EventWeekHeader'
import { PlanningMiniCalendar } from '@/components/events/calendar/PlanningMiniCalendar'
import { DayDetailsView } from '@/components/planning/DayDetailsView'
import { formatDateSafe, getToday } from '@/lib/date-utils'

const BIG_DAY_STORAGE_KEY = 'ourbride_big_days'

const getBigDays = (): string[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(BIG_DAY_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

/**
 * Calendar Page
 * Displays the planning calendar with day details rendered in-place
 */
export default function CalenderPage() {
  const today = getToday()
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedDayId, setSelectedDayId] = useState(formatDateSafe(today))
  const [bigDays, setBigDays] = useState<string[]>([])

  useEffect(() => {
    setBigDays(getBigDays())
    
    const handleStorageChange = () => {
      setBigDays(getBigDays())
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Poll for localStorage changes (for same-tab updates)
  useEffect(() => {
    const interval = setInterval(() => {
      setBigDays(getBigDays())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleDateSelect = (date: Date) => {
    const safeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)
    setSelectedDate(safeDate)
    setSelectedDayId(formatDateSafe(safeDate))
  }

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

  return (
    <div className="w-full min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      {/* Single Layout with Responsive Order */}
      <div className="flex flex-col lg:grid lg:grid-cols-[70%_30%] gap-2">
        {/* Mini Calendar - Mobile: order-1 (top), Desktop: right sidebar */}
        <div className="order-1 lg:order-2  flex justify-center items-start">
          <PlanningMiniCalendar
            value={selectedDayId}
            onChange={handleDateSelect}
            bigDay={bigDays.length > 0 ? bigDays : undefined}
          />
        </div>

        {/* Main Calendar Column - Mobile: order-2 & order-3, Desktop: left column */}
        <div className="order-2 lg:order-1 flex flex-col gap-6">
          {/* Week Header - Mobile: order-2 (after calendar), Desktop: top */}
          <div className="order-2 lg:order-1">
            <EventWeekHeader
              weekDays={weekDays}
              onDaySelect={handleDateSelect}
            />
          </div>

          {/* Day Details - Mobile: order-3 (bottom), Desktop: below week header */}
          <div className="order-3 lg:order-2 bg-white shadow-[0px_0px_9px_0px_rgba(143,144,166,0.15)] p-5">
            <div className="overflow-x-auto">
              <DayDetailsView dayId={selectedDayId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
