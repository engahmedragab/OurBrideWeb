'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { 
  Star, 
  CheckCircle2,
  Sparkles,
  Camera,
  UtensilsCrossed,
  Building2,
  Flower2,
  Cake,
  Shirt,
  Heart,
  Crown,
  Music,
  Car,
  Palette,
  Scissors,
  Gift,
  type LucideIcon
} from 'lucide-react'
import { format } from 'date-fns'
import { MainServiceBookResponse } from '@/types/responses'

/**
 * Map iconName to Lucide icon component
 */
const getIconFromName = (iconName: string): LucideIcon => {
  const name = iconName.toLowerCase().trim()
  
  // Map common icon names to Lucide icons
  const iconMap: Record<string, LucideIcon> = {
    'makeup': Sparkles,
    'bridal': Sparkles,
    'beauty': Sparkles,
    'salon': Sparkles,
    'photo': Camera,
    'photography': Camera,
    'camera': Camera,
    'video': Camera,
    'catering': UtensilsCrossed,
    'food': UtensilsCrossed,
    'restaurant': UtensilsCrossed,
    'hall': Building2,
    'venue': Building2,
    'location': Building2,
    'bouquet': Flower2,
    'flower': Flower2,
    'floral': Flower2,
    'cake': Cake,
    'dessert': Cake,
    'suit': Shirt,
    'tuxedo': Shirt,
    'dress': Heart,
    'gown': Heart,
    'accessor': Crown,
    'jewelry': Crown,
    'music': Music,
    'dj': Music,
    'entertainment': Music,
    'car': Car,
    'transport': Car,
    'vehicle': Car,
    'decoration': Palette,
    'design': Palette,
    'decor': Palette,
    'hair': Scissors,
    'styling': Scissors,
    'gift': Gift,
    'favor': Gift,
  }
  
  // Try exact match first
  if (iconMap[name]) {
    return iconMap[name]
  }
  
  // Try partial match
  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return icon
    }
  }
  
  // Default icon
  return Sparkles
}

export interface UpcomingBookingsProps {
  book: MainServiceBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
  imageSrc: string | any
}

export const UpcomingBookings = ({ book, onInit, onNavigate, eventId, imageSrc }: UpcomingBookingsProps) => {
  // Get active lines (not deleted) - use services if available, otherwise use lines
  const activeLines = useMemo(() => {
    const lines = book.services || book.lines || []
    return lines.filter(line => !line.isDeleted)
  }, [book.services, book.lines])

  // Sort: incomplete bookings first, then by creation date
  const sortedLines = useMemo(() => {
    return [...activeLines].sort((a, b) => {
      // Incomplete bookings first
      if (a.isDone !== b.isDone) {
        return a.isDone ? 1 : -1
      }
      // Then sort by creation date (newest first)
      const dateA = new Date(a.creationDate).getTime()
      const dateB = new Date(b.creationDate).getTime()
      return dateB - dateA
    })
  }, [activeLines])

  // Limit to first 3 bookings for preview
  const displayBookings = useMemo(() => {
    return sortedLines.slice(0, 3)
  }, [sortedLines])

  const needsInit = !book.isBookInit

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (needsInit && onInit) {
      await onInit()
    }
    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">Services Bookings</h2>
        <button
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClick}
        >
          View All
        </button>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {displayBookings.length > 0 ? (
          displayBookings.map(line => {
            // Use creationDate as date
            const date = line.creationDate || line.lastModifiedDate
            // Format time from date
            const time = date ? format(new Date(date), 'hh:mm a') : ''

            // Check if iconName exists, otherwise use image
            const hasIconName = line.iconName && line.iconName.trim() !== ''
            const IconComponent = hasIconName ? getIconFromName(line.iconName) : null

            return (
              <div key={line.id} className="bg-white rounded-lg border border-gray-200 flex items-stretch gap-0 relative">
                {/* Icon/Image Container */}
                <div className="w-24 sm:w-32 md:w-36 self-stretch rounded-l-lg rounded-r-none flex-shrink-0 overflow-hidden relative">
                  {hasIconName && IconComponent && (
                    <div className="w-full h-full flex items-center justify-start ">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-brand-50 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-brand-500" />
                      </div>
                    </div>
                  
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-2 sm:py-2 pl-3 sm:pl-4 pr-3 relative">
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    {/* Mobile Layout: Badge first, then title below */}
                    <div className="sm:hidden flex flex-col gap-2">
                      {line.isFavorite && (
                        <Badge variant="pending" className="text-8 flex items-center gap-0.5 w-fit px-1.5 py-0.5">
                          <Star className="w-2 h-2" />
                          <span className='text-[10px]'>Booking Favorite</span>
                        </Badge>
                      )}
                      {line.isDone && (
                        <Badge variant="confirmed" className="text-8 flex items-center gap-0.5 w-fit px-1.5 py-0.5">
                          <CheckCircle2 className="w-2 h-2" />
                          <span className='text-[10px]'>Booking Done</span>
                        </Badge>
                      )}
                      <p className="text-14 font-semibold text-gray-900">{line.title}</p>
                    </div>
                    {/* Desktop Layout: Title and badge inline */}
                    <div className="hidden sm:flex sm:items-start sm:justify-between sm:gap-2">
                      <p className="text-16 font-semibold text-gray-900 flex-1">{line.title}</p>
                      {line.isFavorite && (
                        <Badge variant="default" className="text-12 flex items-center gap-1 flex-shrink-0 bg-brand/50">
                          <Star className="w-4 h-4" />
                          <span>Booking Favorite</span>
                        </Badge>
                      )}
                      {line.isDone && (
                        <Badge variant="confirmed" className="text-12 flex items-center gap-1 flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Booking Done</span>
                        </Badge>
                      )}
                    </div>
                    {date && date !== '0001-01-01T00:00:00' && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <p className="text-12 sm:text-14 text-gray-600">
                          {format(new Date(date), 'dd/MM/yyyy')} {time}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-14 text-gray-500 text-center py-4">No bookings yet</p>
        )}
      </div>
    </div>
  )
}

