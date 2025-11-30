import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const checkboxVariants = cva(
  'inline-flex items-center justify-center border-2 rounded transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 bg-white',
        brand: 'border-brand-500 bg-white',
        brandFilled: 'border-brand-500 bg-brand-500',
        gray: 'border-gray-400 bg-white',
        grayFilled: 'border-gray-400 bg-gray-200',
        success: 'border-green-500 bg-white',
        successFilled: 'border-green-500 bg-green-500',
        error: 'border-red-500 bg-white',
        errorFilled: 'border-red-500 bg-red-500',
      },
      shape: {
        square: 'rounded',
        circle: 'rounded-full',
      },
      size: {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      shape: 'square',
      size: 'md',
    },
  }
)

export interface CheckboxProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof checkboxVariants> {
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  showInnerSquare?: boolean
}

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(
  (
    {
      className,
      variant,
      shape,
      size,
      checked = false,
      disabled = false,
      onChange,
      showInnerSquare = false,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled && onChange) {
        onChange(!checked)
      }
    }

    const isFilled = variant?.includes('Filled')
    const iconColor = isFilled ? 'text-white' : 'text-transparent'
    const borderColor = variant?.includes('brand')
      ? 'border-brand-500'
      : variant?.includes('gray')
        ? 'border-gray-400'
        : variant?.includes('success')
          ? 'border-green-500'
          : variant?.includes('error')
            ? 'border-red-500'
            : 'border-gray-300'

    // Get border color for inner square
    const getInnerBorderColor = () => {
      if (isFilled) return 'border-white'
      if (variant?.includes('brand')) return 'border-white'
      if (variant?.includes('gray')) return 'border-gray-600'
      if (variant?.includes('success')) return 'border-white'
      if (variant?.includes('error')) return 'border-white'
      return 'border-gray-900'
    }

    return (
      <div
        ref={ref}
        className={cn(
          checkboxVariants({ variant, shape, size }),
          checked && !isFilled && borderColor,
          disabled && 'opacity-30 cursor-not-allowed',
          !disabled && 'cursor-pointer',
          className
        )}
        onClick={handleClick}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        {...props}
      >
        {checked && (
          <Check
            className={cn(
              'w-3 h-3',
              iconColor,
              size === 'sm' && 'w-2.5 h-2.5',
              size === 'lg' && 'w-4 h-4'
            )}
          />
        )}
        {showInnerSquare && !checked && (
          <div
            className={cn(
              'border-2 rounded',
              getInnerBorderColor(),
              size === 'sm' && 'w-2 h-2',
              size === 'md' && 'w-2.5 h-2.5',
              size === 'lg' && 'w-3 h-3'
            )}
          />
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox, checkboxVariants }
