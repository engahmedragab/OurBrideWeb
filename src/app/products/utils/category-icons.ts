/**
 * Category icon mapping utility
 */

import perfumesIcon from '@/assets/category/perfumes.svg'
import skinCareIcon from '@/assets/category/skin-care.svg'
import boxesIcon from '@/assets/category/boxes.svg'
import hairCareIcon from '@/assets/category/hair-care.svg'
import bodyCareIcon from '@/assets/category/body-soap.svg'
import toolsDevicesIcon from '@/assets/category/tools-devices.svg'
import hairDryerIcon from '@/assets/category/hair-dryer.svg'

/**
 * Get category icon mapping
 */
export const getCategoryIconMap = (): Record<string, string> & { default: string } => {
  return {
    perfumes: perfumesIcon,
    makeup: toolsDevicesIcon,
    'skin-care': skinCareIcon,
    boxes: boxesIcon,
    'hair-care': hairCareIcon,
    'body-care': bodyCareIcon,
    'tools-devices': toolsDevicesIcon,
    'hair-dryer': hairDryerIcon,
    default: toolsDevicesIcon,
  }
}

