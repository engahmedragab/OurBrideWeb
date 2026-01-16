'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { Search, MapPin, Calendar, Map, List, X, Navigation, Filter, Building2 } from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/DatePicker'
import { Input } from '@/components/ui/Input'
import { EmptyState, LoadingSpinner, ProviderSearchCard, ProviderMap, Typography, CardWrapper, RatingDisplay } from '@/components/ui'
import { ProviderFiltersModal, type ProviderFilters, type SortOption } from '@/components/ui/ProviderFiltersModal'
import type { FeaturedProviderResponse } from '@/types/responses'

// Type for providers with coordinates
type ProviderWithCoords = FeaturedProviderResponse & { 
  latitude?: number
  longitude?: number
}

// Type guard to check if provider has coordinates
function hasCoordinates(provider: FeaturedProviderResponse): provider is ProviderWithCoords & { latitude: number; longitude: number } {
  const withCoords = provider as ProviderWithCoords
  return typeof withCoords.latitude === 'number' && typeof withCoords.longitude === 'number'
}
import { cn } from '@/lib/utils'
import orderEmptySvg from '@/assets/svg/order-empty.svg'
import { useProvidersFilter } from '@/hooks/providers/useProvidersFilter'
import { useProvidersMap } from '@/hooks/providers/useProvidersMap'

// Google Maps API Key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDAwJZexZRlbt9nAwu2Kr8wWaJnMdtblfE'

// Add custom marker styles for black teardrop markers
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    .custom-map-marker {
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .custom-map-marker:hover {
      transform: translate(-50%, -100%) scale(1.15);
      z-index: 1000 !important;
    }
    .custom-map-marker:hover .marker-teardrop {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
  `
  if (!document.head.querySelector('style[data-marker-styles]')) {
    style.setAttribute('data-marker-styles', 'true')
    document.head.appendChild(style)
  }
}

// All provider data now comes from API - no mock data needed

function ProvidersSearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    searchParams.get('date') ? new Date(searchParams.get('date')!) : undefined
  )
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map')
  const [selectedProvider, setSelectedProvider] = useState<FeaturedProviderResponse | null>(null)
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ProviderFilters>({
    sortBy: 'best-match',
    maxPrice: 2000,
    venueType: 'everyone',
    offersDeals: false,
    acceptsGroups: false,
  })

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch providers from API - use different endpoints based on view mode
  // Map sort option to API sortBy parameter
  const getSortByParam = (sortOption: SortOption): string | undefined => {
    switch (sortOption) {
      case 'best-match':
        return undefined // Default
      case 'nearest':
        return 'distance'
      case 'top-rated':
        return 'rating'
      default:
        return undefined
    }
  }

  // For map view, use the map-specific endpoint with location data
  const { data: mapProviders, isLoading: isLoadingMapProviders } = useProvidersMap({
    latitude: userCoordinates?.lat,
    longitude: userCoordinates?.lng,
    radius: userCoordinates ? 50 : undefined, // 50km radius when location is available
    sortBy: getSortByParam(filters.sortBy),
    venueType: filters.venueType !== 'everyone' ? filters.venueType : undefined,
    offersDeals: filters.offersDeals || undefined,
    acceptsGroups: filters.acceptsGroups || undefined,
    enabled: viewMode === 'map', // Always enabled in map view, even without user coordinates
  })

  // For list view, use the filter endpoint with search
  const { data: filterProviders, isLoading: isLoadingFilterProviders } = useProvidersFilter({
    search: debouncedSearchQuery || undefined,
    latitude: userCoordinates?.lat,
    longitude: userCoordinates?.lng,
    radius: userCoordinates ? 50 : undefined,
    sortBy: getSortByParam(filters.sortBy),
    venueType: filters.venueType !== 'everyone' ? filters.venueType : undefined,
    offersDeals: filters.offersDeals || undefined,
    acceptsGroups: filters.acceptsGroups || undefined,
    pageSize: 100,
  }, {
    enabled: viewMode === 'list', // Only enabled in list view
  })

  // Combine loading states
  const isLoadingProviders = viewMode === 'map' ? isLoadingMapProviders : isLoadingFilterProviders

  // Select the appropriate API data based on view mode
  const apiProviders = viewMode === 'map' ? mapProviders : filterProviders

  // Load Google Maps script
  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log('Checking Google Maps...', {
      hasGoogle: !!window.google,
      hasApiKey: !!GOOGLE_MAPS_API_KEY,
      apiKey: GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing'
    })

    if (window.google?.maps) {
      console.log('Google Maps already loaded')
      return
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      console.log('Google Maps script already exists in DOM')
      return
    }

    if (!GOOGLE_MAPS_API_KEY) {
      // Silently skip loading Google Maps if API key is not configured
      // This is expected in development environments without a key
      return
    }

    console.log('Loading Google Maps script...')
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log('Google Maps script loaded successfully')
    }
    script.onerror = (error) => {
      console.error('Failed to load Google Maps script:', error)
    }
    document.head.appendChild(script)
  }, [])

  // Use API providers - no fallback needed
  const providers = useMemo(() => {
    console.log('[ProvidersSearchContent] apiProviders:', apiProviders)
    console.log('[ProvidersSearchContent] apiProviders length:', apiProviders?.length || 0)
    if (apiProviders && apiProviders.length > 0) {
      console.log('[ProvidersSearchContent] Sample provider:', apiProviders[0])
      const firstProvider = apiProviders[0]
      if (hasCoordinates(firstProvider)) {
        console.log('[ProvidersSearchContent] Provider with coords:', {
          id: firstProvider.id,
          name: firstProvider.nameEn,
          latitude: firstProvider.latitude,
          longitude: firstProvider.longitude,
        })
      }
    }
    return apiProviders || []
  }, [apiProviders])

  // Filter providers (additional client-side filtering if needed)
  const filteredProviders = useMemo(() => {
    let filtered = providers

    // Additional location filtering for non-map view
    if (location.trim() && viewMode !== 'map' && !userCoordinates) {
      const loc = location.toLowerCase()
      filtered = filtered.filter(provider => {
        const address = provider.shortAddress?.toLowerCase() || ''
        return address.includes(loc)
      })
    }

    return filtered
  }, [providers, location, viewMode, userCoordinates])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append('q', searchQuery)
    if (location) params.append('location', location)
    if (selectedDate) {
      const dateStr = selectedDate instanceof Date
        ? selectedDate.toISOString().split('T')[0]
        : selectedDate
      params.append('date', dateStr)
    }

    router.push(`/providers/search?${params.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleProviderClick = (providerId: number) => {
    router.push(`/provider/${providerId}`)
  }

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        setUserCoordinates({ lat: latitude, lng: longitude })

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
          )
          const data = await response.json()

          if (data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address
            setLocation(address)
          } else {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          }
        } catch (error) {
          console.error('Error getting address:', error)
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        }

        setIsGettingLocation(false)
        setIsLocationPopoverOpen(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to retrieve your location. Please check your browser permissions.')
        setIsGettingLocation(false)
      }
    )
  }

  // Calculate map center based on user coordinates or providers
  const mapCenter = useMemo(() => {
    if (userCoordinates) {
      return { lat: userCoordinates.lat, lng: userCoordinates.lng }
    }
    // If we have providers, calculate center from their coordinates
    if (filteredProviders.length > 0) {
      const providersWithCoords = filteredProviders.filter(hasCoordinates)

      if (providersWithCoords.length > 0) {
        const avgLat = providersWithCoords.reduce((sum, p) => sum + p.latitude, 0) / providersWithCoords.length
        const avgLng = providersWithCoords.reduce((sum, p) => sum + p.longitude, 0) / providersWithCoords.length
        return { lat: avgLat, lng: avgLng }
      }
    }
    // Default to Cairo, Egypt
    return { lat: 30.0444, lng: 31.2357 }
  }, [userCoordinates, filteredProviders])

  const mapZoom = userCoordinates ? 12 : 11

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Search Bar Section */}
        <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="container-custom py-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              {/* Treatment/Service Input */}
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Treatment or venue"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  prefixIcon={Search}
                  variant="fill"
                  size="lg"
                  className="h-12"
                />
              </div>

              {/* Location Input with Popover */}
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsLocationPopoverOpen(true)}
                  prefixIcon={MapPin}
                  variant="fill"
                  size="lg"
                  className="h-12"
                />
                {isLocationPopoverOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsLocationPopoverOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 p-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                      <button
                        onClick={handleGetCurrentLocation}
                        disabled={isGettingLocation}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                      >
                        <Navigation className={cn(
                          "h-5 w-5 text-brand-600 flex-shrink-0",
                          isGettingLocation && "animate-pulse"
                        )} />
                        <div className="flex-1">
                          <div className="text-14 font-medium text-gray-900">
                            {isGettingLocation ? 'Getting your location...' : 'Use current location'}
                          </div>
                          <div className="text-12 text-gray-500">
                            {isGettingLocation ? 'Please wait' : 'Automatically detect your location'}
                          </div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Date Picker */}
              <div className="flex-1">
                <DatePicker
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date instanceof Date ? date : undefined)}
                  placeholder="Pick a date"
                  prefixIcon={Calendar}
                  size="lg"
                  className="h-12"
                />
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                variant="default"
                size="md"
                className="px-8 flex-shrink-0 !text-white"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Header with Count and Action Buttons */}
        <div className="sticky top-[calc(4rem+1px)] z-30 bg-white border-b border-gray-200">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between">
              {/* Results Count */}
              <Typography variant="body" weight="regular">
                <span className="font-semibold">{filteredProviders.length}</span> providers nearby
              </Typography>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Filters Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-14 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-14 font-medium transition-colors",
                      viewMode === 'list'
                        ? 'bg-white text-brand-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <List className="h-4 w-4" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-14 font-medium transition-colors",
                      viewMode === 'map'
                        ? 'bg-white text-brand-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <Map className="h-4 w-4" />
                    Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle and Results */}
        <div className="container-custom py-6">

          {/* Content Area */}
          {isLoadingProviders ? (
            // Loading State
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : viewMode === 'list' ? (
            // List View
            filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProviders.map((provider) => {
                  // Use topRatedServices from provider (now part of FeaturedProviderResponse)
                  const services = provider.topRatedServices || []
                  const totalServices = provider.totalServices || 0

                  return (
                    <ProviderSearchCard
                      key={provider.id}
                      provider={provider}
                      services={services.map(svc => {
                        // Determine price based on priceType (0 = Buy, 1 = Rent, etc.)
                        // PriceType enum: 0=Fixed, 1=Free, 2=From
                        // But backend uses: 0=Buy, 1=Rent
                        const priceTypeNum = typeof svc.priceType === 'number' ? svc.priceType : 0
                        const price = priceTypeNum === 1 ? (svc.rentPrice ?? 0) : (svc.buyPrice ?? 0)
                        const salePrice = priceTypeNum === 1 ? (svc.saleRentPrice ?? null) : (svc.saleBuyPrice ?? null)
                        const finalPrice = salePrice ?? price
                        const hasDiscount = svc.hasDiscount || (salePrice !== null && salePrice < price)

                        // Parse duration from durationDisplay or duration field
                        let durationMin: number | undefined
                        let durationMax: number | undefined
                        if (svc.durationDisplay) {
                          // Parse "30 min - 45 min" format
                          const match = svc.durationDisplay.match(/(\d+)\s*-\s*(\d+)/)
                          if (match) {
                            durationMin = parseInt(match[1])
                            durationMax = parseInt(match[2])
                          } else {
                            const singleMatch = svc.durationDisplay.match(/(\d+)/)
                            if (singleMatch) {
                              durationMin = parseInt(singleMatch[1])
                            }
                          }
                        } else if (typeof svc.duration === 'number') {
                          durationMin = svc.duration
                        } else if (svc.durationMin) {
                          durationMin = svc.durationMin
                          durationMax = svc.durationMax
                        }

                        return {
                          id: svc.id,
                          name: svc.name,
                          nameEn: svc.nameEn || svc.name,
                          nameAr: svc.nameAr,
                          duration: durationMin,
                          durationMin,
                          durationMax,
                          price: finalPrice,
                          salePrice: salePrice ?? undefined,
                          hasDiscount,
                        }
                      })}
                      totalServices={totalServices}
                      onClick={() => handleProviderClick(provider.id)}
                    />
                  )
                })}
              </div>
            ) : (
              <EmptyState
                illustration={orderEmptySvg}
                title="No providers found"
                description="Try adjusting your search terms or location"
                actionLabel="Clear Filters"
                actionHref="/providers"
              />
            )
          ) : (
            // Map View
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
                {/* Left: Provider List */}
                <div className="overflow-y-auto pr-2">
                  {filteredProviders.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {filteredProviders.map((provider) => {
                        // Use topRatedServices from provider (now part of FeaturedProviderResponse)
                        const services = provider.topRatedServices || []
                        const totalServices = provider.totalServices || 0

                        const isSelected = selectedProvider?.id === provider.id
                        return (
                          <div
                            key={provider.id}
                            onClick={() => setSelectedProvider(provider)}
                            className={cn(
                              "cursor-pointer transition-all duration-200",
                              isSelected && "outline-2 outline-brand-500 outline-offset-2 rounded-xl"
                            )}
                          >
                            <ProviderSearchCard
                              provider={provider}
                              className={isSelected ? "border-2 border-brand-500 shadow-lg" : ""}
                              services={services.map(svc => {
                                // Determine price based on priceType (0 = Buy, 1 = Rent, etc.)
                                const priceType = svc.priceType ?? 0
                                const price = priceType === 1 ? (svc.rentPrice ?? 0) : (svc.buyPrice ?? 0)
                                const salePrice = priceType === 1 ? (svc.saleRentPrice ?? null) : (svc.saleBuyPrice ?? null)
                                const finalPrice = salePrice ?? price
                                const hasDiscount = svc.hasDiscount || (salePrice !== null && salePrice < price)

                                // Parse duration from durationDisplay or duration field
                                let durationMin: number | undefined
                                let durationMax: number | undefined
                                if (svc.durationDisplay) {
                                  // Parse "30 min - 45 min" format
                                  const match = svc.durationDisplay.match(/(\d+)\s*-\s*(\d+)/)
                                  if (match) {
                                    durationMin = parseInt(match[1])
                                    durationMax = parseInt(match[2])
                                  } else {
                                    const singleMatch = svc.durationDisplay.match(/(\d+)/)
                                    if (singleMatch) {
                                      durationMin = parseInt(singleMatch[1])
                                    }
                                  }
                                } else if (typeof svc.duration === 'number') {
                                  durationMin = svc.duration
                                } else if (svc.durationMin) {
                                  durationMin = svc.durationMin
                                  durationMax = svc.durationMax
                                }

                                return {
                                  id: svc.id,
                                  name: svc.name,
                                  nameEn: svc.nameEn || svc.name,
                                  nameAr: svc.nameAr,
                                  duration: durationMin,
                                  durationMin,
                                  durationMax,
                                  price: finalPrice,
                                  salePrice: salePrice ?? undefined,
                                  hasDiscount,
                                }
                              })}
                              totalServices={totalServices}
                            />
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      illustration={orderEmptySvg}
                      title="No providers found"
                      description="Try adjusting your search terms or location"
                      actionLabel="Clear Filters"
                      actionHref="/providers"
                    />
                  )}
                </div>

                {/* Right: Google Map */}
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                  {window.google?.maps?.Map ? (
                    (() => {
                      console.log('[ProvidersSearchContent] Rendering ProviderMap with:', {
                        providersCount: filteredProviders.length,
                        mapCenter,
                        mapZoom,
                        selectedProviderId: selectedProvider?.id,
                        providers: filteredProviders.map(p => {
                          const hasCoords = hasCoordinates(p)
                          return {
                            id: p.id,
                            name: p.nameEn || p.nameAr,
                            latitude: hasCoords ? p.latitude : undefined,
                            longitude: hasCoords ? p.longitude : undefined,
                            hasCoords,
                          }
                        }),
                      })
                      return (
                        <ProviderMap
                          providers={filteredProviders}
                          center={mapCenter}
                          zoom={mapZoom}
                          onMarkerClick={setSelectedProvider}
                          selectedProviderId={selectedProvider?.id}
                          className="rounded-xl"
                        />
                      )
                    })()
                  ) : (
                    <div className="w-full h-full min-h-[500px] bg-gray-100 flex items-center justify-center">
                      <Typography variant="body" textColor="secondary">
                        Loading map...
                      </Typography>
                    </div>
                  )}

                  {/* Selected Provider Info Overlay */}
                  {selectedProvider && (
                    <CardWrapper className="absolute bottom-4 left-4 right-4 shadow-xl z-10">
                      <button
                        onClick={() => setSelectedProvider(null)}
                        className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-20"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                      <div className="flex items-start gap-4 pr-8">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                          {(selectedProvider.publicBannerImageUrl || selectedProvider.publicLogoImageUrl) ? (
                            <Image
                              src={selectedProvider.publicBannerImageUrl || selectedProvider.publicLogoImageUrl || ''}
                              alt={selectedProvider.nameEn || selectedProvider.nameAr || 'Provider'}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-brand-600" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <Typography variant="h6" weight="semibold" className="mb-1">
                              {selectedProvider.nameEn || selectedProvider.nameAr}
                            </Typography>
                            {selectedProvider.rate && (
                              <div className="mb-2">
                                <RatingDisplay
                                  rating={selectedProvider.rate}
                                  count={selectedProvider.totalReviews}
                                  showCount={true}
                                  showValue={true}
                                  size="sm"
                                  variant="compact"
                                  starColor="brand"
                                />
                              </div>
                            )}
                            {selectedProvider.shortAddress && (
                              <Typography variant="bodySmall" textColor="secondary" className="line-clamp-2">
                                {selectedProvider.shortAddress}
                              </Typography>
                            )}
                          </div>
                          <Button
                            onClick={() => handleProviderClick(selectedProvider.id)}
                            variant="default"
                            size="md"
                            className="!text-white flex-shrink-0"
                          >
                            View Provider
                          </Button>
                        </div>
                      </div>
                    </CardWrapper>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Filters Modal */}
      <ProviderFiltersModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={(newFilters) => {
          setFilters(newFilters)
          setShowFilters(false)
        }}
        initialFilters={filters}
        maxPriceRange={{ min: 0, max: 5000 }}
        currency="EGP"
      />
    </div>
  )
}

export default function ProvidersSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <Footer />
      </div>
    }>
      <ProvidersSearchContent />
    </Suspense>
  )
}
