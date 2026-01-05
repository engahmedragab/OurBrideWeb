'use client'

import { useState } from 'react'
import {
  EventWeekHeader,
  EventDayTimeline,
  EventMiniMonth,
} from '@/components/events'

/**
 * Calendar Page
 * Displays the full Event Dashboard calendar screen
 */
export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const getWeekDays = (date: Date) => {
    const weekDays: Array<{
      day: number
      label: string
      date: Date
      isSelected: boolean
    }> = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(
        startOfWeek.getFullYear(),
        startOfWeek.getMonth(),
        diff + i
      )
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
    <div className="w-full">
      {/* Single Layout with Responsive Order */}
      <div className="flex flex-col lg:grid lg:grid-cols-[60%_40%] gap-2 ">
        {/* Mini Calendar - Mobile: order-1 (top), Desktop: right sidebar */}
        <div className="order-1 lg:order-2">
          <EventMiniMonth
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
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

          {/* Day Timeline - Mobile: order-3 (bottom), Desktop: below week header */}
          <div className="order-3 lg:order-2 bg-white  shadow-[0px_0px_9px_0px_rgba(143,144,166,0.15)] p-5">
            <div className="overflow-x-auto">
              <EventDayTimeline selectedDate={selectedDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
