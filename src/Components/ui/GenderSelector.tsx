import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Mars, Venus } from 'lucide-react'

export interface GenderSelectorProps {
  value?: 'male' | 'female'
  onChange?: (value: 'male' | 'female') => void
  className?: string
}

export const GenderSelector = ({
  value,
  onChange,
  className,
}: GenderSelectorProps) => {
  const [internalValue, setInternalValue] = useState<
    'male' | 'female' | undefined
  >(value)

  const currentValue = value ?? internalValue
  const handleChange = (newValue: 'male' | 'female') => {
    if (onChange) {
      onChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      <button
        type="button"
        onClick={() => handleChange('male')}
        className={cn(
          'flex items-center justify-center gap-2 rounded-md border-2 px-4 py-3 text-16 font-semibold transition-colors',
          currentValue === 'male'
            ? 'border-brand-500 bg-brand-500 text-white'
            : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400'
        )}
      >
        <Mars className="h-5 w-5" />
        <span>Male</span>
      </button>
      <button
        type="button"
        onClick={() => handleChange('female')}
        className={cn(
          'flex items-center justify-center gap-2 rounded-md border-2 px-4 py-3 text-16 font-semibold transition-colors',
          currentValue === 'female'
            ? 'border-brand-500 bg-brand-500 text-white'
            : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400'
        )}
      >
        <Venus className="h-5 w-5" />
        <span>Female</span>
      </button>
    </div>
  )
}
