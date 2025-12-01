import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { LockIcon } from './icons/LockIcon'

const passwordInputVariants = cva(
  'flex w-full items-center gap-2 rounded-md border bg-background px-3 py-2 text-16 transition-colors placeholder:text-gray-400 focus-within:outline-none focus-within:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 focus-within:border-primary',
        error:
          'border-error-500 bg-error-50 text-error-900 placeholder:text-error-400 focus-within:border-error-600',
        success:
          'border-gray-300 bg-white focus-within:border-primary',
        focused: 'border-primary focus-within:border-primary',
      },
      size: {
        sm: 'h-8 px-2 text-12',
        md: 'h-9 px-3 text-13',
        lg: 'h-10 px-3 text-14',
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
          <LockIcon
            className={cn(
              'h-5 w-5 flex-shrink-0',
              variant === 'error' ? 'text-error-600' : 'text-gray-400'
            )}
          />
          <input
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'flex-1 bg-transparent outline-none focus:outline-none',
              variant === 'error' && 'text-error-900 placeholder:text-error-400'
            )}
            ref={ref}
            {...props}
          />
           <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              'flex-shrink-0',
              variant === 'error' ? 'text-error-600' : 'text-gray-400'
            )}
          >
            {showPassword ? (
              <Eye className="h-5 w-5" />
            ) : (
              < EyeOff className="h-5 w-5" />
            )}
          </button>
          {showSuccessIcon && variant !== 'error' && (
            <div className="flex-shrink-0">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white border border-success-500">
                <Check className="h-3 w-3 text-success-500" />
              </div>
            </div>
          )}
        </div>
        {errorMessage && (
          <div className="mt-1 flex items-center gap-1 text-12 text-error-500 ">
            <X className="h-3 w-3 border border-red-500 rounded-full" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput, passwordInputVariants }
