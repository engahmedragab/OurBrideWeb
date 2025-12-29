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
  type LucideIcon,
} from 'lucide-react'
import { parseHexCodepoint, argbToHex } from '@/utils/iconUtils'
import { cn } from '@/lib/utils'

// Mapping of common icon codepoints to Lucide icons
// This is a fallback mapping - in a real app, you'd use an icon font
const ICON_CODEPOINT_MAP: Record<number, LucideIcon> = {
  // Common Material Icons codepoints (approximate mappings)
  0xe333: Camera,      // camera
  0xe88a: Home,        // home
  0xe8c6: Cake,        // cake
  0xe405: Music,        // music_note
  0xe227: Flower,      // local_florist
  0xe531: Car,         // directions_car
  0xe87c: Gift,        // card_gift
  0xe87d: Heart,       // favorite
  0xe8d0: Sparkles,    // auto_awesome
  0xe838: Star,        // star
  0xe40a: Palette,     // palette
  0xe7ef: Users,       // people
  0xe0cd: Phone,       // phone
  0xe192: Clock,       // access_time
  0xe153: Flag,        // flag
     // directions_run
  0xe2dc: Snowflake,   // ac_unit
  0xe195: Plane,       // flight
  0xe8b8: Settings,    // settings
  0xe561: Wine,        // local_bar (using Wine as alternative)
  0xe310: Headphones,  // headphones
  0xe05f: Goal,        // sports_football (using Goal as alternative)
  0xe02f: Volume2,     // hearing (using Volume2 as alternative)
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
      // Icon codepoint not found in mapping
      console.warn(
        `[CategoryIcon] Icon glyph not found for codepoint: ${codepoint} (iconName: ${iconName})`
      )
    } else if (iconName) {
      console.warn(`[CategoryIcon] Failed to parse iconName: ${iconName}`)
    }
    
    // Fallback to a generic icon
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

