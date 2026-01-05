'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

const selectVariants = cva(
  'flex w-full items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-16 font-normal leading-6 transition-colors focus-within:outline-none focus-within:ring-0 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus-within:border-brand-500',
        error: 'border-red-500 bg-red-100 focus-within:border-red-500',
        success: 'border-gray-500 bg-white focus-within:border-brand-500',
      },
      size: {
        sm: 'h-10 px-3 text-12',
        md: 'h-11 px-4 text-13',
        lg: 'h-auto px-4 py-2.5 text-16',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface SelectProps
  extends
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  errorMessage?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, errorMessage, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <select
            className={cn(
              selectVariants({ variant, size }),
              errorMessage && 'border-red-500',
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        {errorMessage && (
          <div className="mt-2 flex items-center gap-2 text-14 font-normal leading-4 text-red-500">
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select, selectVariants }
