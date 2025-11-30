import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Check, X, LucideIcon } from 'lucide-react'

const inputVariants = cva(
  'flex w-full items-center gap-2 rounded-md border bg-background px-3 py-2 text-16 ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 focus-visible:border-brand-500 focus-visible:ring-brand-500',
        error:
          'border-red-500 bg-red-50 text-red-500 placeholder:text-red-400 focus-visible:border-red-500 focus-visible:ring-red-500',
        success:
          'border-gray-300 focus-visible:border-brand-500 focus-visible:ring-brand-500',
        focused: 'border-brand-500 focus-visible:ring-brand-500',
      },
      size: {
        sm: 'h-8 px-2 text-12',
        md: 'h-10 px-3 text-14',
        lg: 'h-12 px-4 text-16',
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
                variant === 'error' ? 'text-red-500' : 'text-gray-400'
              )}
            >
              {typeof PrefixIcon === 'function' ? (
                <PrefixIcon className="h-5 w-5" />
              ) : (
                PrefixIcon
              )}
            </span>
          )}
          <input
            type={type}
            className={cn(
              'flex-1 bg-transparent outline-none',
              variant === 'error' && 'text-red-500 placeholder:text-red-400'
            )}
            ref={ref}
            {...props}
          />
          {showSuccessIcon && variant !== 'error' && (
            <div className="flex-shrink-0">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
          )}
          {suffix && (
            <span
              className={cn(
                'flex-shrink-0 text-14',
                variant === 'error' ? 'text-red-500' : 'text-gray-400'
              )}
            >
              {suffix}
            </span>
          )}
        </div>
        {errorMessage && (
          <div className="mt-1 flex items-center gap-1 text-12 text-red-500">
            <X className="h-3 w-3" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
