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

  const borderColor =
    variant === 'coral'
      ? 'border-2 border-[#FF8B7A]'
      : 'border border-gray-300'
  const buttonColor =
    variant === 'coral'
      ? 'text-[#FF8B7A] hover:bg-[#FF8B7A]/10'
      : 'hover:bg-gray-50'

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg bg-white w-fit',
        borderColor,
        className
      )}
    >
      <button
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className={cn(
          'p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
          buttonColor
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-16 font-semibold text-gray-900 w-8 text-center">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className={cn(
          'p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
          buttonColor
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

