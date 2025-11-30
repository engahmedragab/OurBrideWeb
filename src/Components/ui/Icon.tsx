import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const iconVariants = cva('flex-shrink-0', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
      '2xl': 'h-10 w-10',
      '3xl': 'h-12 w-12',
    },
    color: {
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
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
})

export interface IconProps extends VariantProps<typeof iconVariants> {
  icon: LucideIcon
  className?: string
  'aria-label'?: string
}

export const Icon = ({
  icon: IconComponent,
  size,
  color,
  className,
  'aria-label': ariaLabel,
  ...props
}: IconProps) => {
  return (
    <IconComponent
      className={cn(iconVariants({ size, color }), className)}
      aria-label={ariaLabel}
      {...props}
    />
  )
}

// Icon wrapper component for custom SVGs
interface IconWrapperProps extends VariantProps<typeof iconVariants> {
  children: React.ReactNode
  className?: string
}

export const IconWrapper = ({
  children,
  size,
  color,
  className,
}: IconWrapperProps) => {
  return (
    <span className={cn(iconVariants({ size, color }), className)}>
      {children}
    </span>
  )
}
