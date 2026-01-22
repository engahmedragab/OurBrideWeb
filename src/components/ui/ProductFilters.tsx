'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Checkbox } from './Checkbox'
import { Badge } from './Badge'
import { Input } from './Input'
import { X, SlidersHorizontal } from 'lucide-react'
import type { ProductFilter, ProductCategory } from '@/types/product'
import { useI18nTranslations } from '@/i18n/hooks'

interface PriceRangeSliderProps {
  min: number
  max: number
  minValue: number
  maxValue: number
  onChange: (min: number, max: number) => void
  onDragEnd?: (min: number, max: number) => void
  currencyLabel: string
  t: (key: string, params?: Record<string, string | number>) => string
}

const PriceRangeSlider = ({
  min,
  max,
  minValue,
  maxValue,
  onChange,
  onDragEnd,
  currencyLabel,
  t,
}: PriceRangeSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
  const [localMin, setLocalMin] = useState(minValue)
  const [localMax, setLocalMax] = useState(maxValue)
  const [hoveredHandle, setHoveredHandle] = useState<'min' | 'max' | null>(null)

  useEffect(() => {
    setLocalMin(minValue)
    setLocalMax(maxValue)
  }, [minValue, maxValue])

  const getPercentage = (value: number) => ((value - min) / (max - min)) * 100

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return min
      const rect = sliderRef.current.getBoundingClientRect()
      const percentage = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100)
      )
      return Math.round(min + (percentage / 100) * (max - min))
    },
    [min, max]
  )

  const handleStart = (type: 'min' | 'max', clientX: number) => {
    setIsDragging(type)
    const value = getValueFromPosition(clientX)
    if (type === 'min') {
      const newMin = Math.max(min, Math.min(value, localMax - 1))
      setLocalMin(newMin)
    } else {
      const newMax = Math.min(max, Math.max(value, localMin + 1))
      setLocalMax(newMax)
    }
  }

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return
      const value = getValueFromPosition(clientX)

      if (isDragging === 'min') {
        const newMin = Math.max(min, Math.min(value, localMax - 1))
        setLocalMin(newMin)
      } else {
        const newMax = Math.min(max, Math.max(value, localMin + 1))
        setLocalMax(newMax)
      }
    },
    [isDragging, localMin, localMax, min, max, getValueFromPosition]
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      handleMove(e.clientX)
    }
    const handleMouseUp = () => {
      if (isDragging) {
        onChange(localMin, localMax)
        onDragEnd?.(localMin, localMax)
      }
      setIsDragging(null)
    }
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches[0]) handleMove(e.touches[0].clientX)
    }
    const handleTouchEnd = () => {
      if (isDragging) {
        onChange(localMin, localMax)
        onDragEnd?.(localMin, localMax)
      }
      setIsDragging(null)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, localMin, localMax, onChange, onDragEnd, handleMove])

  const minPercentage = getPercentage(localMin)
  const maxPercentage = getPercentage(localMax)

  const priceFromText = t('priceFromValue', { value: localMin, currency: currencyLabel })
  const priceToText = t('priceToValue', { value: localMax, currency: currencyLabel })

  return (
    <div className="space-y-4">
      <div
        ref={sliderRef}
        className="relative h-2 bg-[#E5E5E5] rounded-full cursor-pointer group"
        onMouseDown={e => {
          const value = getValueFromPosition(e.clientX)
          const minDist = Math.abs(value - localMin)
          const maxDist = Math.abs(value - localMax)
          handleStart(minDist < maxDist ? 'min' : 'max', e.clientX)
        }}
        onTouchStart={e => {
          if (!e.touches[0]) return
          const value = getValueFromPosition(e.touches[0].clientX)
          const minDist = Math.abs(value - localMin)
          const maxDist = Math.abs(value - localMax)
          handleStart(minDist < maxDist ? 'min' : 'max', e.touches[0].clientX)
        }}
      >
        <div
          className="absolute h-2 bg-[#FF8B7A] rounded-full transition-all duration-150"
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`,
          }}
        />

        {/* Min Handle */}
        <div
          className={cn(
            'absolute w-5 h-5 bg-[#FF8B7A] rounded-full cursor-grab active:cursor-grabbing shadow-md transform -translate-x-1/2 -translate-y-1.5 z-10 transition-all duration-150',
            isDragging === 'min' && 'scale-125 shadow-lg',
            hoveredHandle === 'min' && 'scale-110'
          )}
          style={{ left: `${minPercentage}%` }}
          onMouseDown={e => {
            e.stopPropagation()
            handleStart('min', e.clientX)
          }}
          onTouchStart={e => {
            e.stopPropagation()
            if (e.touches[0]) handleStart('min', e.touches[0].clientX)
          }}
          onMouseEnter={() => setHoveredHandle('min')}
          onMouseLeave={() => setHoveredHandle(null)}
        >
          {(isDragging === 'min' || hoveredHandle === 'min') && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-12 rounded whitespace-nowrap">
              {priceFromText}
            </div>
          )}
        </div>

        {/* Max Handle */}
        <div
          className={cn(
            'absolute w-5 h-5 bg-[#FF8B7A] rounded-full cursor-grab active:cursor-grabbing shadow-md transform -translate-x-1/2 -translate-y-1.5 z-10 transition-all duration-150',
            isDragging === 'max' && 'scale-125 shadow-lg',
            hoveredHandle === 'max' && 'scale-110'
          )}
          style={{ left: `${maxPercentage}%` }}
          onMouseDown={e => {
            e.stopPropagation()
            handleStart('max', e.clientX)
          }}
          onTouchStart={e => {
            e.stopPropagation()
            if (e.touches[0]) handleStart('max', e.touches[0].clientX)
          }}
          onMouseEnter={() => setHoveredHandle('max')}
          onMouseLeave={() => setHoveredHandle(null)}
        >
          {(isDragging === 'max' || hoveredHandle === 'max') && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-12 rounded whitespace-nowrap">
              {priceToText}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-12">
        <div className="flex flex-col items-start gap-1">
          <span className="text-gray-500">{priceFromText}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-gray-500">{priceToText}</span>
        </div>
      </div>
    </div>
  )
}

export interface ProductFiltersProps {
  categories: ProductCategory[]
  filters: ProductFilter
  onFiltersChange: (filters: ProductFilter) => void
  onReset: () => void
  className?: string
}

export const ProductFilters = ({
  categories,
  filters,
  onFiltersChange,
  onReset: _onReset,
  className,
}: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [priceRange, setPriceRange] = useState({
    min: filters.priceRange?.min || 0,
    max: filters.priceRange?.max || 300,
  })

  const priceInputTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const t = useI18nTranslations('common.filtersPanel')
  const tCommon = useI18nTranslations('common')
  const currencyLabel = tCommon('currency')
  
  // For price range slider, we need keys from servicefilters namespace
  const tPrice = useI18nTranslations('services.serviceCategories.servicefilters')

  useEffect(() => {
    return () => {
      if (priceInputTimeoutRef.current) clearTimeout(priceInputTimeoutRef.current)
    }
  }, [])

  const activeFiltersCount =
    (filters.category?.length || 0) +
    (filters.inStock !== undefined ? 1 : 0) +
    (filters.tags?.length || 0)

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = filters.category || []
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId]

    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    })
  }

  const handleStockToggle = () => {
    onFiltersChange({
      ...filters,
      inStock:
        filters.inStock === undefined
          ? true
          : filters.inStock === true
            ? false
            : undefined,
    })
  }

  return (
    <div className={cn('relative', className)}>
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span>{t('filters')}</span>
          {activeFiltersCount > 0 && (
            <Badge
              variant="default"
              className="bg-brand-500 !text-white text-12 px-1.5 py-0.5"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </div>
      </Button>

      {/* Filter Panel */}
      <div
        className={cn(
          'bg-white border border-gray-200 rounded-xl p-6 space-y-6',
          isOpen ? 'block' : 'hidden md:block'
        )}
      >
        {/* Categories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-14 font-semibold text-gray-900">{t('categories')}</h4>

            {filters.category && filters.category.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFiltersChange({ ...filters, category: undefined })}
                className="text-12 text-gray-500 hover:text-gray-700 h-auto p-2"
              >
                {t('clear')}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  checked={filters.category?.includes(category.id) || false}
                  onChange={checked => {
                    if (checked) {
                      const currentCategories = filters.category || []
                      onFiltersChange({
                        ...filters,
                        category: [...currentCategories, category.id],
                      })
                    } else {
                      const currentCategories = filters.category || []
                      const newCategories = currentCategories.filter(id => id !== category.id)
                      onFiltersChange({
                        ...filters,
                        category: newCategories.length > 0 ? newCategories : undefined,
                      })
                    }
                  }}
                  variant={
                    filters.category?.includes(category.id) ? 'brandFilled' : 'brand'
                  }
                />

                <label
                  className="text-14 text-gray-700 cursor-pointer flex-1"
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  {category.name}
                  {category.productCount !== undefined && (
                    <span className="text-12 text-gray-500 ml-1">
                      ({category.productCount})
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h4 className="text-14 font-semibold text-gray-900">{t('price')}</h4>

          <PriceRangeSlider
            min={0}
            max={300}
            minValue={Math.min(priceRange.min, 300)}
            maxValue={Math.min(priceRange.max, 300)}
            onChange={(min, max) => setPriceRange({ min, max })}
            onDragEnd={(min, max) => {
              const newRange = { min, max }
              setPriceRange(newRange)
              onFiltersChange({ ...filters, priceRange: newRange })
            }}
            currencyLabel={currencyLabel}
            t={tPrice}
          />

          {/* From / To Inputs */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-12 text-gray-600 mb-1 block">{t('from')}</label>
              <Input
                type="number"
                value={priceRange.min || ''}
                onChange={e => {
                  const minValue = parseInt(e.target.value, 10) || 0
                  const newRange = { min: Math.max(0, minValue), max: priceRange.max }
                  setPriceRange(newRange)

                  if (priceInputTimeoutRef.current) clearTimeout(priceInputTimeoutRef.current)

                  priceInputTimeoutRef.current = setTimeout(() => {
                    onFiltersChange({ ...filters, priceRange: newRange })
                  }, 500)
                }}
                placeholder="0"
                className="h-10"
              />
            </div>

            <div className="flex-1">
              <label className="text-12 text-gray-600 mb-1 block">{t('to')}</label>
              <Input
                type="number"
                value={priceRange.max || ''}
                onChange={e => {
                  const maxValue = parseInt(e.target.value, 10) || 300
                  const newRange = { min: priceRange.min, max: Math.min(300, maxValue) }
                  setPriceRange(newRange)

                  if (priceInputTimeoutRef.current) clearTimeout(priceInputTimeoutRef.current)

                  priceInputTimeoutRef.current = setTimeout(() => {
                    onFiltersChange({ ...filters, priceRange: newRange })
                  }, 500)
                }}
                placeholder="300"
                className="h-10"
              />
            </div>
          </div>
        </div>

        {/* Stock Status */}
        <div className="space-y-3">
          <h4 className="text-14 font-semibold text-gray-900">{t('availability')}</h4>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={filters.inStock === true}
              onChange={checked => {
                onFiltersChange({ ...filters, inStock: checked ? true : undefined })
              }}
              variant={filters.inStock === true ? 'brandFilled' : 'brand'}
            />
            <label
              className="text-14 text-gray-700 cursor-pointer"
              onClick={() => {
                onFiltersChange({
                  ...filters,
                  inStock: filters.inStock === true ? undefined : true,
                })
              }}
            >
              {t('inStockOnly')}
            </label>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {filters.category?.map(categoryId => {
                const category = categories.find(c => c.id === categoryId)
                return (
                  <Badge
                    key={categoryId}
                    variant="outline"
                    className="text-12 px-2 py-1 flex items-center gap-1"
                  >
                    {category?.name}
                    <button
                      onClick={() => handleCategoryToggle(categoryId)}
                      className="ml-1"
                      aria-label={t('removeCategory')}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}

              {filters.inStock && (
                <Badge
                  variant="outline"
                  className="text-12 px-2 py-1 flex items-center gap-1"
                >
                  {t('inStock')}
                  <button
                    onClick={handleStockToggle}
                    className="ml-1"
                    aria-label={t('removeStockFilter')}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
