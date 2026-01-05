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
  type LucideIcon,
} from 'lucide-react'

/**
 * Map service names to Lucide icons
 * This function matches service names (case-insensitive) to appropriate Lucide icons
 */
export const getServiceIcon = (serviceName: string): LucideIcon => {
  const name = serviceName.toLowerCase().trim()

  // Bridal & Beauty
  if (
    name.includes('bridal') ||
    name.includes('beauty') ||
    name.includes('makeup') ||
    name.includes('salon')
  ) {
    return Sparkles
  }

  // Wedding Hall / Venue
  if (
    name.includes('hall') ||
    name.includes('venue') ||
    name.includes('location') ||
    name.includes('place')
  ) {
    return Building2
  }

  // Bouquet / Flowers
  if (
    name.includes('bouquet') ||
    name.includes('flower') ||
    name.includes('floral')
  ) {
    return Flower2
  }

  // Wedding Cake
  if (
    name.includes('cake') ||
    name.includes('dessert') ||
    name.includes('sweet')
  ) {
    return Cake
  }

  // Photography / Videography
  if (
    name.includes('photo') ||
    name.includes('video') ||
    name.includes('camera') ||
    name.includes('film')
  ) {
    return Camera
  }

  // Wedding Suit / Men's Wear
  if (
    name.includes('suit') ||
    name.includes('tuxedo') ||
    name.includes('men') ||
    name.includes('groom')
  ) {
    return Shirt
  }

  // Wedding Dress / Bridal Wear
  if (
    name.includes('dress') ||
    name.includes('gown') ||
    name.includes('bridal wear')
  ) {
    return Heart
  }

  // Accessories / Jewelry
  if (
    name.includes('accessor') ||
    name.includes('jewelry') ||
    name.includes('jewellery') ||
    name.includes('ring')
  ) {
    return Crown
  }

  // Music / DJ / Entertainment
  if (
    name.includes('music') ||
    name.includes('dj') ||
    name.includes('entertainment') ||
    name.includes('band')
  ) {
    return Music
  }

  // Transportation
  if (
    name.includes('car') ||
    name.includes('transport') ||
    name.includes('vehicle') ||
    name.includes('limousine')
  ) {
    return Car
  }

  // Catering / Food
  if (
    name.includes('catering') ||
    name.includes('food') ||
    name.includes('restaurant') ||
    name.includes('dining')
  ) {
    return UtensilsCrossed
  }

  // Decoration / Design
  if (
    name.includes('decoration') ||
    name.includes('design') ||
    name.includes('decor') ||
    name.includes('styling')
  ) {
    return Palette
  }

  // Hair / Styling
  if (
    name.includes('hair') ||
    name.includes('styling') ||
    name.includes('haircut')
  ) {
    return Scissors
  }

  // Gift / Favors
  if (
    name.includes('gift') ||
    name.includes('favor') ||
    name.includes('souvenir')
  ) {
    return Gift
  }

  // Jewelry / Gem
  if (
    name.includes('gem') ||
    name.includes('diamond') ||
    name.includes('pearl')
  ) {
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
  if (
    name.includes('bridal') ||
    name.includes('beauty') ||
    name.includes('makeup') ||
    name.includes('salon')
  ) {
    return 'Sparkles'
  }

  // Wedding Hall / Venue
  if (
    name.includes('hall') ||
    name.includes('venue') ||
    name.includes('location') ||
    name.includes('place')
  ) {
    return 'Building2'
  }

  // Bouquet / Flowers
  if (
    name.includes('bouquet') ||
    name.includes('flower') ||
    name.includes('floral')
  ) {
    return 'Flower2'
  }

  // Wedding Cake
  if (
    name.includes('cake') ||
    name.includes('dessert') ||
    name.includes('sweet')
  ) {
    return 'Cake'
  }

  // Photography / Videography
  if (
    name.includes('photo') ||
    name.includes('video') ||
    name.includes('camera') ||
    name.includes('film')
  ) {
    return 'Camera'
  }

  // Wedding Suit / Men's Wear
  if (
    name.includes('suit') ||
    name.includes('tuxedo') ||
    name.includes('men') ||
    name.includes('groom')
  ) {
    return 'Shirt'
  }

  // Wedding Dress / Bridal Wear
  if (
    name.includes('dress') ||
    name.includes('gown') ||
    name.includes('bridal wear')
  ) {
    return 'Heart'
  }

  // Accessories / Jewelry
  if (
    name.includes('accessor') ||
    name.includes('jewelry') ||
    name.includes('jewellery') ||
    name.includes('ring')
  ) {
    return 'Crown'
  }

  // Music / DJ / Entertainment
  if (
    name.includes('music') ||
    name.includes('dj') ||
    name.includes('entertainment') ||
    name.includes('band')
  ) {
    return 'Music'
  }

  // Transportation
  if (
    name.includes('car') ||
    name.includes('transport') ||
    name.includes('vehicle') ||
    name.includes('limousine')
  ) {
    return 'Car'
  }

  // Catering / Food
  if (
    name.includes('catering') ||
    name.includes('food') ||
    name.includes('restaurant') ||
    name.includes('dining')
  ) {
    return 'UtensilsCrossed'
  }

  // Decoration / Design
  if (
    name.includes('decoration') ||
    name.includes('design') ||
    name.includes('decor') ||
    name.includes('styling')
  ) {
    return 'Palette'
  }

  // Hair / Styling
  if (
    name.includes('hair') ||
    name.includes('styling') ||
    name.includes('haircut')
  ) {
    return 'Scissors'
  }

  // Gift / Favors
  if (
    name.includes('gift') ||
    name.includes('favor') ||
    name.includes('souvenir')
  ) {
    return 'Gift'
  }

  // Jewelry / Gem
  if (
    name.includes('gem') ||
    name.includes('diamond') ||
    name.includes('pearl')
  ) {
    return 'Gem'
  }

  // Default fallback
  return 'Sparkles'
}

/**
 * Convert hex code to icon name string
 * If the value is a hex code (starts with "0x"), try to map it to an icon name
 * Otherwise, return the value as-is (assuming it's already a name)
 */
export const normalizeIconName = (
  iconValue: string | null | undefined,
  serviceName?: string
): string => {
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
