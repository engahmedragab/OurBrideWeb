'use client'

import { ChevronDown } from 'lucide-react'
import { Button } from './Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu'
import { useI18nTranslations, useIsRTL } from '@/i18n/hooks'
import { cn } from '@/lib/utils'

export interface ServicesProductsFilterProps {
  value: 'services' | 'products'
  onChange: (value: 'services' | 'products') => void
  disableServices?: boolean
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
  disableServices = false,
  variant = 'brand',
  className,
}: ServicesProductsFilterProps) => {
  const t = useI18nTranslations('cart.filters')
  const isRTL = useIsRTL()

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant === 'brand' ? 'brand' : 'outline'}
            className={cn(
              'gap-2 px-4 py-2 text-14 font-medium w-full sm:w-auto',
              variant === 'outline'
                ? 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-50'
                : 'text-white',
              isRTL && 'flex-row-reverse',
              className
            )}
          >
            {value === 'services' ? t('services') : t('products')}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={isRTL ? 'start' : 'end'} 
          className="w-40"
        >
            <div dir={isRTL ? 'rtl' : 'ltr'}>
              <DropdownMenuItem
              onClick={() => onChange('services')}
                className={cn(
                  value === 'services' ? 'bg-brand-50' : '',
                  disableServices && 'opacity-50 pointer-events-none',
                  isRTL && 'text-right'
                )}
              >
                {t('services')}
              </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChange('products')}
              className={cn(
                value === 'products' ? 'bg-brand-50' : '',
                isRTL && 'text-right'
              )}
            >
              {t('products')}
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

