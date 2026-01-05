'use client'

import { MoreVertical, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

export interface ItineraryEvent {
  id: string
  startTime: Date
  title: string
  duration: number
}

export interface ItineraryEventCardProps {
  event: ItineraryEvent
  isLast?: boolean
  onEdit?: (event: ItineraryEvent) => void
  onDelete?: (event: ItineraryEvent) => void
  className?: string
}

const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} Min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} Hour${hours > 1 ? 's' : ''}`
  }
  return `${hours} Hour ${remainingMinutes} Min`
}

export const ItineraryEventCard = ({
  event,
  isLast = false,
  onEdit,
  onDelete,
  className,
}: ItineraryEventCardProps) => {
  const formattedTime = format(event.startTime, 'h:mm a')
  const durationText = formatDuration(event.duration)

  return (
    <div className={cn('flex gap-4 items-start relative', className)}>
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-brand-500" />
        {!isLast && <div className="w-0.5 flex-1 bg-brand-500 min-h-[60px]" />}
      </div>

      <div className="flex-1 bg-brand-50 rounded-lg p-4 border border-brand-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-16 font-normal text-gray-900 mb-1">
              {formattedTime}
            </p>
            <p className="text-14 text-gray-500 mb-1">
              Duration: {durationText}
            </p>
            <p className="text-14 text-gray-500">{event.title}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1 hover:bg-brand-100 rounded transition-colors"
                aria-label="Event options"
              >
                <MoreVertical className="h-5 w-5 text-gray-900" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-white border border-gray-200"
            >
              <DropdownMenuItem
                onClick={() => onEdit?.(event)}
                className="cursor-pointer text-gray-900 hover:bg-brand-50 focus:bg-brand-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(event)}
                className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
