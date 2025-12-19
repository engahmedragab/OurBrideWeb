import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const textareaVariants = cva(
  'flex w-full rounded-xl border bg-white px-5 py-5 text-16 font-normal leading-6 transition-colors resize-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:border-brand-500',
        error: 'border-red-500 bg-red-100 focus:border-red-500',
        success: 'border-gray-500 bg-white focus:border-brand-500',
        focused: 'border-brand-500 focus:border-brand-500',
        fill: 'border-gray-200 bg-white focus:border-brand-500',
      },
      size: {
        sm: 'h-20 px-3 py-2 text-12',
        md: 'h-24 px-4 py-3 text-13',
        lg: 'h-auto min-h-[151px] px-5 py-5 text-16',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface TextareaProps
  extends
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  errorMessage?: string
}

/**
 * Textarea component with variant support
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            textareaVariants({ variant, size }),
            variant === 'error' && 'text-red-500 placeholder:text-red-500',
            variant === 'default' && 'text-gray-900 placeholder:text-gray-300',
            variant === 'focused' && 'text-gray-900 placeholder:text-gray-300',
            variant === 'success' && 'text-gray-900 placeholder:text-gray-300',
            variant === 'fill' && 'text-gray-900 placeholder:text-gray-300',
            className
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && (
          <div className="mt-2 flex items-center gap-2 text-14 font-normal leading-4 text-red-500">
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
