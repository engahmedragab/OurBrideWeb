'use client'

import { ItineraryEventCard, type ItineraryEvent } from './ItineraryEventCard'
import { cn } from '@/lib/utils'

export interface ItineraryListProps {
  events: ItineraryEvent[]
  onEdit?: (event: ItineraryEvent) => void
  onDelete?: (event: ItineraryEvent) => void
  className?: string
}

export const ItineraryList = ({
  events,
  onEdit,
  onDelete,
  className,
}: ItineraryListProps) => {
  const sortedEvents = [...events].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime()
  )

  if (sortedEvents.length === 0) {
    return (
      <div className={cn('w-full py-8 text-center', className)}>
        <p className="text-14 text-gray-500">No events scheduled for this day</p>
      </div>
    )
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      {sortedEvents.map((event, index) => (
        <ItineraryEventCard
          key={event.id}
          event={event}
          isLast={index === sortedEvents.length - 1}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

