'use client'

import { useMemo } from 'react'
import { CalendarEventBlock } from '@/components/ui/CalendarEventBlock'
import { getEventsForDate, type MockEvent } from './mockEvents'
import { cn } from '@/lib/utils'

export interface EventDayTimelineProps {
  selectedDate?: Date
  className?: string
}

/**
 * EventDayTimeline Component
 * Displays a vertical timeline with hourly slots and event blocks
 */
export const EventDayTimeline = ({
  selectedDate = new Date(),
  className,
}: EventDayTimelineProps) => {
  const timeSlots = [
    '9 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
    '5 PM',
    '6 PM',
    '7 PM',
    '8 PM',
    '9 PM',
    '10 PM',
    '11 PM',
    '12 AM',
  ]

  const hourHeight = 96

  const filteredEvents = useMemo(() => {
    if (!selectedDate) return []
    return getEventsForDate(selectedDate)
  }, [selectedDate])

  /**
   * Calculate the exact position and height of an event block
   * @param event - The event with start time and duration
   * @returns Object with top offset (px) and height (px)
   */
  const calculateEventPosition = (event: MockEvent) => {
    // Calculate start position: find the index of the start hour in timeSlots
    let startIndex = 0
    if (event.startHour >= 9 && event.startHour <= 23) {
      startIndex = event.startHour - 9
    } else if (event.startHour >= 0 && event.startHour < 9) {
      startIndex = event.startHour + 15
    }
    
    // Calculate minutes per pixel: hourHeight (96px) / 60 minutes = 1.6px per minute
    const minutesPerPixel = hourHeight / 60
    
    // Top position: hour offset + minute offset
    // Example: 10:30 AM = (10-9) * 96 + 30 * 1.6 = 96 + 48 = 144px
    const top = startIndex * hourHeight + event.startMinute * minutesPerPixel
    
    // Calculate end time
    const endHour = event.startHour + event.durationHours
    const endMinute = event.startMinute + event.durationMinutes
    
    // Calculate total duration in minutes
    let totalDurationMinutes = event.durationHours * 60 + event.durationMinutes
    
    // Special handling: If event ends exactly at the start of an hour (12:00 PM, 1:00 PM, etc.)
    // and the duration is a whole number of hours, include that full hour slot
    // Example: 10:00AM-12:00PM (durationHours=2, durationMinutes=0, endMinute=0)
    // should cover 10 AM, 11 AM, and 12 PM slots (3 hours total)
    if (endMinute === 0 && event.durationMinutes === 0 && event.durationHours > 0) {
      // Add one full hour to include the ending slot
      totalDurationMinutes = totalDurationMinutes + 60
    }
    
    // Height: duration in minutes * pixels per minute
    // Example: 10:00AM-12:00PM = 3 hours (180 minutes) = 180 * 1.6 = 288px
    const height = totalDurationMinutes * minutesPerPixel
    
    return { top, height }
  }

  return (
    <div className={cn('relative flex', className)}>
      {/* Time Labels Column */}
      <div className="flex flex-col w-[100px] shrink-0">
        {timeSlots.map((time) => (
          <div
            key={time}
            className="flex h-24 items-center justify-center p-1 border border-gray-200"
          >
            <p className="text-16 font-normal text-gray-900 whitespace-nowrap">
              {time}
            </p>
          </div>
        ))}
      </div>

      {/* Events Column */}
      <div className="relative flex-1 min-h-0">
        {/* Grid Lines */}
        <div className="absolute inset-0">
          {timeSlots.map((_, index) => (
            <div
              key={index}
              className="absolute left-0 right-0 h-px border-t border-gray-200"
              style={{ top: `${index * hourHeight}px` }}
            />
          ))}
          <div className="absolute inset-y-0 left-0 w-px border-l border-gray-200" />
          <div className="absolute inset-y-0 right-0 w-px border-r border-gray-200" />
        </div>

        {/* Events */}
        {filteredEvents.map((event) => {
          const { top, height } = calculateEventPosition(event)

          return (
            <div
              key={event.id}
              className="absolute left-0 right-0"
              style={{
                top: `${top}px`,
                height: `${height}px`,
              }}
            >
              <div className="h-full ">
                <CalendarEventBlock
                  title={event.title}
                  customerName={event.customerName}
                  status={event.status}
                  timeRange={event.timeRange}
                  className="h-full"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
