'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Navigation } from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/DatePicker'
import { Input } from '@/components/ui/Input'
import { StoreBadges } from '@/components/ui/StoreBadges'
import { cn } from '@/lib/utils'

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export default function ProvidersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

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

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsGettingLocation(true)
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Search */}
        <section className="relative bg-gradient-to-br from-brand-50 via-pink-50 to-purple-50 overflow-hidden">
          {/* Decorative Background Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200/30 rounded-full blur-3xl" />
            <div className="absolute top-60 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-pink-200/25 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative container-custom py-16 sm:py-20 md:py-24 lg:py-32">
            <div className="max-w-6xl mx-auto text-center">
              {/* Heading */}
              <h1 className="text-32 sm:text-40 md:text-48 lg:text-56 xl:text-64 font-semibold mb-4 sm:mb-6 leading-tight">
                <span className="text-gray-900">Book local </span>
                <span className="relative inline-block">
                  <span className="text-brand-600">wedding</span>
                  <span className="absolute -bottom-2 left-0 right-0 h-3 bg-brand-100/60 -z-10 rounded-full"></span>
                </span>
                <span className="text-gray-900"> services</span>
              </h1>

              {/* Subheading */}
              <p className="text-16 sm:text-18 md:text-20 text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
                Discover top-rated wedding providers, venues, and services trusted by couples worldwide
              </p>

              {/* Search Box */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 sm:p-3">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch">
                  {/* Treatment/Service Input */}
                  <div className="flex-1 min-w-0">
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
                  <div className="flex-1 min-w-0 relative">
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
                  <div className="flex-1 min-w-0">
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
                  <div className="flex-shrink-0">
                    <Button
                      onClick={handleSearch}
                      variant="default"
                      size="md"
                      className="h-12 px-8 sm:px-12 shadow-lg shadow-brand-600/25 !text-white"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Counter */}
              <div className="mt-8 sm:mt-10 md:mt-12">
                <div className="inline-flex items-center gap-2 text-14 sm:text-16 text-gray-600 font-medium">
                  <div className="flex items-center">
                    <span className="text-brand-600 font-semibold text-18 sm:text-20 tabular-nums">
                      12,345,678
                    </span>
                  </div>
                  <span>appointments booked today</span>
                </div>
              </div>

              {/* Download App Section */}
              <div className="mt-12 sm:mt-16 md:mt-20">
                <div className="flex flex-col items-center gap-6">
                  <h2 className="text-20 sm:text-24 md:text-28 font-normal text-gray-900">
                    Download OurBride App
                  </h2>
                  <StoreBadges size="lg" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
