'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, Check, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'
import type { CartProviderResponse } from '@/types/responses'

export interface ProviderMultiSelectProps {
  providers: CartProviderResponse[]
  selectedProviderIds: number[]
  onChange: (providerIds: number[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const ProviderMultiSelect = ({
  providers,
  selectedProviderIds,
  onChange,
  placeholder = 'Select providers...',
  className,
  disabled,
}: ProviderMultiSelectProps) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter providers based on search query
  const filteredProviders = useMemo(() => {
    if (!searchQuery.trim()) {
      return providers
    }
    const query = searchQuery.toLowerCase()
    return providers.filter(
      (provider) => {
        // General cart (providerId is null) - search by "general"
        if (provider.providerId === null || provider.providerId === undefined) {
          return 'general'.includes(query)
        }
        return (
          provider.providerNameEn?.toLowerCase().includes(query) ||
          provider.providerNameAr?.toLowerCase().includes(query)
        )
      }
    )
  }, [providers, searchQuery])

  const selectedProviders = useMemo(() => {
    // Filter providers that are selected (by providerId)
    // Note: General cart (providerId is null) is handled separately by parent via cartId
    return providers.filter((p) => {
      if (p.providerId === null || p.providerId === undefined) {
        return false // General cart selection is handled by parent component
      }
      return selectedProviderIds.includes(p.providerId)
    })
  }, [providers, selectedProviderIds])

  const handleToggleProvider = (providerId: number | null) => {
    if (providerId === null || providerId === undefined) {
      // General cart - handled separately by parent
      return
    }
    if (selectedProviderIds.includes(providerId)) {
      onChange(selectedProviderIds.filter((id) => id !== providerId))
    } else {
      onChange([...selectedProviderIds, providerId])
    }
  }

  const handleSelectAll = () => {
    // Filter out general cart (providerId is null) for select all
    const providerCarts = providers.filter(p => p.providerId !== null && p.providerId !== undefined)
    const providerIds = providerCarts.map((p) => p.providerId!).filter((id): id is number => id !== null)
    
    if (selectedProviderIds.length === providerIds.length) {
      onChange([])
    } else {
      onChange(providerIds)
    }
  }

  const handleRemoveProvider = (providerId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selectedProviderIds.filter((id) => id !== providerId))
  }

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  // Focus search input when popover opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const displayText =
    selectedProviders.length === 0
      ? placeholder
      : selectedProviders.length === 1
        ? selectedProviders[0].providerNameEn || selectedProviders[0].providerNameAr
        : `${selectedProviders.length} providers selected`

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'flex w-full items-center justify-between gap-1.5 rounded-lg border bg-white px-2.5 py-1 text-14 font-normal leading-5 transition-colors',
              'h-9 min-h-[36px]',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
              'border-gray-300 hover:border-brand-400 focus:border-brand-500',
              disabled && 'cursor-not-allowed opacity-50',
              className?.includes('w-') && 'text-12'
            )}
          >
            <div className="flex-1 flex items-center gap-1.5 min-w-0">
              {selectedProviders.length > 0 ? (
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    {selectedProviders.slice(0, 2).map((provider) => {
                      const displayName = provider.providerId === null || provider.providerId === undefined
                        ? 'General'
                        : (provider.providerNameEn || provider.providerNameAr)
                      return (
                      <span
                        key={provider.providerId ?? `general-${provider.cartId}`}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-brand-100 text-brand-700 rounded text-11 font-medium"
                      >
                        <span className="truncate max-w-[60px]">
                          {displayName}
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (provider.providerId !== null && provider.providerId !== undefined) {
                              handleRemoveProvider(provider.providerId, e)
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              e.stopPropagation()
                              if (provider.providerId !== null && provider.providerId !== undefined) {
                                handleRemoveProvider(provider.providerId, e as any)
                              }
                            }
                          }}
                          className="hover:text-brand-900 flex-shrink-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-500 rounded"
                        >
                          <X className="h-2.5 w-2.5" />
                        </span>
                      </span>
                      )
                    })}
                    {selectedProviders.length > 2 && (
                      <span className="text-11 text-gray-600 font-medium">
                        +{selectedProviders.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-14 text-gray-500 truncate">{displayText}</span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {selectedProviders.length > 0 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClearAll}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleClearAll(e as any)
                    }
                  }}
                  className="p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-500 rounded"
                  aria-label="Clear all"
                >
                  <X className="h-3 w-3" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform flex-shrink-0',
                  open && 'rotate-180'
                )}
              />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 bg-white border border-gray-200 rounded-xl shadow-lg w-[var(--radix-popover-trigger-width)] !z-[9999]"
          align="start"
          sideOffset={4}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search providers..."
                className="w-full pl-9 pr-3 py-2 text-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Select All Option */}
          <div className="p-2 border-b border-gray-200">
            <button
              type="button"
              onClick={handleSelectAll}
              className="w-full text-left px-3 py-2 text-14 font-medium text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
            >
              {selectedProviderIds.length === providers.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Provider List */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredProviders.length === 0 ? (
              <div className="p-4 text-center text-14 text-gray-500">
                No providers found
              </div>
            ) : (
              filteredProviders.map((provider) => {
                const isSelected = provider.providerId !== null && provider.providerId !== undefined
                  ? selectedProviderIds.includes(provider.providerId)
                  : false
                return (
                  <button
                    key={provider.providerId ?? `general-${provider.cartId}`}
                    type="button"
                    onClick={() => handleToggleProvider(provider.providerId ?? null)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 text-16 font-normal transition-colors',
                      'hover:bg-gray-50',
                      isSelected && 'bg-brand-50'
                    )}
                  >
                    {/* Provider Image */}
                    <div className="relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                      {provider.providerImage ? (
                        <Image
                          src={provider.providerImage}
                          alt={provider.providerNameEn || provider.providerNameAr || 'Provider'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-18 font-semibold">
                            {(provider.providerNameEn || provider.providerNameAr || 'P')[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Provider Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-14 font-medium text-gray-900 truncate">
                        {provider.providerId === null || provider.providerId === undefined
                          ? 'General'
                          : (provider.providerNameEn || provider.providerNameAr || 'Provider')}
                      </div>
                      <div className="text-12 text-gray-500">
                        {provider.itemCount} {provider.itemCount === 1 ? 'item' : 'items'}
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div
                      className={cn(
                        'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                        isSelected
                          ? 'bg-brand-500 border-brand-500'
                          : 'border-gray-300 bg-white'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}



