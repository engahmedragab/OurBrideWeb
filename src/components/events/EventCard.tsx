'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Users } from 'lucide-react'

export interface EventCardProps {
  eventName: string
  date: string
  time: string
  creatorName: string
  creatorAvatar?: string
  attendeeCount: number
  attendeeAvatars?: string[]
  className?: string
  topColor?: string
}

/**
 * EventCard Component
 * Displays event information in a card format with colored top section
 */
export const EventCard = ({
  eventName,
  date,
  time,
  creatorName,
  creatorAvatar,
  attendeeCount,
  attendeeAvatars = [],
  className,
  topColor,
}: EventCardProps) => {
  // Show first 2 avatars, then a "+X" indicator
  const visibleAvatars = attendeeAvatars.slice(0, 2)
  const remainingCount = Math.max(0, attendeeCount - visibleAvatars.length)

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)] overflow-hidden',
        className
      )}
    >
      {/* Colored Top Section */}
      <div className={cn('h-[60px]', topColor || 'bg-brand-300')} />

      {/* Content Section */}
      <div className="bg-white flex flex-col gap-1.5 p-3">
        {/* Event Name */}
        <h3 className="text-18 font-normal text-gray-900 leading-[24px]">
          {eventName}
        </h3>

        {/* Date and Time */}
        <div className="flex gap-2 items-center text-12 font-normal text-gray-300">
          <span>{date}</span>
          <span>{time}</span>
        </div>

        {/* Creator and Attendees */}
        <div className="flex gap-2 items-center w-full">
          {/* Creator Name */}
          <p className="flex-1 text-12 font-normal text-gray-300">
            Created By {creatorName}
          </p>

          {/* Attendee Avatars */}
          <div className="flex items-center justify-end pr-2">
            {visibleAvatars.map((avatar, index) => (
              <div
                key={index}
                className={cn(
                  'relative w-5 h-5 rounded-full overflow-hidden border-2 border-white',
                  index > 0 && '-ml-2'
                )}
              >
                <Image
                  src={avatar}
                  alt={`Attendee ${index + 1}`}
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="relative -ml-2 rounded-full size-5 flex items-center justify-center bg-gray-400">
                <div className="absolute inset-0 bg-black/50 rounded-full" />
                <span className="relative text-8 font-normal text-white leading-[10px]">
                  +{remainingCount}
                </span>
              </div>
            )}
            {attendeeCount === 0 && (
              <div className="flex items-center gap-1">
                <Users className="size-3.5 text-gray-400" />
                <span className="text-10 text-gray-400">0</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

