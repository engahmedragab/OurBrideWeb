import { cn } from '@/lib/utils'

/**
 * Utility function to get RTL-aware className for arrow icons
 * Reverses arrow direction in RTL mode
 */
export const getRTLArrowClassName = (baseClassName?: string, isRTL?: boolean) => {
  return cn(baseClassName, isRTL && 'scale-x-[-1]')
}

/**
 * Utility function for chevron icons that need rotation instead of scale
 */
export const getRTLChevronClassName = (baseClassName?: string, isRTL?: boolean) => {
  return cn(baseClassName, isRTL && 'rotate-180')
}
