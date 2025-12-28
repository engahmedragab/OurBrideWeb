'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { Calendar, Star } from 'lucide-react'
import { MainOccasionBookResponse } from '@/types/responses'
import {
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

/**
 * Map iconName to Lucide icon component
 */
const getIconFromName = (iconName: string): LucideIcon => {
  const name = iconName.toLowerCase().trim()

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

  if (iconMap[name]) {
    return iconMap[name]
  }

  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return icon
    }
  }

  return Calendar
}

export interface OccasionsOverviewProps {
  book?: MainOccasionBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
}

export const OccasionsOverview = ({
  book,
  onInit,
  onNavigate,
  eventId,
}: OccasionsOverviewProps) => {
  if (!book) {
    return null
  }

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

  // Get active occasions (not deleted) - use occasions if available, otherwise use lines
  const activeOccasions = useMemo(() => {
    const occasions = book.occasions || book.lines || []
    return occasions.filter(occasion => !occasion.isDeleted)
  }, [book.occasions, book.lines])

  // Sort by date (upcoming first)
  const sortedOccasions = useMemo(() => {
    return [...activeOccasions].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })
  }, [activeOccasions])

  // Limit to first 3 occasions for preview
  const displayOccasions = useMemo(() => {
    return sortedOccasions.slice(0, 3)
  }, [sortedOccasions])

  const count = activeOccasions.length

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">Occasions</h2>
        <button
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClick}
        >
          View All ({count})
        </button>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {displayOccasions.length > 0 ? (
          displayOccasions.map((occasion) => {
            const occasionDate = occasion.date
            const title = occasion.titleEn || occasion.titleAr || 'Untitled Occasion'
            const subTitle = occasion.subTitleEn || occasion.subTitleAr || ''
            const hasIconName = occasion.iconName && occasion.iconName.trim() !== ''
            const IconComponent = hasIconName ? getIconFromName(occasion.iconName) : Calendar

            return (
              <div
                key={occasion.id}
                className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 flex items-start gap-3"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-brand-500" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-14 font-semibold text-gray-900 line-clamp-1">
                        {title}
                      </p>
                      {subTitle && (
                        <p className="text-12 text-gray-600 mt-0.5 line-clamp-1">
                          {subTitle}
                        </p>
                      )}
                    </div>
                    {occasion.isFavorite && (
                      <Star className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" />
                    )}
                  </div>
                  {occasionDate && occasionDate !== '0001-01-01T00:00:00' && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <p className="text-12 text-gray-500">
                        {format(new Date(occasionDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-14 text-gray-500 text-center py-4">No occasions yet</p>
        )}
      </div>
    </div>
  )
}

