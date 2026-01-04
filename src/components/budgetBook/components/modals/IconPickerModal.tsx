'use client'

import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import {
  Camera,
  Home,
  Cake,
  Music,
  Flower,
  Car,
  Gift,
  Heart,
  Sparkles,
  Star,
  Palette,
  Users,
  Phone,
  Clock,
  Flag,
  Snowflake,
  Plane,
  Settings,
  Wine,
  Headphones,
  Goal,
  Volume2,
  type LucideIcon,
} from 'lucide-react'
import { WeddingHallIcon } from '@/assets/icons/WeddingHallIcon'
import { WeddingDressIcon } from '@/assets/icons/WeddingDressIcon'
import { WeddingCakeIcon } from '@/assets/icons/WeddingCakeIcon'
import { BridalBeautyIcon } from '@/assets/icons/BridalBeautyIcon'
import { PhotographyIcon } from '@/assets/icons/PhotographyIcon'
import { AccessoriesIcon } from '@/assets/icons/AccessoriesIcon'
import { BouquetIcon } from '@/assets/icons/BouquetIcon'
import { WeddingSuitIcon } from '@/assets/icons/WeddingSuitIcon'

// Icon options with codepoint strings (backend format)
// Codepoints are mapped to Material Icons approximate values
// Wedding icons use custom codepoints (0xf0001 - 0xf0008)
const ICON_OPTIONS = [
  // Wedding-specific icons (custom)
  { codepoint: '0xf0001', icon: WeddingHallIcon, label: 'Wedding Hall' },
  { codepoint: '0xf0002', icon: WeddingDressIcon, label: 'Wedding Dress' },
  { codepoint: '0xf0003', icon: WeddingCakeIcon, label: 'Wedding Cake' },
  { codepoint: '0xf0004', icon: BridalBeautyIcon, label: 'Bridal Beauty' },
  { codepoint: '0xf0005', icon: PhotographyIcon, label: 'Photography' },
  { codepoint: '0xf0006', icon: AccessoriesIcon, label: 'Accessories' },
  { codepoint: '0xf0007', icon: BouquetIcon, label: 'Bouquet' },
  { codepoint: '0xf0008', icon: WeddingSuitIcon, label: 'Wedding Suit' },

  // Standard Lucide icons
  { codepoint: '0xe333', icon: Camera, label: 'Camera' },
  { codepoint: '0xe88a', icon: Home, label: 'Home' },
  { codepoint: '0xe8c6', icon: Cake, label: 'Cake' },
  { codepoint: '0xe405', icon: Music, label: 'Music' },
  { codepoint: '0xe227', icon: Flower, label: 'Flower' },
  { codepoint: '0xe531', icon: Car, label: 'Car' },
  { codepoint: '0xe87c', icon: Gift, label: 'Gift' },
  { codepoint: '0xe87d', icon: Heart, label: 'Heart' },
  { codepoint: '0xe8d0', icon: Sparkles, label: 'Sparkles' },
  { codepoint: '0xe838', icon: Star, label: 'Star' },
  { codepoint: '0xe40a', icon: Palette, label: 'Palette' },
  { codepoint: '0xe7ef', icon: Users, label: 'Users' },
  { codepoint: '0xe0cd', icon: Phone, label: 'Phone' },
  { codepoint: '0xe192', icon: Clock, label: 'Clock' },
  { codepoint: '0xe153', icon: Flag, label: 'Flag' },
  { codepoint: '0xe2dc', icon: Snowflake, label: 'Snowflake' },
  { codepoint: '0xe195', icon: Plane, label: 'Plane' },
  { codepoint: '0xe8b8', icon: Settings, label: 'Settings' },
  { codepoint: '0xe561', icon: Wine, label: 'Wine' },
  { codepoint: '0xe310', icon: Headphones, label: 'Headphones' },
  { codepoint: '0xe05f', icon: Goal, label: 'Goal' },
  { codepoint: '0xe02f', icon: Volume2, label: 'Volume' },
]

interface IconPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (iconName: string) => void // iconName in format "0xe333"
  selectedIconKey?: string | null
}

export const IconPickerModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedIconKey,
}: IconPickerModalProps) => {
  const handleIconClick = (codepoint: string) => {
    onSelect(codepoint) // Return codepoint string like "0xe333"
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Icon"
      maxWidth="sm"
    >
      <div className="space-y-3">
        {/* Icon Grid - 5 columns, smaller icons */}
        <div className="grid grid-cols-5 gap-3">
          {ICON_OPTIONS.map(option => {
            const IconComponent = option.icon
            const isSelected = selectedIconKey === option.codepoint
            return (
              <button
                key={option.codepoint}
                onClick={() => handleIconClick(option.codepoint)}
                className={cn(
                  'flex items-center justify-center h-12 w-12 rounded-xl transition-all',
                  'hover:scale-110 hover:shadow-md',
                  isSelected
                    ? 'bg-brand-500 text-white ring-2 ring-brand-500 ring-offset-1'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                aria-label={`Select ${option.label} icon`}
                title={option.label}
              >
                <IconComponent className="h-5 w-5" />
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}

