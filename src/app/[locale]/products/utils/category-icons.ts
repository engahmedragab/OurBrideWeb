/**
 * Category icon mapping utility
 */

import perfumesIcon from '@/assets/svg/prefumes-icon.svg'
import skinCareIcon from '@/assets/svg/skincare-icon.svg'
import bagIcon from '@/assets/svg/bag-icon.svg'
import hairCareIcon from '@/assets/svg/haircare-icon.svg'
import makeupIcon from '@/assets/svg/makeup-icon.svg'

/**
 * Get list of available category icons (static, no slug matching)
 */
export const getCategoryIcons = (): string[] => {
  return [
    perfumesIcon,
    skinCareIcon,
    bagIcon,
    hairCareIcon,
    makeupIcon,
  ]
}

/**
 * Get default icon
 */
export const getDefaultCategoryIcon = (): string => {
  return bagIcon
}

