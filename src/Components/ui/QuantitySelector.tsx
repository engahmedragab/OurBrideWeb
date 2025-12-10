import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (delta: number) => void
  min?: number
  max?: number
  disabled?: boolean
  variant?: 'default' | 'coral'
  className?: string
}

export const QuantitySelector = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
  variant = 'default',
  className,
}: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(-1)
    }
  }

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(1)
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg bg-white w-fit',
        className
      )}
    >
      <button
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className={cn(
          'h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-50',
          variant === 'coral' && 'border-gray-300'
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4 text-gray-600" />
      </button>
      <span className="text-16 font-normal text-gray-900 w-8 text-center">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
          variant === 'coral'
            ? 'border-2 border-brand-500 hover:bg-brand-50'
            : 'border border-gray-300 hover:bg-gray-50'
        )}
        aria-label="Increase quantity"
      >
        <Plus
          className={cn(
            'h-4 w-4',
            variant === 'coral' ? 'text-brand-500' : 'text-gray-600'
          )}
        />
      </button>
    </div>
  )
}
