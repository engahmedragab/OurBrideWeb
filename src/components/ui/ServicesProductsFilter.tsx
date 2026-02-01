'use client'

import { ChevronDown } from 'lucide-react'
import { Button } from './Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu'
import { useI18nTranslations } from '@/i18n/hooks'

export interface ServicesProductsFilterProps {
  value: 'services' | 'products'
  onChange: (value: 'services' | 'products') => void
  variant?: 'brand' | 'outline'
  className?: string
}

/**
 * ServicesProductsFilter component
 * Reusable dropdown filter for switching between Services and Products
 */
export const ServicesProductsFilter = ({
  value,
  onChange,
  variant = 'brand',
  className,
}: ServicesProductsFilterProps) => {
  const t = useI18nTranslations('cart.filters')

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === 'brand' ? 'brand' : 'outline'}
          className={`gap-2 px-4 py-2 text-14 font-medium w-full sm:w-auto ${
            variant === 'outline'
              ? 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-white'
          } ${className || ''}`}
        >
          {value === 'services' ? t('services') : t('products')}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => onChange('services')}
          className={value === 'services' ? 'bg-brand-50' : ''}
        >
          {t('services')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onChange('products')}
          className={value === 'products' ? 'bg-brand-50' : ''}
        >
          {t('products')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

