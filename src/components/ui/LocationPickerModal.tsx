'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { Modal } from './Modal'
import { cn } from '@/lib/utils'
import { useI18nTranslations } from '@/i18n'

export interface LocationData {
  displayName: string
  lat?: string
  lon?: string
  address?: {
    road?: string
    street?: string
    city?: string
    town?: string
    village?: string
    municipality?: string
    state?: string
    region?: string
    country?: string
    house_number?: string
    postcode?: string
  }
}

export interface LocationPickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (value: string | LocationData) => void
}

interface SearchLocation {
  display_name: string
  lat: string
  lon: string
  address?: {
    road?: string
    suburb?: string
    city?: string
    town?: string
    village?: string
    state?: string
    region?: string
    country?: string
  }
}

/**
 * LocationPickerModal - Modal for selecting location
 * Displays search input and location results
 */
export const LocationPickerModal = ({
  open,
  onClose,
  onSelect,
}: LocationPickerModalProps) => {
  const t  = useI18nTranslations("auth")
  const [searchQuery, setSearchQuery] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SearchLocation[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSelectLocation = (location: SearchLocation) => {
    // Pass structured location data
    const locationData: LocationData = {
      displayName: location.display_name,
      lat: location.lat,
      lon: location.lon,
      address: location.address,
    }
    onSelect(locationData)
    setLocationError(null)
    setSearchQuery('')
    onClose()
  }

  const handleClose = () => {
    setLocationError(null)
    setSearchQuery('')
    setSearchResults([])
    setSearchError(null)
    setIsGettingLocation(false)
    setIsSearching(false)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    onClose()
  }

  /**
   * Search for locations using Nominatim API
   */
  const searchLocations = async (query: string): Promise<SearchLocation[]> => {
    if (!query.trim()) {
      return []
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'OurBrideWeb/1.0', // Required by Nominatim
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to search locations')
      }

      const data: SearchLocation[] = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * Format location display name from search result
   */
  const formatLocationName = (location: SearchLocation): string => {
    return location.display_name
  }

  /**
   * Handle search query change with debouncing
   */
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Clear results if query is empty
    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearchError(null)
      setIsSearching(false)
      return
    }

    // Debounce search by 500ms
    setIsSearching(true)
    setSearchError(null)

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(searchQuery)
        setSearchResults(results)
        setSearchError(null)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : t('planningPreferences.errors.failedToSearchLocations')
        setSearchError(errorMessage)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 500)

    // Cleanup timeout on unmount or query change
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  /**
   * Reverse geocode coordinates to get address
   */
  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Using OpenStreetMap Nominatim (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'OurBrideWeb/1.0', // Required by Nominatim
          },
        }
      )

      if (!response.ok) {
        throw new Error(t('planningPreferences.errors.failedToGetAddress'))
      }

      const data = await response.json()

      // Format address from response
      if (data.address) {
        const address = data.address
        const parts: string[] = []

        // Build address string from most specific to least specific
        if (address.road) parts.push(address.road)
        if (address.suburb || address.neighbourhood) parts.push(address.suburb || address.neighbourhood)
        if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village)
        if (address.state || address.region) parts.push(address.state || address.region)
        if (address.country) parts.push(address.country)

        return parts.length > 0 ? parts.join(', ') : data.display_name || `${latitude}, ${longitude}`
      }

      return data.display_name || `${latitude}, ${longitude}`
    } catch (error) {
      // Fallback to coordinates if reverse geocoding fails
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    }
  }

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError(t('planningPreferences.errors.geolocationNotSupported'))
      return
    }

    setIsGettingLocation(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Reverse geocode to get readable address
          const addressString = await reverseGeocode(latitude, longitude)

          // Also get structured address data
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'OurBrideWeb/1.0',
              },
            }
          )

          let locationData: string | LocationData = addressString
          if (response.ok) {
            const data = await response.json()
            locationData = {
              displayName: addressString,
              lat: latitude.toString(),
              lon: longitude.toString(),
              address: data.address || {},
            }
          }

          // Select the location
          onSelect(locationData)
          onClose()
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : t('planningPreferences.errors.failedToGetAddress')
          setLocationError(errorMessage)
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        let errorMessage = t('planningPreferences.errors.failedToGetAddress')

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('planningPreferences.errors.locationAccessDenied')
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('planningPreferences.errors.locationInformationUnavailable')
            break
          case error.TIMEOUT:
            errorMessage = t('planningPreferences.errors.locationRequestTimedOut')
            break
          default:
            errorMessage = t('planningPreferences.errors.errorOccurredWhileGettingLocation')
            break
        }

        setLocationError(errorMessage)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={t('planningPreferences.setLocation')}
      maxWidth="sm"
      containerClassName="max-w-[400px]"
      contentClassName="p-4 sm:p-6"
    >
      <div className="space-y-6 ">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('planningPreferences.searchForLocation')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 px-4 pr-10 rounded-lg border border-gray-200 text-14 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-brand-500 transition-colors"
          />
          {isSearching ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 pointer-events-none" />
          )}
        </div>

        {/* Use Current Location */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isGettingLocation}
            className={cn(
              "flex items-center gap-2 text-brand-500 hover:text-brand-600 transition-colors w-full",
              isGettingLocation && "opacity-50 cursor-not-allowed"
            )}
          >
            {isGettingLocation ? (
              <Loader2 className="h-5 w-5 text-brand-500 animate-spin" />
            ) : (
              <MapPin className="h-5 w-5 text-brand-500" />
            )}
            <span className="text-14 font-medium">
              {isGettingLocation ? t('planningPreferences.gettingYourLocation') : t('planningPreferences.useMyCurrentLocation')}
            </span>
          </button>

          {/* Location Error */}
          {locationError && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-12 text-red-600">{locationError}</p>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <div className="space-y-4">
            <h3 className="text-14 font-semibold text-gray-900">
              {t('planningPreferences.searchResults')}
            </h3>

            {/* Search Error */}
            {searchError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-12 text-red-600">{searchError}</p>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              </div>
            )}

            {/* Search Results */}
            {!isSearching && !searchError && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((location, index) => {
                    const locationName = formatLocationName(location)
                    return (
                      <button
                        key={`${location.lat}-${location.lon}-${index}`}
                        type="button"
                        onClick={() => handleSelectLocation(location)}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <p className="text-14 font-medium text-gray-900">
                          {locationName}
                        </p>
                      </button>
                    )
                  })
                ) : (
                  <p className="text-14 text-gray-500 text-center py-4">
                    {t('planningPreferences.noLocationsFound')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty State - Show when no search query */}
        {!searchQuery.trim() && !isGettingLocation && (
          <div className="text-center py-8">
            <p className="text-14 text-gray-500">
              {t('planningPreferences.searchForLocationOrUseYourCurrentLocation')}
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}
