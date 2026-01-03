/**
 * Provider Filters Modal Component
 * Filter modal for provider search matching the screenshot design
 */

'use client'

import { useState } from 'react'
import { X, Heart, MapPin, Star, Tag, Users } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import { cn } from '@/lib/utils'

export type SortOption = 'best-match' | 'nearest' | 'top-rated'
export type VenueType = 'everyone' | 'female-only' | 'male-only'

export interface ProviderFilters {
  sortBy: SortOption
  maxPrice: number
  venueType: VenueType
  offersDeals: boolean
  acceptsGroups: boolean
}

export interface ProviderFiltersModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: ProviderFilters) => void
  initialFilters?: Partial<ProviderFilters>
  maxPriceRange?: { min: number; max: number }
  currency?: string
}

const DEFAULT_FILTERS: ProviderFilters = {
  sortBy: 'best-match',
  maxPrice: 2000,
  venueType: 'everyone',
  offersDeals: false,
  acceptsGroups: false,
}

export const ProviderFiltersModal = ({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  maxPriceRange = { min: 0, max: 5000 },
  currency = 'SAR',
}: ProviderFiltersModalProps) => {
  const [filters, setFilters] = useState<ProviderFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  })

  const handleSortChange = (sortBy: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy }))
  }

  const handlePriceChange = (value: number) => {
    setFilters(prev => ({ ...prev, maxPrice: value }))
  }

  const handleVenueTypeChange = (venueType: VenueType) => {
    setFilters(prev => ({ ...prev, venueType }))
  }

  const handleToggleOffersDeals = () => {
    setFilters(prev => ({ ...prev, offersDeals: !prev.offersDeals }))
  }

  const handleToggleAcceptsGroups = () => {
    setFilters(prev => ({ ...prev, acceptsGroups: !prev.acceptsGroups }))
  }

  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS)
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const hasActiveFilters = 
    filters.sortBy !== DEFAULT_FILTERS.sortBy ||
    filters.maxPrice !== DEFAULT_FILTERS.maxPrice ||
    filters.venueType !== DEFAULT_FILTERS.venueType ||
    filters.offersDeals !== DEFAULT_FILTERS.offersDeals ||
    filters.acceptsGroups !== DEFAULT_FILTERS.acceptsGroups

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      containerClassName="bg-white rounded-2xl shadow-2xl"
      className="items-start pt-20"
      closeOnOverlayClick={true}
      showCloseButton={false}
    >
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-24 font-bold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close filters"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto">
          {/* Sort by Section */}
          <div>
            <h3 className="text-16 font-semibold text-gray-900 mb-4">Sort by</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSortChange('best-match')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full text-14 font-medium transition-all",
                  filters.sortBy === 'best-match'
                    ? 'bg-brand-50 border-2 border-brand-500 text-brand-700'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                )}
              >
                <Heart className={cn(
                  "h-4 w-4",
                  filters.sortBy === 'best-match' ? 'text-brand-600 fill-brand-600' : 'text-gray-500'
                )} />
                Best match
              </button>
              <button
                onClick={() => handleSortChange('nearest')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full text-14 font-medium transition-all",
                  filters.sortBy === 'nearest'
                    ? 'bg-brand-50 border-2 border-brand-500 text-brand-700'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                )}
              >
                <MapPin className={cn(
                  "h-4 w-4",
                  filters.sortBy === 'nearest' ? 'text-brand-600' : 'text-gray-500'
                )} />
                Nearest
              </button>
              <button
                onClick={() => handleSortChange('top-rated')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full text-14 font-medium transition-all",
                  filters.sortBy === 'top-rated'
                    ? 'bg-brand-50 border-2 border-brand-500 text-brand-700'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                )}
              >
                <Star className={cn(
                  "h-4 w-4",
                  filters.sortBy === 'top-rated' ? 'text-brand-600 fill-brand-600' : 'text-gray-500'
                )} />
                Top rated
              </button>
            </div>
          </div>

          {/* Maximum Price Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-16 font-semibold text-gray-900">Maximum price</h3>
              <span className="text-16 font-semibold text-gray-900">
                {currency} {filters.maxPrice.toLocaleString()}
              </span>
            </div>
            <div className="px-2">
              <input
                type="range"
                min={maxPriceRange.min}
                max={maxPriceRange.max}
                step={100}
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #F14836 0%, #F14836 ${((filters.maxPrice - maxPriceRange.min) / (maxPriceRange.max - maxPriceRange.min)) * 100}%, #e5e7eb ${((filters.maxPrice - maxPriceRange.min) / (maxPriceRange.max - maxPriceRange.min)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #F14836;
                  cursor: pointer;
                  border: 3px solid white;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                .slider::-moz-range-thumb {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #F14836;
                  cursor: pointer;
                  border: 3px solid white;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
              `}</style>
            </div>
          </div>

          {/* Venue Type Section */}
          <div>
            <h3 className="text-16 font-semibold text-gray-900 mb-4">Venue type</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleVenueTypeChange('everyone')}
                className={cn(
                  "px-4 py-2.5 rounded-full text-14 font-medium transition-all",
                  filters.venueType === 'everyone'
                    ? 'bg-brand-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                )}
              >
                Everyone
              </button>
              <button
                onClick={() => handleVenueTypeChange('female-only')}
                className={cn(
                  "px-4 py-2.5 rounded-full text-14 font-medium transition-all",
                  filters.venueType === 'female-only'
                    ? 'bg-brand-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                )}
              >
                Female only
              </button>
              <button
                onClick={() => handleVenueTypeChange('male-only')}
                className={cn(
                  "px-4 py-2.5 rounded-full text-14 font-medium transition-all",
                  filters.venueType === 'male-only'
                    ? 'bg-brand-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                )}
              >
                Male only
              </button>
            </div>
          </div>

          {/* Booking Options Section */}
          <div>
            <h3 className="text-16 font-semibold text-gray-900 mb-4">Booking options</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleOffersDeals}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full text-14 font-medium transition-all",
                  filters.offersDeals
                    ? 'bg-brand-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                )}
              >
                <Tag className="h-4 w-4" />
                Offers deals
              </button>
              <button
                onClick={handleToggleAcceptsGroups}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full text-14 font-medium transition-all",
                  filters.acceptsGroups
                    ? 'bg-brand-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                )}
              >
                <Users className="h-4 w-4" />
                Accepts groups
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 px-6 py-5 border-t border-gray-200">
          <Button
            onClick={handleClearAll}
            variant="outline"
            className="flex-1 h-12 rounded-xl text-16 font-medium border-gray-300 hover:bg-gray-50"
            disabled={!hasActiveFilters}
          >
            Clear all
          </Button>
          <Button
            onClick={handleApply}
            variant="default"
            className="flex-1 h-12 rounded-xl text-16 font-medium bg-gray-900 hover:bg-gray-800 !text-white"
          >
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  )
}

