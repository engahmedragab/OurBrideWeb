'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NumberStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export const NumberStepper = ({
  value,
  onChange,
  min = 1,
  max = 999,
  className,
}: NumberStepperProps) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 border border-gray-300 rounded-xl overflow-hidden',
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className={cn(
          'px-3 py-2 text-primary hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
          value <= min && 'cursor-not-allowed'
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={e => {
          const newValue = parseInt(e.target.value) || min
          const clampedValue = Math.max(min, Math.min(max, newValue))
          onChange(clampedValue)
        }}
        min={min}
        max={max}
        className="w-16 text-center border-0 focus:outline-none focus:ring-0 text-16 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className={cn(
          'px-3 py-2 text-primary hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
          value >= max && 'cursor-not-allowed'
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
