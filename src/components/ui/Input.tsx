import {
  InputHTMLAttributes,
  forwardRef,
  ReactNode,
  isValidElement,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Check, X, LucideIcon } from 'lucide-react'

const inputVariants = cva(
  'flex w-full items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-16 font-normal leading-6 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-within:outline-none focus-within:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus-within:border-brand-500',
        error: 'border-red-500 bg-red-100 focus-within:border-red-500',
        success: 'border-gray-500 bg-white focus-within:border-brand-500',
        focused: 'border-brand-500 focus-within:border-brand-500',
        fill: 'border-gray-200 bg-white focus-within:border-brand-500',
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

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix' | 'size'>,
    VariantProps<typeof inputVariants> {
  prefixIcon?: LucideIcon | ReactNode
  suffix?: string | ReactNode
  errorMessage?: string
  showSuccessIcon?: boolean
}

// Helper to render prefix icon
// This function safely renders Lucide icons and other React components
const renderPrefixIcon = (Icon: LucideIcon | ReactNode): ReactNode => {
  if (!Icon) return null

  // If it's already a valid React element, return it directly
  if (isValidElement(Icon)) {
    return Icon
  }

  // Check if it's a React component
  // forwardRef components (like Lucide icons) are functions
  // But we also check for object with $$typeof in case of edge cases
  const isComponent =
    typeof Icon === 'function' ||
    (typeof Icon === 'object' &&
      Icon !== null &&
      ('$$typeof' in Icon || 'render' in Icon))

  if (isComponent) {
    // Render as component - must use JSX, not return the component definition
    const IconComponent = Icon as React.ComponentType<{ className?: string }>
    return <IconComponent className="h-6 w-6" />
  }

  // For primitive types (string, number, etc.), return as-is
  return Icon
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant,
      size,
      prefixIcon: PrefixIcon,
      suffix,
      errorMessage,
      showSuccessIcon,
      ...props
    },
    ref
  ) => {
    const hasExtras =
      !!errorMessage || !!suffix || !!PrefixIcon || !!showSuccessIcon

    if (!hasExtras) {
      return (
        <input
          type={type}
          className={cn(inputVariants({ variant, size }), className)}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <div className="w-full">
        <div
          className={cn(
            'flex w-full items-center gap-2',
            inputVariants({ variant, size })
          )}
        >
          {PrefixIcon && (
            <span
              className={cn(
                'flex-shrink-0',
                variant === 'error'
                  ? 'text-red-500'
                  : variant === 'focused'
                    ? 'text-gray-400'
                    : variant === 'success'
                      ? 'text-gray-400'
                      : variant === 'fill'
                        ? 'text-gray-400'
                        : 'text-gray-400'
              )}
            >
              {renderPrefixIcon(PrefixIcon)}
            </span>
          )}
          <input
            type={type}
            className={cn(
              'flex-1 bg-transparent outline-none focus:outline-none font-normal text-16 leading-6',
              variant === 'error' && 'text-red-500 placeholder:text-red-500',
              variant === 'default' &&
                'text-gray-900 placeholder:text-gray-400',
              variant === 'focused' &&
                'text-gray-900 placeholder:text-gray-400',
              variant === 'success' &&
                'text-gray-900 placeholder:text-gray-400',
              variant === 'fill' && 'text-gray-900 placeholder:text-gray-400'
            )}
            ref={ref}
            {...props}
          />
          {showSuccessIcon && variant === 'success' && (
            <div className="flex-shrink-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-green-500">
                <Check className="h-4 w-4 text-green-500" />
              </div>
            </div>
          )}
          {suffix && (
            <span
              className={cn(
                'flex-shrink-0 text-16 font-normal leading-6',
                variant === 'error' ? 'text-red-300' : 'text-gray-300'
              )}
            >
              {suffix}
            </span>
          )}
        </div>
        {errorMessage && (
          <div className="mt-2 flex items-center gap-2 text-14 font-normal leading-4 text-red-500">
            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-red-500 flex-shrink-0">
              <X className="h-2.5 w-2.5 text-red-500" />
            </div>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
