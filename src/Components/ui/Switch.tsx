'use client'

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toggleVariants = cva(
  'relative inline-flex  items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-white border-2  border-brand-500',
        brand: 'bg-white border-2  border-brand-500',
      },
      size: {
        sm: 'h-5 w-10',
        md: 'h-6 w-12',
        lg: 'h-7 w-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const toggleThumbVariants = cva(
  'pointer-events-none inline-block  rounded-full transform ring-0 transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface ToggleProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof toggleVariants> {
  checked?: boolean
  onChange?: (checked: boolean) => void
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { className, variant, size, checked = false, onChange, disabled, ...props },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled && onChange) {
        onChange(!checked)
      }
    }

    // Calculate translation based on size
    const getTranslateX = () => {
      if (checked) {
        // When ON: thumb on the right, almost filling the right end
        return size === 'sm'
          ? 'translate-x-4'
          : size === 'md'
            ? 'translate-x-5'
            : 'translate-x-6'
      } else {
        // When OFF: thumb on the left, almost filling the left end
        return 'translate-x-0.5 '
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        className={cn(
          toggleVariants({ variant, size }),
          // When checked (ON): solid red background, no border
          checked && 'bg-brand-500 border-brand-500 ',
          // When unchecked (OFF): white background with red border
          !checked && 'bg-white border-2  border-brand-500',
          className
        )}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        <span
          className={cn(
            toggleThumbVariants({ size }),
            // When checked (ON): white thumb
            checked && 'bg-white',
            // When unchecked (OFF): red thumb
            !checked && 'bg-brand-500',
            getTranslateX()
          )}
        />
      </button>
    )
  }
)

Toggle.displayName = 'Toggle'

export { Toggle, toggleVariants }
