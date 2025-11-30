import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Checkbox } from './Checkbox'
import { Input } from './Input'
import { Badge } from './Badge'
import { X, SlidersHorizontal } from 'lucide-react'
import type { ProductFilter, ProductCategory } from '@/types/product'

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
  onReset,
  className,
}: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [priceRange, setPriceRange] = useState({
    min: filters.priceRange?.min || 0,
    max: filters.priceRange?.max || 10000,
  })

  const activeFiltersCount =
    (filters.category?.length || 0) +
    (filters.rating ? 1 : 0) +
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

  const handlePriceRangeChange = () => {
    onFiltersChange({
      ...filters,
      priceRange: {
        min: priceRange.min,
        max: priceRange.max,
      },
    })
  }

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? undefined : rating,
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
          <span>Filters</span>
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-18 font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-14 text-brand-500 hover:text-brand-600"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-14 font-semibold text-gray-900">Categories</h4>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  checked={filters.category?.includes(category.id) || false}
                  onChange={() => handleCategoryToggle(category.id)}
                />
                <label className="text-14 text-gray-700 cursor-pointer flex-1">
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
          <h4 className="text-14 font-semibold text-gray-900">Price Range</h4>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min || ''}
              onChange={e =>
                setPriceRange({ ...priceRange, min: Number(e.target.value) })
              }
              className="text-14"
            />
            <span className="text-gray-500">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max || ''}
              onChange={e =>
                setPriceRange({ ...priceRange, max: Number(e.target.value) })
              }
              className="text-14"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handlePriceRangeChange}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <h4 className="text-14 font-semibold text-gray-900">Rating</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div
                key={rating}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleRatingChange(rating)}
              >
                <Checkbox
                  checked={filters.rating === rating}
                  onChange={() => handleRatingChange(rating)}
                />
                <label className="text-14 text-gray-700 cursor-pointer flex items-center gap-1">
                  {rating}+ Stars
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Status */}
        <div className="space-y-3">
          <h4 className="text-14 font-semibold text-gray-900">
            Availability
          </h4>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={filters.inStock === true}
              onChange={handleStockToggle}
            />
            <label className="text-14 text-gray-700 cursor-pointer">
              In Stock Only
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
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
              {filters.rating && (
                <Badge
                  variant="outline"
                  className="text-12 px-2 py-1 flex items-center gap-1"
                >
                  {filters.rating}+ Stars
                  <button
                    onClick={() => handleRatingChange(filters.rating!)}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.inStock && (
                <Badge
                  variant="outline"
                  className="text-12 px-2 py-1 flex items-center gap-1"
                >
                  In Stock
                  <button onClick={handleStockToggle} className="ml-1">
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

