import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Check, X, Info } from 'lucide-react'

const alertVariants = cva(
  'flex items-center gap-3 rounded-md border-2 px-4 py-3 text-16 font-medium',
  {
    variants: {
      variant: {
        error: 'border-red-500 bg-red-50 text-red-500',
        success: 'border-green-500 bg-green-50 text-green-500',
        info: 'border-blue-500 bg-blue-50 text-blue-500',
        warning: 'border-yellow-500 bg-yellow-50 text-yellow-500',
      },
    },
    defaultVariants: {
      variant: 'error',
    },
  }
)

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  message: string
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, message, ...props }, ref) => {
    const getIcon = () => {
      switch (variant) {
        case 'success':
          return <Check className="h-5 w-5" />
        case 'error':
          return <X className="h-5 w-5" />
        case 'info':
          return <Info className="h-5 w-5" />
        default:
          return <Info className="h-5 w-5" />
      }
    }

    const getIconColor = () => {
      switch (variant) {
        case 'error':
          return 'bg-red-500 text-white'
        case 'success':
          return 'bg-green-500 text-white'
        case 'info':
          return 'bg-blue-500 text-white'
        case 'warning':
          return 'bg-yellow-500 text-white'
        default:
          return 'bg-red-500 text-white'
      }
    }

    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant, className }))}
        role="alert"
        {...props}
      >
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full',
            getIconColor()
          )}
        >
          {getIcon()}
        </div>
        <span>{message}</span>
      </div>
    )
  }
)
Alert.displayName = 'Alert'

export { Alert, alertVariants }
