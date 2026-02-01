'use client'

import React, { useMemo, useCallback } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Clock, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import type { MainServiceBookResponse, ServiceLineResponse } from '@/types/responses'
import { WeddingHallIcon } from '@/assets/icons/WeddingHallIcon'
import { BridalBeautyIcon } from '@/assets/icons/BridalBeautyIcon'
import { PhotographyIcon } from '@/assets/icons/PhotographyIcon'
import { BouquetIcon } from '@/assets/icons/BouquetIcon'
import { WeddingCakeIcon } from '@/assets/icons/WeddingCakeIcon'
import { WeddingDressIcon } from '@/assets/icons/WeddingDressIcon'
import { WeddingSuitIcon } from '@/assets/icons/WeddingSuitIcon'
import { AccessoriesIcon } from '@/assets/icons/AccessoriesIcon'
import type { SVGProps } from 'react'
import { useI18nTranslations } from '@/i18n/hooks'
import { StaticImageData } from 'next/image'
import { useIsRTL } from '@/i18n/hooks'
import { cn } from '@/lib'

type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>

/**
 * Map iconName to custom icon component
 */
const getIconFromName = (iconName: string): IconComponent | null => {
  const name = iconName.toLowerCase().trim()
  
  // Map common icon names to custom icons
  const iconMap: Record<string, IconComponent> = {
    'makeup': BridalBeautyIcon,
    'bridal': BridalBeautyIcon,
    'beauty': BridalBeautyIcon,
    'salon': BridalBeautyIcon,
    'photo': PhotographyIcon,
    'photography': PhotographyIcon,
    'camera': PhotographyIcon,
    'video': PhotographyIcon,
    'hall': WeddingHallIcon,
    'venue': WeddingHallIcon,
    'location': WeddingHallIcon,
    'bouquet': BouquetIcon,
    'flower': BouquetIcon,
    'floral': BouquetIcon,
    'cake': WeddingCakeIcon,
    'dessert': WeddingCakeIcon,
    'suit': WeddingSuitIcon,
    'tuxedo': WeddingSuitIcon,
    'dress': WeddingDressIcon,
    'gown': WeddingDressIcon,
    'accessor': AccessoriesIcon,
    'jewelry': AccessoriesIcon,
    'accessories': AccessoriesIcon,
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
  
  // Default to null (no icon)
  return null
}

export interface UpcomingBookingsProps {
  book: MainServiceBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
  imageSrc?: string | StaticImageData
}

export const UpcomingBookings = ({
  book,
  onInit,
  onNavigate,
}: UpcomingBookingsProps) => {
  const t = useI18nTranslations('eventsPlanning')
  const tCards = useI18nTranslations('eventsPlanning.cards')
  const isRtl = useIsRTL()

  // Get active lines (not deleted) - use services if available, otherwise use lines
  const activeLines = useMemo(() => {
    const lines = (book.services || book.lines || []) as ServiceLineResponse[]
    return lines.filter((line: ServiceLineResponse) => !line?.isDeleted)
  }, [book.services, book.lines])

  // Sort by lastModifiedDate (newest first), fallback to creationDate
  const sortedLines = useMemo(() => {
    return [...activeLines].sort((a, b) => {
      const dateA = new Date(a.lastModifiedDate || a.creationDate || 0).getTime()
      const dateB = new Date(b.lastModifiedDate || b.creationDate || 0).getTime()
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
        <h2 className="text-18 font-semibold text-gray-900">
          {tCards('upcomingBookings.title')}
        </h2>

        <button
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClick}
          type="button"
        >
          {t('common.viewAll')}
        </button>
      </div>

      <div className="space-y-3">
        {displayBookings.length > 0 ? (
          displayBookings.map((line) => {
            const date = line.lastModifiedDate || line.creationDate

            const hasIconName = !!line.iconName && line.iconName.trim() !== ''
            const iconFromName = hasIconName ? getIconFromName(line.iconName) : null
            const IconComponent = iconFromName || WeddingHallIcon

            return (
              <button
                key={line.id}
                type="button"
                onClick={handleClick}
                className="w-full text-left bg-white rounded-lg border border-gray-200 p-3 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-full h-full text-brand-500" />
                    </div>

                    <div className={cn("flex flex-col min-w-0 flex-1 items-start")}>
                      <p className="text-16 font-semibold text-gray-900 truncate">
                       {isRtl ? line.titleAr : line.titleEn} || {line.title || t('common.untitledService')}
                        {line.title || t('common.untitledService')}
                      </p>

                      {date && date !== '0001-01-01T00:00:00' && (
                        <p className="text-14 font-medium text-gray-500 mt-0.5">
                          {format(new Date(date), 'dd MMM, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {book.pending && book.pending > 0 && (
                      <Badge
                        variant="pending"
                        className="text-11 flex items-center gap-1 whitespace-nowrap"
                      >
                        <Clock className="w-3 h-3" />
                        <span>{tCards('upcomingBookings.badges.pending')}</span>
                      </Badge>
                    )}

                    {((book.completed && book.completed > 0) || book.isSubDone) && (
                      <Badge
                        variant="confirmed"
                        className="text-11 flex items-center gap-1 whitespace-nowrap"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{tCards('upcomingBookings.badges.completed')}</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        ) : (
          <p className="text-13 text-gray-500 text-center py-6">
            {t('common.noBookings')}
          </p>
        )}
      </div>
    </div>
  )
}
