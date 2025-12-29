'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { 
  Clock, 
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

  // Sort by creation date (newest first)
  // Note: All lines share the same book-level pending/completed status
  const sortedLines = useMemo(() => {
    return [...activeLines].sort((a, b) => {
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
              <div key={line.id} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                {/* Single horizontal row layout */}
                <div className="flex items-center justify-between gap-4">
                  {/* Left section: Icon + Title + Date grouped together */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Icon */}
                    {hasIconName && IconComponent && (
                      <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 sm:w-6 sm:h-6 text-brand-500" />
                      </div>
                    )}
                    
                    {/* Title and Date stack */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-14 sm:text-16 font-semibold text-gray-900 truncate">
                        {line.title}
                      </p>
                      {date && date !== '0001-01-01T00:00:00' && (
                        <p className="text-12 sm:text-14 text-gray-600 truncate">
                          {format(new Date(date), 'dd/MM/yyyy')} {time}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right section: Status badges */}
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                    {book.pending && book.pending > 0 && (
                      <Badge variant="pending" className="md:text-12 text-[6px] flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Pending</span>
                      </Badge>
                    )}
                    {((book.completed && book.completed > 0) || book.isSubDone) && (
                      <Badge variant="confirmed" className="md:text-12 text-[6px] flex items-center gap-1 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Completed</span>
                      </Badge>
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

