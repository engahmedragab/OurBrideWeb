'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useIsRTL } from '@/i18n'

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand-500 data-[state=unchecked]:bg-gray-200 rtl:data-[state=unchecked]:p-1  ',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface ToggleProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>, 'onCheckedChange' | 'onChange'>,
    VariantProps<typeof switchVariants> {
  onChange?: (checked: boolean) => void
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  ToggleProps
>(({ className, size, onChange, ...props }, ref) => {
  const isRTL = useIsRTL()

  // Calculate thumb translation based on size and RTL
  // In RTL mode, when checked, thumb should be on the left (use negative translate)
  // In LTR mode, when checked, thumb should be on the right (use positive translate)
  const getThumbClasses = () => {
    const baseClasses = 'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform'
    
    if (isRTL) {
      // RTL: checked moves left (negative), unchecked stays on right (small positive)
      switch (size) {
        case 'sm':
          return cn(baseClasses, 'h-4 w-4 data-[state=checked]:-translate-x-4 data-[state=unchecked]:translate-x-1')
        case 'md':
          return cn(baseClasses, 'h-5 w-5 data-[state=checked]:-translate-x-5 data-[state=unchecked]:translate-x-1')
        case 'lg':
          return cn(baseClasses, 'h-6 w-6 data-[state=checked]:-translate-x-7 data-[state=unchecked]:translate-x-1')
        default:
          return cn(baseClasses, 'h-5 w-5 data-[state=checked]:-translate-x-5 data-[state=unchecked]:translate-x-1')
      }
    } else {
      // LTR: checked moves right (positive), unchecked stays on left (small positive)
      switch (size) {
        case 'sm':
          return cn(baseClasses, 'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-1')
        case 'md':
          return cn(baseClasses, 'h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:-translate-x-1')
        case 'lg':
          return cn(baseClasses, 'h-6 w-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-1')
        default:
          return cn(baseClasses, 'h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5')
      }
    }
  }

  return (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ size }), className)}
      onCheckedChange={onChange}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb className={getThumbClasses()} />
    </SwitchPrimitives.Root>
  )
})

Toggle.displayName = SwitchPrimitives.Root.displayName

export { Toggle, switchVariants }
