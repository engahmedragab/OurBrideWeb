import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react'

const passwordInputVariants = cva(
  'flex w-full items-center gap-2 rounded-md border bg-background px-3 py-2 text-16 ring-offset-background transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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

export interface PasswordInputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof passwordInputVariants> {
  errorMessage?: string
  showSuccessIcon?: boolean
  onStrengthChange?: (strength: 'weak' | 'medium' | 'strong') => void
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      variant,
      size,
      errorMessage,
      showSuccessIcon,
      onStrengthChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="w-full">
        <div
          className={cn(
            'relative flex w-full items-center gap-2',
            passwordInputVariants({ variant, size, className })
          )}
        >
          <Lock
            className={cn(
              'h-5 w-5 flex-shrink-0',
              variant === 'error' ? 'text-red-500' : 'text-gray-600'
            )}
          />
          <input
            type={showPassword ? 'text' : 'password'}
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              'flex-shrink-0',
              variant === 'error' ? 'text-red-500' : 'text-gray-600'
            )}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
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
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput, passwordInputVariants }
