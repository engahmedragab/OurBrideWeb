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
        'flex items-center gap-3 rounded-lg bg-white w-full justify-center',
        className
      )}
    >
      <button
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className={cn(
          'h-10 w-10 rounded-full border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          variant === 'coral'
            ? 'border-brand-500 bg-white hover:bg-brand-50 hover:border-brand-600 text-brand-500 focus:ring-brand-500'
            : 'border-gray-300 hover:bg-gray-50 text-gray-600 focus:ring-gray-300'
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="min-w-[60px] text-center px-2">
        <span className="text-16 font-semibold text-gray-900">{quantity}</span>
      </div>
      <button
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className={cn(
          'h-10 w-10 rounded-full border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          variant === 'coral'
            ? 'border-brand-500 bg-white hover:bg-brand-50 hover:border-brand-600 text-brand-500 focus:ring-brand-500'
            : 'border-gray-300 hover:bg-gray-50 text-gray-600 focus:ring-gray-300'
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
