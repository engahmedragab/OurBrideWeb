/**
 * Icon utilities for OurBride design system
 * Provides helper functions for icon sizing and styling
 */

import { ComponentProps } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from './utils'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type IconColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'white'

const iconSizeMap: Record<IconSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
  '3xl': 'h-12 w-12',
}

const iconColorMap: Record<IconColor, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-foreground-secondary',
  muted: 'text-foreground-muted',
  brand: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
  white: 'text-white',
}

export const getIconClassName = (
  size: IconSize = 'md',
  color: IconColor = 'default',
  className?: string
): string => {
  return cn('flex-shrink-0', iconSizeMap[size], iconColorMap[color], className)
}

export const createIconComponent = (
  IconComponent: LucideIcon,
  defaultSize: IconSize = 'md',
  defaultColor: IconColor = 'default'
) => {
  return function Icon({
    size = defaultSize,
    color = defaultColor,
    className,
    ...props
  }: {
    size?: IconSize
    color?: IconColor
    className?: string
  } & Omit<ComponentProps<LucideIcon>, 'size' | 'color' | 'className'>) {
    return (
      <IconComponent
        className={getIconClassName(size, color, className)}
        {...props}
      />
    )
  }
}
