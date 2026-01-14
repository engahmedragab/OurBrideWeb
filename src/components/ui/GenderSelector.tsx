'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Mars, Venus } from 'lucide-react'
import { useI18nTranslations } from '@/i18n'

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
  const t = useI18nTranslations('auth.signupForm')
  const currentValue = value ?? internalValue
  const handleChange = (newValue: 'male' | 'female') => {
    if (onChange) {
      onChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      <button
        type="button"
        onClick={() => handleChange('male')}
        className={cn(
          'flex items-center justify-start gap-1.5 rounded-md border-1 border px-2.5 py-1.5 text-12 font-regular transition-colors',
          currentValue === 'male'
            ? 'border-brand-500 bg-brand-500 text-white'
            : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400'
        )}
      >
        <Mars className="h-4 w-4" />
        <span>{t('male')}</span>
      </button>
      <button
        type="button"
        onClick={() => handleChange('female')}
        className={cn(
          'flex items-center justify-start gap-1.5 rounded-md border-1 border  px-2.5 py-1.5 text-12 font-regular transition-colors',
          currentValue === 'female'
            ? 'border-brand-500 bg-brand-500 text-white'
            : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400'
        )}
      >
        <Venus className="h-4 w-4" />
        <span>{t('female')}</span>
      </button>
    </div>
  )
}
