'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const tabsVariants = cva('', {
  variants: {
    variant: {
      default: '',
      underline: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const tabItemVariants = cva(
  'px-4 py-2 text-16 w-full font-normal transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: '',
        underline: 'border-b-2 border-transparent hover:text-gray-900',
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'underline',
        active: true,
        class: 'border-brand-500 text-gray-900',
      },
      {
        variant: 'underline',
        active: false,
        class: 'text-gray-500',
      },
    ],
    defaultVariants: {
      variant: 'default',
      active: false,
    },
  }
)

export interface TabItem {
  value: string
  label: string
}

export interface TabsProps
  extends VariantProps<typeof tabsVariants>,
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[]
  activeValue: string
  onChange?: (value: string) => void
  variant?: 'default' | 'underline'
}

/**
 * Tabs - Reusable tabs component with underline variant
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      items,
      activeValue,
      onChange,
      variant = 'underline',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-8',
          tabsVariants({ variant }),
          className
        )}
        {...props}
      >
        {items.map(item => {
          const isActive = activeValue === item.value

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange?.(item.value)}
              className={cn(tabItemVariants({ variant, active: isActive }))}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    )
  }
)
Tabs.displayName = 'Tabs'

export { tabsVariants, tabItemVariants }

