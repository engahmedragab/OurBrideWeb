import type { MockBudgetLineCategory } from '../state/mockBudgetData'

// Color palette for fallback (stable colors based on category id)
const COLOR_PALETTE = [
  '#22C55E', // green-500
  '#EAB308', // yellow-500
  '#3B82F6', // blue-500
  '#EF4444', // red-500
  '#8B5CF6', // purple-500
  '#F59E0B', // amber-500
  '#06B6D4', // cyan-500
  '#EC4899', // pink-500
  '#10B981', // emerald-500
  '#F97316', // orange-500
]

/**
 * Maps colorName to design token color
 */
const getColorFromName = (colorName: string | null): string => {
  switch (colorName) {
    case 'green':
      return '#22C55E' // green-500
    case 'yellow':
      return '#EAB308' // yellow-500
    case 'blue':
      return '#3B82F6' // blue-500
    case 'red':
      return '#EF4444' // red-500
    case 'purple':
      return '#8B5CF6' // purple-500
    case 'orange':
      return '#F97316' // orange-500
    case 'pink':
      return '#EC4899' // pink-500
    case 'cyan':
      return '#06B6D4' // cyan-500
    default:
      return '#737373' // gray-500 (neutral fallback)
  }
}

/**
 * Generates a stable color based on category id (hash function)
 */
const getStableColorById = (id: number): string => {
  const index = id % COLOR_PALETTE.length
  return COLOR_PALETTE[Math.abs(index)]
}

/**
 * Category type that accepts partial category objects
 */
type CategoryLike = {
  id: number
  colorName?: string | null
} | null

/**
 * Gets category color with fallback
 * - If category.colorName exists -> map to token color
 * - Else fallback to stable generated color based on category.id
 */
export function getCategoryColor(category: CategoryLike): string {
  if (!category) {
    return '#737373' // gray-500 for null/undefined
  }

  if (category.colorName) {
    const mappedColor = getColorFromName(category.colorName)
    // If colorName was mapped (not default gray), return it
    if (category.colorName !== 'default' && mappedColor !== '#737373') {
      return mappedColor
    }
  }

  // Fallback: generate stable color from id
  return getStableColorById(category.id)
}

