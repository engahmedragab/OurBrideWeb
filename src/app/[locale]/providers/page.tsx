'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Search, MapPin, Calendar, Navigation } from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'
import { Input } from '@/components/ui/Input'
import { StoreBadges } from '@/components/ui/StoreBadges'
import { QRCode } from '@/components/ui/QRCode'
import { TestimonialsSection } from '@/components/ui/TestimonialsSection'
import { StatisticsSection } from '@/components/ui/StatisticsSection'
import { ForBusinessSection } from '@/components/ui/ForBusinessSection'
import { MobileAppsSection } from '@/components/ui/MobileAppsSection'
import { ProviderHomeSection } from '@/components/ui/ProviderHomeSection'
import { TreatmentCategorySelect } from '@/components/ui'
import { LoadingSpinner } from '@/components/ui'
import { useProviderHome } from '@/hooks/home'
import { usePreparations } from '@/hooks/preparations/usePreparations'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { TestimonialCardProps } from '@/components/ui/TestimonialCard'

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDAwJZexZRlbt9nAwu2Kr8wWaJnMdtblfE'

export default function ProvidersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [location, setLocation] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'any' | 'morning' | 'afternoon' | 'evening' | 'custom'>('any')
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Fetch provider home data
  const { data: providerHomeData, isLoading: isLoadingProviderHome } = useProviderHome()

  // Fetch preparations data
  const { data: preparationsData, isLoading: isLoadingPreparations } = usePreparations()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append('q', searchQuery)
    if (selectedCategory) params.append('category', selectedCategory)
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
              <p className="text-16 sm:text-18 md:text-20 text-gray-900 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
                Discover top-rated wedding providers, venues, and services trusted by couples worldwide
              </p>

              {/* Search Box */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 sm:p-3">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch">
                  {/* Preparations/Service Category Select */}
                  <TreatmentCategorySelect
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Preparations or venue"
                    preparations={preparationsData?.preparations || []}
                    isLoading={isLoadingPreparations}
                  />

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
                    <CustomDatePicker
                      value={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      selectedTimeSlot={selectedTimeSlot}
                      onTimeSlotChange={(slot) => setSelectedTimeSlot(slot)}
                      placeholder="Pick a date"
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
              {providerHomeData?.statistics?.appointmentsBookedToday && (
                <div className="mt-8 sm:mt-10 md:mt-12">
                  <div className="inline-flex items-center gap-2 text-14 sm:text-16 text-gray-900 font-medium">
                    <div className="flex items-center">
                      <span className="text-brand-600 font-semibold text-18 sm:text-20 tabular-nums">
                        {providerHomeData.statistics.appointmentsBookedToday}
                      </span>
                    </div>
                    <span>appointments booked today</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Provider Sections */}
        {isLoadingProviderHome ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Recently Viewed Providers */}
            {providerHomeData?.recentlyViewedProviders && providerHomeData.recentlyViewedProviders.length > 0 && (
              <ProviderHomeSection
                title="Recently viewed"
                providers={providerHomeData.recentlyViewedProviders}
              />
            )}

            {/* Recommended Providers */}
            {providerHomeData?.recommendedProviders && providerHomeData.recommendedProviders.length > 0 && (
              <ProviderHomeSection
                title="Recommended"
                providers={providerHomeData.recommendedProviders}
              />
            )}

            {/* Featured Providers */}
            {providerHomeData?.featuredProviders && providerHomeData.featuredProviders.length > 0 && (
              <ProviderHomeSection
                title="Featured"
                providers={providerHomeData.featuredProviders}
              />
            )}

            {/* Top Rated Providers */}
            {providerHomeData?.topRatedProviders && providerHomeData.topRatedProviders.length > 0 && (
              <ProviderHomeSection
                title="Top Rated"
                providers={providerHomeData.topRatedProviders}
              />
            )}

            {/* Popular Providers */}
            {providerHomeData?.popularProviders && providerHomeData.popularProviders.length > 0 && (
              <ProviderHomeSection
                title="Popular"
                providers={providerHomeData.popularProviders}
              />
            )}

            {/* Trending Providers */}
            {providerHomeData?.trendingProviders && providerHomeData.trendingProviders.length > 0 && (
              <ProviderHomeSection
                title="Trending"
                providers={providerHomeData.trendingProviders}
              />
            )}

            {/* New Providers */}
            {providerHomeData?.newProviders && providerHomeData.newProviders.length > 0 && (
              <ProviderHomeSection
                title="New"
                providers={providerHomeData.newProviders}
              />
            )}
          </>
        )}

        {/* Download App Section */}
        <section className="relative bg-gradient-to-br from-brand-50 via-pink-50 to-purple-50 overflow-hidden">
          <div className="container-custom py-16 sm:py-20 md:py-24 lg:py-32">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 p-8 md:p-12 lg:p-16">
                  {/* Left Column - Text and QR Code */}
                  <div className="flex flex-col justify-center">
                    {/* Available on */}
                    <div className="mb-4">
                      <p className="text-14 text-gray-900 mb-3">Available on</p>
                      <div className="flex items-center gap-3">
                        <StoreBadges size="md" />
                      </div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-32 sm:text-40 md:text-48 lg:text-56 font-bold text-gray-900 mb-4 leading-tight">
                      Download the OurBride app
                    </h2>

                    {/* Description */}
                    <p className="text-16 sm:text-18 md:text-20 text-gray-900 mb-8 leading-relaxed">
                      Book unforgettable beauty and wellness experiences with the OurBride mobile app.
                    </p>

                    {/* QR Code */}
                    <div className="flex justify-center md:justify-start">
                      <QRCode
                        value="https://ourbride.app/download"
                        size={180}
                        className="border-4 border-gray-100 rounded-xl p-2 bg-white"
                      />
                    </div>
                  </div>

                  {/* Right Column - Phone Mockups */}
                  <div className="relative flex items-center justify-center md:justify-end">
                    <div className="relative w-full max-w-md">
                      {/* Main Phone (Left) */}
                      <div className="relative z-10 transform rotate-[-8deg] hover:rotate-[-6deg] transition-transform duration-300">
                        <div className="relative w-[280px] h-[560px] mx-auto bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                          {/* Phone Screen */}
                          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                            {/* Phone Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20" />

                            {/* Screen Content - Provider Profile */}
                            <div className="w-full h-full pt-8">
                              {/* Header */}
                              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                                <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 bg-gray-300 rounded-full" />
                                  <div className="w-5 h-5 bg-gray-300 rounded-full" />
                                </div>
                              </div>

                              {/* Provider Image */}
                              <div className="relative w-full h-64 bg-gradient-to-br from-brand-100 to-purple-100">
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-10 px-2 py-1 rounded">
                                  1/6
                                </div>
                              </div>

                              {/* Provider Info */}
                              <div className="px-4 py-4">
                                <h3 className="text-20 font-bold text-gray-900 mb-2">Provider Name</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <div key={i} className="w-4 h-4 bg-yellow-400 rounded-sm" />
                                    ))}
                                  </div>
                                  <span className="text-14 text-gray-600">Reviews</span>
                                </div>
                                <p className="text-14 text-gray-600 mb-2">Location</p>
                                <p className="text-14 text-green-600 font-medium mb-4">Open now</p>

                                {/* Features */}
                                <div className="flex gap-4 mb-4">
                                  <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-yellow-400 rounded" />
                                    <span className="text-12 text-gray-600">Instant booking</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-blue-400 rounded" />
                                    <span className="text-12 text-gray-600">Pay by app</span>
                                  </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-4 border-b border-gray-200 mb-4">
                                  <div className="pb-2 border-b-2 border-black">
                                    <span className="text-14 font-medium">Services</span>
                                  </div>
                                  <span className="text-14 text-gray-500">Team</span>
                                  <span className="text-14 text-gray-500">Reviews</span>
                                </div>

                                {/* Services List */}
                                <div className="space-y-2">
                                  {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                      <div>
                                        <div className="w-24 h-3 bg-gray-300 rounded mb-1" />
                                        <div className="w-16 h-2 bg-gray-200 rounded" />
                                      </div>
                                      <div className="w-12 h-4 bg-gray-300 rounded" />
                                    </div>
                                  ))}
                                </div>

                                {/* Bottom Button */}
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-12 text-gray-500">Services available</span>
                                    <div className="bg-black text-white px-6 py-2 rounded-lg text-14 font-medium">
                                      Book now
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Secondary Phone (Right) */}
                      <div className="absolute top-1/2 -translate-y-1/2 right-0 z-0 transform rotate-[8deg] hover:rotate-[6deg] transition-transform duration-300 opacity-90">
                        <div className="relative w-[240px] h-[480px] bg-gray-900 rounded-[2.5rem] p-2.5 shadow-xl">
                          {/* Phone Screen */}
                          <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                            {/* Phone Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-xl z-20" />

                            {/* Screen Content - Search Results */}
                            <div className="w-full h-full pt-6">
                              {/* Search Bar */}
                              <div className="px-3 mb-3">
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                                  <div className="w-4 h-4 bg-gray-400 rounded" />
                                  <span className="text-12 text-gray-500">Hair</span>
                                  <div className="ml-auto w-4 h-4 bg-gray-400 rounded" />
                                </div>
                              </div>

                              {/* Filters */}
                              <div className="flex gap-2 px-3 mb-3">
                                {['Sort', 'Max price', 'Venue type'].map((filter) => (
                                  <div key={filter} className="px-3 py-1 bg-gray-100 rounded-lg">
                                    <span className="text-12 text-gray-600">{filter}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Results */}
                              <div className="px-3">
                                <p className="text-12 text-gray-600 mb-3">Venues nearby</p>

                                {/* Result Card */}
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-3">
                                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100" />
                                  <div className="p-3">
                                    <h4 className="text-14 font-bold text-gray-900 mb-1">Provider Name</h4>
                                    <div className="flex items-center gap-1 mb-1">
                                      <div className="flex gap-0.5">
                                        {[...Array(4)].map((_, i) => (
                                          <div key={i} className="w-3 h-3 bg-yellow-400 rounded-sm" />
                                        ))}
                                        <div className="w-3 h-3 bg-gray-300 rounded-sm" />
                                      </div>
                                      <span className="text-10 text-gray-500">(Reviews)</span>
                                    </div>
                                    <p className="text-12 text-gray-600 mb-2">Location</p>

                                    {/* Services */}
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-11">
                                        <span className="text-gray-700">Service name</span>
                                        <span className="font-medium">Price</span>
                                      </div>
                                      <div className="flex justify-between text-11">
                                        <span className="text-gray-700">Service name</span>
                                        <span className="font-medium">Price</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Bottom Nav */}
                              <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200">
                                <div className="flex items-center justify-around py-2">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-5 h-5 bg-gray-300 rounded" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Testimonials Section */}
        {isLoadingProviderHome ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : providerHomeData?.testimonials && providerHomeData.testimonials.length > 0 ? (
          <TestimonialsSection
            title="Reviews"
            testimonials={providerHomeData.testimonials.map((testimonial) => ({
              rating: testimonial.rating || 0,
              title: testimonial.nameEn || testimonial.nameAr || '',
              comment:
                testimonial.commentEn ||
                testimonial.commentAr ||
                testimonial.comment ||
                testimonial.descriptionEn ||
                testimonial.descriptionAr ||
                '',
              reviewerName: testimonial.customerNameEn || testimonial.customerNameAr || testimonial.customerName || '',
              reviewerLocation: testimonial.productEn || testimonial.productAr || testimonial.product || '',
              reviewerImage: testimonial.imageUrl || null,
            }))}
          />
        ) : null}

        {/* Statistics Section */}
        {!isLoadingProviderHome && providerHomeData?.statistics && (
          <StatisticsSection
            headline="The top-rated destination for wedding services"
            tagline="One solution, one software. Trusted by the best in the wedding industry"
            mainStatistic={{
              value: providerHomeData.statistics.totalAppointments,
              label: 'appointments booked on OurBride',
            }}
            statistics={[
              {
                value: providerHomeData.statistics.partnerBusinesses,
                label: 'partner businesses',
              },
              {
                value: providerHomeData.statistics.countries,
                label: 'using OurBride',
              },
              {
                value: providerHomeData.statistics.stylistsAndProfessionals,
                label: 'stylists and professionals',
              },
            ]}
          />
        )}

        {/* For Business Section */}
        <ForBusinessSection
          headline="OurBride for business"
          description="Supercharge your business with the world's top booking platform for wedding services. Independently voted no. 1 by industry professionals."
          buttonText="Find out more"
          buttonHref="/providers/register"
          rating={5}
          ratingLabel="Excellent 5/5"
          reviewCount="Over 1250 reviews"
          reviewSource="Capterra"
        />
      </main>

      <Footer />
    </div>
  )
}
