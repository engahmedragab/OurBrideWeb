/**
 * Service Icon Mapper
 * Maps service names to Lucide icons (fallback when API doesn't provide icon)
 */

import {
  Sparkles,
  Building2,
  Flower2,
  Cake,
  Camera,
  Shirt,
  Heart,
  Crown,
  Music,
  Car,
  UtensilsCrossed,
  Palette,
  Scissors,
  Gift,
  Gem,
  FileText,
  Plane,
  type LucideIcon
} from 'lucide-react'
import type { ServiceClass } from '@/types/responses/book-enums'

/**
 * Map service names to Lucide icons
 * This function matches service names (case-insensitive) to appropriate Lucide icons
 */
export const getServiceIcon = (serviceName: string): LucideIcon => {
  const name = serviceName.toLowerCase().trim()
  
  // Bridal & Beauty
  if (name.includes('bridal') || name.includes('beauty') || name.includes('makeup') || name.includes('salon')) {
    return Sparkles
  }
  
  // Wedding Hall / Venue
  if (name.includes('hall') || name.includes('venue') || name.includes('location') || name.includes('place')) {
    return Building2
  }
  
  // Bouquet / Flowers
  if (name.includes('bouquet') || name.includes('flower') || name.includes('floral')) {
    return Flower2
  }
  
  // Wedding Cake
  if (name.includes('cake') || name.includes('dessert') || name.includes('sweet')) {
    return Cake
  }
  
  // Photography / Videography
  if (name.includes('photo') || name.includes('video') || name.includes('camera') || name.includes('film')) {
    return Camera
  }
  
  // Wedding Suit / Men's Wear
  if (name.includes('suit') || name.includes('tuxedo') || name.includes('men') || name.includes('groom')) {
    return Shirt
  }
  
  // Wedding Dress / Bridal Wear
  if (name.includes('dress') || name.includes('gown') || name.includes('bridal wear')) {
    return Heart
  }
  
  // Accessories / Jewelry
  if (name.includes('accessor') || name.includes('jewelry') || name.includes('jewellery') || name.includes('ring')) {
    return Crown
  }
  
  // Music / DJ / Entertainment
  if (name.includes('music') || name.includes('dj') || name.includes('entertainment') || name.includes('band')) {
    return Music
  }
  
  // Transportation
  if (name.includes('car') || name.includes('transport') || name.includes('vehicle') || name.includes('limousine')) {
    return Car
  }
  
  // Catering / Food
  if (name.includes('catering') || name.includes('food') || name.includes('restaurant') || name.includes('dining')) {
    return UtensilsCrossed
  }
  
  // Decoration / Design
  if (name.includes('decoration') || name.includes('design') || name.includes('decor') || name.includes('styling')) {
    return Palette
  }
  
  // Hair / Styling
  if (name.includes('hair') || name.includes('styling') || name.includes('haircut')) {
    return Scissors
  }
  
  // Gift / Favors
  if (name.includes('gift') || name.includes('favor') || name.includes('souvenir')) {
    return Gift
  }
  
  // Jewelry / Gem
  if (name.includes('gem') || name.includes('diamond') || name.includes('pearl')) {
    return Gem
  }
  
  // Default fallback
  return Sparkles
}

/**
 * Get icon name string from service name
 * Returns the icon component name as a string (e.g., "Sparkles", "Camera", etc.)
 * This matches the logic in getServiceIcon but returns the name as a string
 */
export const getServiceIconName = (serviceName: string): string => {
  const name = serviceName.toLowerCase().trim()
  
  // Bridal & Beauty
  if (name.includes('bridal') || name.includes('beauty') || name.includes('makeup') || name.includes('salon')) {
    return 'Sparkles'
  }
  
  // Wedding Hall / Venue
  if (name.includes('hall') || name.includes('venue') || name.includes('location') || name.includes('place')) {
    return 'Building2'
  }
  
  // Bouquet / Flowers
  if (name.includes('bouquet') || name.includes('flower') || name.includes('floral')) {
    return 'Flower2'
  }
  
  // Wedding Cake
  if (name.includes('cake') || name.includes('dessert') || name.includes('sweet')) {
    return 'Cake'
  }
  
  // Photography / Videography
  if (name.includes('photo') || name.includes('video') || name.includes('camera') || name.includes('film')) {
    return 'Camera'
  }
  
  // Wedding Suit / Men's Wear
  if (name.includes('suit') || name.includes('tuxedo') || name.includes('men') || name.includes('groom')) {
    return 'Shirt'
  }
  
  // Wedding Dress / Bridal Wear
  if (name.includes('dress') || name.includes('gown') || name.includes('bridal wear')) {
    return 'Heart'
  }
  
  // Accessories / Jewelry
  if (name.includes('accessor') || name.includes('jewelry') || name.includes('jewellery') || name.includes('ring')) {
    return 'Crown'
  }
  
  // Music / DJ / Entertainment
  if (name.includes('music') || name.includes('dj') || name.includes('entertainment') || name.includes('band')) {
    return 'Music'
  }
  
  // Transportation
  if (name.includes('car') || name.includes('transport') || name.includes('vehicle') || name.includes('limousine')) {
    return 'Car'
  }
  
  // Catering / Food
  if (name.includes('catering') || name.includes('food') || name.includes('restaurant') || name.includes('dining')) {
    return 'UtensilsCrossed'
  }
  
  // Decoration / Design
  if (name.includes('decoration') || name.includes('design') || name.includes('decor') || name.includes('styling')) {
    return 'Palette'
  }
  
  // Hair / Styling
  if (name.includes('hair') || name.includes('styling') || name.includes('haircut')) {
    return 'Scissors'
  }
  
  // Gift / Favors
  if (name.includes('gift') || name.includes('favor') || name.includes('souvenir')) {
    return 'Gift'
  }
  
  // Jewelry / Gem
  if (name.includes('gem') || name.includes('diamond') || name.includes('pearl')) {
    return 'Gem'
  }
  
  // Default fallback
  return 'Sparkles'
}

/**
 * Get icon based on ServiceClass enum
 * This is the primary method for determining icons based on service class
 */
export const getServiceIconByClass = (serviceClass: ServiceClass | number | null | undefined): LucideIcon => {
  if (serviceClass === null || serviceClass === undefined) {
    return Sparkles
  }

  const classValue = typeof serviceClass === 'number' ? serviceClass : serviceClass

  switch (classValue) {
    case 0: // None
      return Sparkles
    case 1: // WeddingHall
      return Building2
    case 2: // WeddingPlanner
      return Sparkles
    case 3: // WeddingCar
      return Car
    case 4: // Photographer
      return Camera
    case 5: // PhotoSetion
      return Camera
    case 6: // MakeupArtist
      return Sparkles
    case 7: // WeddingDress
      return Heart
    case 8: // FlowerBouquet
      return Flower2
    case 9: // Invitations
      return FileText
    case 10: // Mazoons
      return Gift
    case 11: // BeautyCenter
      return Sparkles
    case 12: // Catering
      return UtensilsCrossed
    case 13: // WeddingCake
      return Cake
    case 14: // Dress
      return Heart
    case 15: // Videography
      return Camera
    case 16: // Jewelry
      return Crown
    case 17: // Travel
      return Plane
    case 18: // DJ
      return Music
    case 19: // CeremonyMusic
      return Music
    case 25: // EngagementDress
      return Heart
    case 26: // HennaOutfit
      return Heart
    case 27: // PhotoSection
      return Camera
    default:
      return Sparkles
  }
}

/**
 * Convert ServiceClass string enum to number
 * Maps API string enum values to number enum values used in the app
 */
export const getServiceClassNumber = (serviceClass: string): number => {
  const classMap: Record<string, number> = {
    'None': 0,
    'WeddingHall': 1,
    'WeddingPlanner': 2,
    'WeddingCar': 3,
    'Photographer': 4,
    'PhotoSetion': 5,
    'MakeupArtist': 6,
    'WeddingDress': 7,
    'FlowerBouquet': 8,
    'Invitations': 9,
    'Mazoons': 10,
    'BeautyCenter': 11,
    'Catering': 12,
    'WeddingCake': 13,
    'Dress': 14,
    'Videography': 15,
    'Jewelry': 16,
    'Travel': 17,
    'DJ': 18,
    'CeremonyMusic': 19,
    'EngagementDress': 25,
    'HennaOutfit': 26,
    'PhotoSection': 27,
  }
  return classMap[serviceClass] ?? 0
}

/**
 * Convert ServiceClass number to its name string
 * Maps number enum values to their string names
 */
export const getServiceClassName = (serviceClass: number | null | undefined): string => {
  if (serviceClass === null || serviceClass === undefined) {
    return 'Unknown'
  }

  const nameMap: Record<number, string> = {
    0: 'None',
    1: 'Wedding Hall',
    2: 'Wedding Planner',
    3: 'Wedding Car',
    4: 'Photographer',
    5: 'Photo Section',
    6: 'Makeup Artist',
    7: 'Wedding Dress',
    8: 'Flower Bouquet',
    9: 'Invitations',
    10: 'Mazoons',
    11: 'Beauty Center',
    12: 'Catering',
    13: 'Wedding Cake',
    14: 'Dress',
    15: 'Videography',
    16: 'Jewelry',
    17: 'Travel',
    18: 'DJ',
    19: 'Ceremony Music',
    25: 'Engagement Dress',
    26: 'Henna Outfit',
    27: 'Photo Section',
  }

  return nameMap[serviceClass] ?? 'Unknown'
}

/**
 * Convert hex code to icon name string
 * If the value is a hex code (starts with "0x"), try to map it to an icon name
 * Otherwise, return the value as-is (assuming it's already a name)
 */
export const normalizeIconName = (iconValue: string | null | undefined, serviceName?: string): string => {
  if (!iconValue) {
    // If no icon value, use service name to get icon name
    return serviceName ? getServiceIconName(serviceName) : 'Sparkles'
  }
  
  // If it's a hex code (starts with "0x"), convert to icon name using service name
  if (iconValue.startsWith('0x')) {
    // Use service name to determine the correct icon name
    return serviceName ? getServiceIconName(serviceName) : 'Sparkles'
  }
  
  // If it's already a string name, return it as-is
  return iconValue
}

