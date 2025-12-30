'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Calendar, Map, List, X, Navigation } from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/DatePicker'
import { Input } from '@/components/ui/Input'
import { WishlistProviderCard, EmptyState } from '@/components/ui'
import type { FeaturedProviderResponse } from '@/types/responses'
import { cn } from '@/lib/utils'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

// Google Maps API Key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBxNWOYMYWLFE__dL87xc7yhfIVgRTgPjA'

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google?: {
      maps: {
        Map: new (element: HTMLElement, options?: unknown) => unknown
        Marker: new (options?: unknown) => unknown
        LatLng: new (lat: number, lng: number) => unknown
      }
    }
  }
}

// Static mock providers data
const MOCK_PROVIDERS: FeaturedProviderResponse[] = [
  {
    id: 1,
    nameEn: 'Elegant Wedding Hall',
    nameAr: 'قاعة الأفراح الأنيقة',
    descriptionEn: 'Premium wedding venue with elegant decor',
    descriptionAr: 'قاعة أفراح راقية بتصميم أنيق',
    publicLogoImageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
    publicBannerImageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    rate: 4.8,
    totalReviews: 125,
    isVerified: true,
    totalServices: 15,
    totalProducts: 8,
    shortAddress: 'Riyadh, Al Olaya',
    publicProfileSlug: '/provider/1',
    uniqueCode: 'PROV-1',
    topRatedService: null,
  },
  {
    id: 2,
    nameEn: 'Royal Photography Studio',
    nameAr: 'استوديو التصوير الملكي',
    descriptionEn: 'Professional wedding photography services',
    descriptionAr: 'خدمات تصوير أفراح احترافية',
    publicLogoImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    publicBannerImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    rate: 4.9,
    totalReviews: 89,
    isVerified: true,
    totalServices: 12,
    totalProducts: 5,
    shortAddress: 'Jeddah, Al Hamra',
    publicProfileSlug: '/provider/2',
    uniqueCode: 'PROV-2',
    topRatedService: null,
  },
  {
    id: 3,
    nameEn: 'Bridal Beauty Salon',
    nameAr: 'صالون العروس للجمال',
    descriptionEn: 'Complete bridal makeup and styling',
    descriptionAr: 'مكياج وتصفيف كامل للعروس',
    publicLogoImageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    publicBannerImageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    rate: 4.7,
    totalReviews: 203,
    isVerified: true,
    totalServices: 20,
    totalProducts: 12,
    shortAddress: 'Riyadh, Al Malaz',
    publicProfileSlug: '/provider/3',
    uniqueCode: 'PROV-3',
    topRatedService: null,
  },
  {
    id: 4,
    nameEn: 'Gourmet Catering Services',
    nameAr: 'خدمات التموين الفاخرة',
    descriptionEn: 'Fine dining catering for special occasions',
    descriptionAr: 'تموين فاخر للمناسبات الخاصة',
    publicLogoImageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
    publicBannerImageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    rate: 4.6,
    totalReviews: 156,
    isVerified: true,
    totalServices: 18,
    totalProducts: 0,
    shortAddress: 'Dammam, Al Khobar',
    publicProfileSlug: '/provider/4',
    uniqueCode: 'PROV-4',
    topRatedService: null,
  },
  {
    id: 5,
    nameEn: 'Floral Design Studio',
    nameAr: 'استوديو التصميم الزهري',
    descriptionEn: 'Beautiful flower arrangements and decorations',
    descriptionAr: 'ترتيبات زهور وتزيينات جميلة',
    publicLogoImageUrl: 'https://images.unsplash.com/photo-1563241527-3004b6e53e88?w=400',
    publicBannerImageUrl: 'https://images.unsplash.com/photo-1563241527-3004b6e53e88?w=800',
    rate: 4.5,
    totalReviews: 94,
    isVerified: false,
    totalServices: 10,
    totalProducts: 3,
    shortAddress: 'Riyadh, Al Nakheel',
    publicProfileSlug: '/provider/5',
    uniqueCode: 'PROV-5',
    topRatedService: null,
  },
]

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

  // Filter providers
  const filteredProviders = useMemo(() => {
    let filtered = MOCK_PROVIDERS

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(provider => {
        const nameEn = provider.nameEn?.toLowerCase() || ''
        const nameAr = provider.nameAr?.toLowerCase() || ''
        const descriptionEn = provider.descriptionEn?.toLowerCase() || ''
        const descriptionAr = provider.descriptionAr?.toLowerCase() || ''

        return (
          nameEn.includes(query) ||
          nameAr.includes(query) ||
          descriptionEn.includes(query) ||
          descriptionAr.includes(query)
        )
      })
    }

    if (location.trim() && viewMode !== 'map') {
      const loc = location.toLowerCase()
      filtered = filtered.filter(provider => {
        const address = provider.shortAddress?.toLowerCase() || ''
        return address.includes(loc)
      })
    }

    return filtered
  }, [searchQuery, location, viewMode])

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
        : { lat: 24.7136, lng: 46.6753 } // Riyadh, Saudi Arabia as default

      try {
        if (!window.google?.maps?.Map) return
        
        const map = new window.google.maps.Map(mapElement, {
          center: defaultCenter,
          zoom: userCoordinates ? 12 : 10,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
        })
        console.log('Map created successfully:', map)
      } catch (error) {
        console.error('Error creating map:', error)
      }
    }
  }, [viewMode, filteredProviders, userCoordinates])

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
          {viewMode === 'list' ? (
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
                  {filteredProviders.map((provider) => (
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
                  ))}
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
