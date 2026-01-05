'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Check, X, Lock } from 'lucide-react'

const passwordInputVariants = cva(
  'flex w-full items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-16 font-normal leading-6 transition-colors focus-within:outline-none focus-within:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
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
              'h-6 w-6 flex-shrink-0',
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
          />
          <input
            type={showPassword ? 'text' : 'password'}
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
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
            {showPassword ? (
              <Eye className="h-6 w-6" />
            ) : (
              <EyeOff className="h-6 w-6" />
            )}
          </button>
          {showSuccessIcon && variant === 'success' && (
            <div className="flex-shrink-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-green-500">
                <Check className="h-4 w-4 text-green-500" />
              </div>
            </div>
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
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput, passwordInputVariants }
