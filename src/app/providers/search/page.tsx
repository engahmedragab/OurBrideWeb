'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Calendar, Map, List, X, Navigation } from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/DatePicker'
import { Input } from '@/components/ui/Input'
import { WishlistProviderCard, EmptyState, LoadingSpinner } from '@/components/ui'
import type { FeaturedProviderResponse } from '@/types/responses'
import { cn } from '@/lib/utils'
import orderEmptySvg from '@/assets/svg/order-empty.svg'
import { useProvidersFilter } from '@/hooks/providers/useProvidersFilter'
import { useProvidersMap } from '@/hooks/providers/useProvidersMap'

// Google Maps API Key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google?: {
      maps: {
        Map: new (element: HTMLElement, options?: unknown) => unknown
        Marker: new (options?: unknown) => unknown
        LatLng: new (lat: number, lng: number) => unknown
        OverlayView: new () => unknown
        InfoWindow: new (options?: unknown) => unknown
        Animation: {
          DROP: unknown
        }
        SymbolPath: {
          CIRCLE: unknown
        }
      }
    }
  }
}

// Add custom marker styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    .custom-map-marker {
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .custom-map-marker:hover {
      transform: scale(1.1);
      z-index: 1000 !important;
    }
    .custom-map-marker:hover .marker-badge {
      box-shadow: 0 4px 12px rgba(241, 72, 54, 0.5);
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

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch providers from API - use different endpoints based on view mode
  // For map view, use the map-specific endpoint with location data
  const { data: mapProviders, isLoading: isLoadingMapProviders } = useProvidersMap({
    latitude: userCoordinates?.lat,
    longitude: userCoordinates?.lng,
    radius: userCoordinates ? 50 : undefined, // 50km radius when location is available
    enabled: viewMode === 'map', // Always enabled in map view, even without user coordinates
  })

  // For list view, use the filter endpoint with search
  const { data: filterProviders, isLoading: isLoadingFilterProviders } = useProvidersFilter({
    search: debouncedSearchQuery || undefined,
    latitude: userCoordinates?.lat,
    longitude: userCoordinates?.lng,
    radius: userCoordinates ? 50 : undefined,
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
      console.error('Google Maps API key is missing')
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

  // Initialize Google Map when in map view
  useEffect(() => {
    console.log('Map initialization check:', {
      viewMode,
      hasGoogle: !!window.google,
      hasMaps: !!window.google?.maps,
      hasMap: !!window.google?.maps?.Map,
      providersCount: filteredProviders.length
    })

    if (viewMode !== 'map') {
      console.log('Not in map view, skipping initialization')
      return
    }

    if (!window.google?.maps?.Map) {
      console.log('Google Maps not ready yet, waiting...')
      // Retry after a short delay
      const timer = setTimeout(() => {
        if (window.google?.maps?.Map) {
          console.log('Google Maps now ready, initializing...')
          initializeMap()
        }
      }, 500)
      return () => clearTimeout(timer)
    }

    if (!filteredProviders.length) {
      console.log('No providers to display')
      return
    }

    initializeMap()

    function initializeMap() {
      const mapElement = document.getElementById('google-map')
      if (!mapElement) {
        console.error('Map element not found')
        return
      }

      console.log('Map element found, creating map...')

      const defaultCenter = userCoordinates 
        ? { lat: userCoordinates.lat, lng: userCoordinates.lng }
        : { lat: 30.0444, lng: 31.2357 } // Cairo, Egypt as default (from API data)

      try {
        if (!window.google?.maps?.Map) return
        
        const map = new window.google.maps.Map(mapElement, {
          center: defaultCenter,
          zoom: userCoordinates ? 12 : 11,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })
        
        console.log('Map created successfully, adding markers...')

        // Create info window for marker clicks
        const infoWindow = new window.google.maps.InfoWindow()
        
        // Add markers for each provider
        filteredProviders.forEach((provider) => {
          // Get coordinates from provider data (map API includes latitude/longitude)
          const providerWithCoords = provider as typeof provider & { latitude?: number; longitude?: number }
          
          // Skip if no coordinates available
          if (!providerWithCoords.latitude || !providerWithCoords.longitude) {
            console.warn(`Provider ${provider.id} has no coordinates, skipping marker`)
            return
          }
          
          const lat = providerWithCoords.latitude
          const lng = providerWithCoords.longitude
          const rating = provider.rate || 0
          
          // Create custom marker with rating badge
          const markerDiv = document.createElement('div')
          markerDiv.className = 'custom-map-marker'
          markerDiv.innerHTML = `
            <div style="
              position: relative;
              transform: translate(-50%, -100%);
            ">
              <!-- Rating Badge -->
              <div class="marker-badge" style="
                background: #F14836;
                color: white;
                padding: 6px 14px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(241, 72, 54, 0.4);
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 4px;
                border: 2px solid white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              ">
                ${rating > 0 ? rating.toFixed(1) : 'New'}
              </div>
              <!-- Pointer Triangle -->
              <div style="
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 10px solid #F14836;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: -8px;
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
              "></div>
            </div>
          `
          
          // Use OverlayView for custom HTML marker
          class CustomMarker extends window.google.maps.OverlayView {
            position: typeof window.google.maps.LatLng.prototype
            div?: HTMLElement
            map: typeof window.google.maps.Map.prototype
            
            constructor(position: typeof window.google.maps.LatLng.prototype, map: typeof window.google.maps.Map.prototype) {
              super()
              this.position = position
              this.map = map
            }
            
            onAdd() {
              this.div = markerDiv
              const panes = this.getPanes()
              if (panes) {
                panes.overlayMouseTarget.appendChild(this.div)
              }
              
              // Add click listener
              if (this.div) {
                this.div.addEventListener('click', () => {
                  setSelectedProvider(provider)
                  
                  // Create info window content
                  const content = `
                    <div style="padding: 12px; max-width: 250px;">
                      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111;">
                        ${provider.nameEn || provider.nameAr}
                      </h3>
                      <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
                        ${provider.shortAddress || 'No address available'}
                      </p>
                      ${provider.rate ? `
                        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                          <span style="color: #f59e0b; font-size: 14px;">★</span>
                          <span style="font-size: 14px; font-weight: 600;">${provider.rate.toFixed(1)}</span>
                          ${provider.totalReviews ? `<span style="font-size: 12px; color: #666;">(${provider.totalReviews})</span>` : ''}
                        </div>
                      ` : ''}
                      <button 
                        onclick="window.location.href='/provider/${provider.id}'"
                        style="
                          background: #F14836; 
                          color: white; 
                          border: none; 
                          padding: 8px 16px; 
                          border-radius: 8px; 
                          font-size: 14px; 
                          font-weight: 500;
                          cursor: pointer;
                          width: 100%;
                        "
                      >
                        View Profile
                      </button>
                    </div>
                  `
                  
                  infoWindow.setContent(content)
                  infoWindow.setPosition(this.position)
                  infoWindow.open(this.map)
                  
                  // Center map on marker
                  this.map.panTo(this.position)
                })
              }
              
              // Listen to map events to redraw marker position
              const listener = this.map.addListener('bounds_changed', () => {
                this.draw()
              })
              
              // Store listener for cleanup
              if (this.div) {
                (this.div as any).__listener = listener
              }
            }
            
            draw() {
              if (this.div) {
                const projection = this.getProjection()
                if (!projection) return
                
                const point = projection.fromLatLngToDivPixel(this.position)
                if (point) {
                  this.div.style.position = 'absolute'
                  this.div.style.left = point.x + 'px'
                  this.div.style.top = point.y + 'px'
                }
              }
            }
            
            onRemove() {
              if (this.div) {
                // Remove event listener
                const listener = (this.div as any).__listener
                if (listener) {
                  window.google?.maps?.event?.removeListener(listener)
                }
                
                // Remove from DOM
                if (this.div.parentNode) {
                  this.div.parentNode.removeChild(this.div)
                }
                this.div = undefined
              }
            }
          }
          
          const customMarker = new CustomMarker(new window.google.maps.LatLng(lat, lng), map)
          customMarker.setMap(map)
        })
        
        console.log(`Added ${filteredProviders.length} markers to map`)
      } catch (error) {
        console.error('Error creating map:', error)
      }
    }
  }, [viewMode, filteredProviders, userCoordinates, apiProviders])

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
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed rounded-xl !text-white"
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

        {/* View Toggle and Results */}
        <div className="container-custom py-6">
          {/* View Mode Toggle and Results Count */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-16 text-gray-700">
              <span className="font-semibold">{filteredProviders.length}</span> providers found
            </div>
            
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
                {filteredProviders.map((provider) => (
                  <WishlistProviderCard
                    key={provider.id}
                    provider={provider}
                    onViewProfile={() => handleProviderClick(provider.id)}
                  />
                ))}
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
                <div className="overflow-y-auto space-y-4 pr-2">
                  {filteredProviders.length > 0 ? (
                    filteredProviders.map((provider) => (
                      <div
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider)}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedProvider?.id === provider.id
                            ? 'ring-2 ring-brand-500 rounded-lg'
                            : ''
                        }`}
                      >
                        <WishlistProviderCard
                          provider={provider}
                          onViewProfile={() => handleProviderClick(provider.id)}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-16">
                      <p className="text-gray-500">No providers found</p>
                    </div>
                  )}
                </div>

                {/* Right: Google Map */}
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                  <div id="google-map" className="w-full h-full min-h-[500px] bg-gray-100"></div>
                  
                  {/* Selected Provider Info Overlay */}
                  {selectedProvider && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4">
                      <button
                        onClick={() => setSelectedProvider(null)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                      <div className="flex items-center gap-4">
                        <img
                          src={selectedProvider.publicLogoImageUrl || '/placeholder-provider.png'}
                          alt={selectedProvider.nameEn || 'Provider'}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-16 font-semibold text-gray-900">
                            {selectedProvider.nameEn || selectedProvider.nameAr}
                          </h3>
                          <p className="text-14 text-gray-600">
                            {selectedProvider.descriptionEn || selectedProvider.descriptionAr}
                          </p>
                          <Button
                            onClick={() => handleProviderClick(selectedProvider.id)}
                            className="mt-2 h-8 px-4 text-12 bg-brand-600 hover:bg-brand-700 !text-white"
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
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
