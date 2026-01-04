'use client'

import { useMemo } from 'react'
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

  // ✅ Wedding / Planning extras
  Shirt,       // dress
  Church,      // venue
  Gem,         // ring
  Utensils,    // catering
  Calendar,    // schedule
  MapPin,      // location
  Scissors,    // hair service
  CreditCard,  // budget/payment
  Receipt,     // invoices/receipts
  Tag,         // offers/discounts
  Mail,        // invitations
  HandHeart,   // volunteer/thanks

  type LucideIcon,
} from 'lucide-react'

import { parseHexCodepoint, argbToHex } from '@/utils/iconUtils'
import { cn } from '@/lib/utils'
import { WeddingHallIcon } from '@/assets/icons/WeddingHallIcon'
import { WeddingDressIcon } from '@/assets/icons/WeddingDressIcon'
import { WeddingCakeIcon } from '@/assets/icons/WeddingCakeIcon'
import { BridalBeautyIcon } from '@/assets/icons/BridalBeautyIcon'
import { PhotographyIcon } from '@/assets/icons/PhotographyIcon'
import { AccessoriesIcon } from '@/assets/icons/AccessoriesIcon'
import { BouquetIcon } from '@/assets/icons/BouquetIcon'
import { WeddingSuitIcon } from '@/assets/icons/WeddingSuitIcon'

// Mapping of common icon codepoints to Lucide icons
// This is a fallback mapping - in a real app, you'd use an icon font
const ICON_CODEPOINT_MAP: Record<number, LucideIcon> = {
  // Existing (as-is)
  0xe333: Camera, // camera
  0xe88a: Home, // home
  0xe8c6: Cake, // cake
  0xe405: Music, // music_note
  0xe227: Flower, // local_florist (your current value)
  0xe531: Car, // directions_car
  0xe87c: Gift, // card_gift
  0xe87d: Heart, // favorite
  0xe8d0: Sparkles, // auto_awesome
  0xe838: Star, // star
  0xe40a: Palette, // palette
  0xe7ef: Users, // people
  0xe0cd: Phone, // phone
  0xe192: Clock, // access_time
  0xe153: Flag, // flag
  0xe2dc: Snowflake, // ac_unit
  0xe195: Plane, // flight
  0xe8b8: Settings, // settings
  0xe561: Wine, // local_bar (your current value)
  0xe310: Headphones, // headphones
  0xe05f: Goal, // sports_football (alt)
  0xe02f: Volume2, // hearing (alt)

  // ✅ Extra: Wedding Planning / Services (Flutter Material codepoints)
  0xe15d: Shirt, // checkroom (dress)
  0xf04cd: Church, // church (venue)
  0xf04ed: Gem, // diamond (ring)

  0xe532: Utensils, // restaurant (catering)
  0xe533: Utensils, // restaurant_menu

  0xe253: Sparkles, // face_retouching_natural (makeup/beauty)
  0xe5d8: Sparkles, // spa

  0xe191: Scissors, // content_cut (hair service)

  0xe23e: Calendar, // event
  0xe1b6: Calendar, // date_range
  0xf06bb: Calendar, // calendar_month

  0xe4c9: MapPin, // place (location)

  0xe3c3: Mail, // mail (invites)
  0xe22a: Mail, // email

  0xe481: CreditCard, // payment
  0xe482: CreditCard, // payments
  0xe50d: Receipt, // receipt_long
  0xe39c: Tag, // local_offer (discount/offers)

  0xe149: Sparkles, // celebration
  0xe6c6: HandHeart, // volunteer_activism (thanks/charity)

  // ✅ Extra compatibility (لو الداتا جاية من codepoints مختلفة)
  0xe38c: Wine, // local_bar (Flutter's local_bar)
  0xe393: Flower, // local_florist (Flutter's local_florist)

  // ✅ Wedding-specific icons (custom codepoints)
  0xf0001: WeddingHallIcon,
  0xf0002: WeddingDressIcon,
  0xf0003: WeddingCakeIcon,
  0xf0004: BridalBeautyIcon,
  0xf0005: PhotographyIcon,
  0xf0006: AccessoriesIcon,
  0xf0007: BouquetIcon,
  0xf0008: WeddingSuitIcon,
}

interface CategoryIconProps {
  iconName: string | null | undefined
  colorName: string | null | undefined
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Renders a category icon badge with colored background
 * Attempts to render the icon from codepoint, falls back to a generic icon
 */
export const CategoryIcon = ({
  iconName,
  colorName,
  size = 'md',
  className,
}: CategoryIconProps) => {
  const { IconComponent, codepoint } = useMemo(() => {
    const codepoint = parseHexCodepoint(iconName)

    if (codepoint !== null) {
      const mappedIcon = ICON_CODEPOINT_MAP[codepoint]
      if (mappedIcon) {
        return { IconComponent: mappedIcon, codepoint }
      }
      console.warn(
        `[CategoryIcon] Icon glyph not found for codepoint: ${codepoint} (iconName: ${iconName})`
      )
    } else if (iconName) {
      console.warn(`[CategoryIcon] Failed to parse iconName: ${iconName}`)
    }

    return { IconComponent: Star, codepoint: null }
  }, [iconName])

  const backgroundColor = useMemo(() => {
    return argbToHex(colorName)
  }, [colorName])

  const sizeClasses = {
    sm: 'h-6 w-6 text-12',
    md: 'h-8 w-8 text-14',
    lg: 'h-10 w-10 text-16',
  }

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full flex-shrink-0',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor }}
      aria-label="Category icon"
    >
      <IconComponent className={cn('text-white', iconSizeClasses[size])} />
    </div>
  )
}
