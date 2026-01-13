import { forwardRef } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const pillTabsVariants = cva(
  'inline-flex items-center justify-center rounded-full flex-1 px-3 py-3 text-16 font-normal leading-6 transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      active: {
        true: 'bg-brand-500 text-white',
        false: 'bg-transparent text-gray-500',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

export interface PillTabItem {
  value: string
  label: string
  href?: string
}

export interface PillTabsProps extends VariantProps<typeof pillTabsVariants> {
  items: PillTabItem[]
  activeValue: string
  onChange?: (value: string) => void
  className?: string
  containerClassName?: string
  renderItem?: (item: PillTabItem, isActive: boolean) => React.ReactNode
}

/**
 * PillTabs - Reusable pill-style tabs component
 * Generic component for tab navigation with pill design
 */
export const PillTabs = forwardRef<HTMLDivElement, PillTabsProps>(
  (
    {
      items,
      activeValue,
      onChange,
      className,
      containerClassName,
      renderItem,
      ...props
    },
    ref
  ) => {
    const handleClick = (item: PillTabItem, e: React.MouseEvent) => {
      if (item.href) {
        // If href is provided, let the link handle navigation
        return
      }
      e.preventDefault()
      onChange?.(item.value)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border border-gray-300 bg-white p-1 gap-2 w-full max-w-[268px] transition-all duration-300 ease-in-out',
          containerClassName
        )}
        {...props}
      >
        {items.map(item => {
          const isActive = activeValue === item.value

          const tabContent = renderItem ? (
            renderItem(item, isActive)
          ) : (
            <span>{item.label}</span>
          )

          if (item.href) {
            return (
              <Link
                key={item.value}
                href={item.href}
                onClick={e => handleClick(item, e)}
                className={cn(
                  pillTabsVariants({ active: isActive }),
                  className
                )}
              >
                {tabContent}
              </Link>
            )
          }

          return (
            <button
              key={item.value}
              type="button"
              onClick={e => handleClick(item, e)}
              className={cn(pillTabsVariants({ active: isActive }), className)}
            >
              {tabContent}
            </button>
          )
        })}
      </div>
    )
  }
)
PillTabs.displayName = 'PillTabs'

export { pillTabsVariants }
