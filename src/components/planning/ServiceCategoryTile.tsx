'use client'

import { CategoryCard } from '@/components/ui/CategoryCard'
import { Edit2, Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PreparationService } from '@/types/planning'
import { WeddingDressIcon } from '@/assets/icons/WeddingDressIcon'
import { WeddingHallIcon } from '@/assets/icons/WeddingHallIcon'
import { PhotographyIcon } from '@/assets/icons/PhotographyIcon'
import { BridalBeautyIcon } from '@/assets/icons/BridalBeautyIcon'
import { WeddingCakeIcon } from '@/assets/icons/WeddingCakeIcon'
import { BouquetIcon } from '@/assets/icons/BouquetIcon'
import { WeddingSuitIcon } from '@/assets/icons/WeddingSuitIcon'
import { AccessoriesIcon } from '@/assets/icons/AccessoriesIcon'

// Icon mapping for asset icons
const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  weddingDress: WeddingDressIcon,
  weddingHall: WeddingHallIcon,
  photography: PhotographyIcon,
  bridalBeauty: BridalBeautyIcon,
  weddingCake: WeddingCakeIcon,
  bouquet: BouquetIcon,
  weddingSuit: WeddingSuitIcon,
  accessories: AccessoriesIcon,
}

export interface ServiceCategoryTileProps {
  service: PreparationService
  onEdit: () => void
  onDelete: () => void
}

export const ServiceCategoryTile = ({
  service,
  onEdit,
  onDelete,
}: ServiceCategoryTileProps) => {
  const renderIcon = () => {
    if (service.icon.kind === 'uploaded') {
      return (
        <img
          src={service.icon.value}
          alt={service.title}
          className="w-16 h-16 object-contain"
        />
      )
    } else {
      const IconComponent = ICON_MAP[service.icon.value]
      if (IconComponent) {
        return <IconComponent className="w-16 h-16 text-primary" />
      }
      return null
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl aspect-square">
      {/* Completed Overlay - Visible when completed, hidden on hover */}
      {service.completed && (
        <div className="absolute inset-0 bg-white/60 z-10 rounded-xl opacity-100 group-hover:opacity-0 transition-opacity duration-200" />
      )}

      {/* Completed Indicator - Green checkmark badge, hidden on hover */}
      {service.completed && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-200">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-5 w-5 text-white" />
          </div>
        </div>
      )}

      {/* Hover Overlay with Actions - Works on all breakpoints, appears above completed overlay */}
      <div
        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex items-center justify-center gap-3 rounded-xl"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <button
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onEdit()
          }}
          className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center transition-colors"
          aria-label="Edit service"
        >
          <Edit2 className="h-5 w-5 md:h-4 md:w-4" />
        </button>
        <button
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition-colors"
          aria-label="Delete service"
        >
          <Trash2 className="h-5 w-5 md:h-4 md:w-4" />
        </button>
      </div>

      {/* CategoryCard wrapper - prevent navigation and handle click */}
      <div
        onClick={e => {
          e.preventDefault()
          onEdit()
        }}
        className="h-full"
      >
        <CategoryCard
          id={service.id}
          title={service.title}
          description=""
          href="#"
          icon={renderIcon()}
          className={cn(
            'cursor-pointer !h-full !py-4 !px-4',
            // Ensure card content wrapper is perfectly centered - remove any justify-start or top margins
            '[&>div]:!h-full [&>div]:flex [&>div]:flex-col [&>div]:items-center [&>div]:justify-center [&>div]:gap-0 [&>div]:!pt-0 [&>div]:!mt-0',
            // Icon container - centered, proper spacing below
            '[&>div>div:first-child]:w-16 [&>div>div:first-child]:h-16 [&>div>div:first-child]:flex-shrink-0 [&>div>div:first-child]:!mb-3 [&>div>div:first-child]:!mt-0',
            // Title wrapper - centered below icon, no extra gaps
            '[&>div>div:last-child]:flex [&>div>div:last-child]:flex-col [&>div>div:last-child]:items-center [&>div>div:last-child]:justify-center [&>div>div:last-child]:gap-0',
            // Title - matches button text size (body typography)
            '[&_h3]:!text-base [&_h3]:md:!text-sm [&_h3]:!font-normal [&_h3]:text-gray-900 [&_h3]:leading-normal [&_h3]:text-center',
            // Hide description
            '[&_p]:hidden'
          )}
        />
      </div>
    </div>
  )
}

