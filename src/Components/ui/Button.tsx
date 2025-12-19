import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { Checkbox, CheckboxProps } from './Checkbox'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-normal transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-20 active:scale-[0.98]',
  {
    variants: {
      variant: {
        // Solid filled buttons - Brand/Red
        brand: 'bg-brand-500 text-white hover:bg-brand-600 ',
        brandDark: 'bg-brand-600 text-white hover:bg-brand-700',
        brandDarker: 'bg-brand-700 text-white hover:bg-brand-800',

        // Solid filled buttons - Gray
        gray: 'bg-gray-200 text-gray-900 hover:bg-gray-300',

        // Solid filled buttons - Green/Success
        success: 'bg-green-500 text-white hover:bg-green-600',

        // Outlined buttons - Brand/Red
        outlineBrand:
          'border-2 border-brand-500 bg-white text-brand-500 hover:bg-brand-50',
        outlineBrandDark:
          'border-2 border-brand-600 bg-white text-brand-600 hover:bg-brand-50',

        // Outlined buttons - Green/Success
        outlineSuccess:
          'border-2 border-green-500 bg-white text-white hover:bg-green-50',
        outlineSuccessLight:
          'border-2 border-green-400 bg-white text-white hover:bg-green-50',

        // Legacy variants for backward compatibility
        default: 'bg-brand-500 text-white hover:bg-brand-600',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline:
          'border-2 border-gray-300 bg-white text-white hover:bg-gray-50',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        ghost: 'hover:bg-gray-100 text-gray-900',
        link: 'text-brand-500 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-12',
        default: 'h-9 px-4 text-13',
        md: 'h-10 px-4 text-14',
        lg: 'h-10 px-4 text-12',
        xl: 'h-14 px-8 text-20',
        icon: 'h-10 w-10',
      },
      state: {
        default: '',
        disabled: 'opacity-30 cursor-not-allowed',
        error: 'border-red-500 text-red-500',
        success: 'border-green-500 text-green-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
)

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  showCheckbox?: boolean
  checkboxProps?: Omit<CheckboxProps, 'size'>
  checkboxPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      state,
      asChild = false,
      showCheckbox = false,
      checkboxProps,
      checkboxPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    // Determine checkbox variant based on button variant
    const getCheckboxVariant = (): CheckboxProps['variant'] => {
      if (variant?.includes('outline')) {
        if (variant?.includes('Success')) return 'success'
        return 'brand'
      }
      if (variant === 'gray') return 'gray'
      if (variant === 'success') return 'successFilled'
      return 'brandFilled'
    }

    // Determine checkbox size based on button size
    const getCheckboxSize = (): CheckboxProps['size'] => {
      if (size === 'sm') return 'sm'
      if (size === 'lg' || size === 'xl') return 'lg'
      return 'md'
    }

    const checkbox = showCheckbox ? (
      <Checkbox
        variant={checkboxProps?.variant || getCheckboxVariant()}
        size={getCheckboxSize()}
        checked={false}
        disabled={disabled}
        showInnerSquare
        {...checkboxProps}
      />
    ) : null

    // When asChild is true, Slot expects a single child element
    // Checkbox feature is not compatible with asChild
    if (asChild) {
      return (
        <Comp
          className={cn(
            buttonVariants({ variant, size, state, className }),
            disabled && 'opacity-20 cursor-not-allowed'
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, state, className }),
          disabled && 'opacity-20 cursor-not-allowed'
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {showCheckbox && checkboxPosition === 'left' && checkbox}
        {children}
        {showCheckbox && checkboxPosition === 'right' && checkbox}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
