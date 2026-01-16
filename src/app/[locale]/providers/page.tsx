'use client'

import { useState, useRef } from 'react'
import { useRouter } from '@/i18n/navigation'
import { MapPin, Navigation, Search, ChevronRight, Building2, Globe, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { SwiperRef } from 'swiper/react'
import { Navigation as SwiperNavigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Image from 'next/image'
import { Header, Footer } from '@/components/layout'
import {
  Button,
  Typography,
  CardWrapper,
  CustomDatePicker,
  Input,
  ProviderCard,
  PageHeader,
  EmptyState,
  ProviderCardSkeleton,
  Badge,
  TreatmentCategorySelect,
  StoreBadges,
  QRCode,
  TestimonialCard,
  RatingDisplay,
} from '@/components/ui'
import { useProviderHome } from '@/hooks/home'
import { usePreparations } from '@/hooks/preparations/usePreparations'
import { cn } from '@/lib/utils'
import orderEmptySvg from '@/assets/svg/order-empty.svg'
import brandLogo from '@/assets/svg/Brand-logo.svg'

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
  
  // Swiper refs for each section
  const featuredRef = useRef<SwiperRef | null>(null)
  const topRatedRef = useRef<SwiperRef | null>(null)
  const recommendedRef = useRef<SwiperRef | null>(null)
  const popularRef = useRef<SwiperRef | null>(null)
  const trendingRef = useRef<SwiperRef | null>(null)
  const newProvidersRef = useRef<SwiperRef | null>(null)
  const recentlyViewedRef = useRef<SwiperRef | null>(null)
  const reviewsRef = useRef<SwiperRef | null>(null)

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

  // Combine all providers from different sections
  const allProviders = [
    ...(providerHomeData?.recentlyViewedProviders || []),
    ...(providerHomeData?.recommendedProviders || []),
    ...(providerHomeData?.featuredProviders || []),
    ...(providerHomeData?.topRatedProviders || []),
    ...(providerHomeData?.popularProviders || []),
    ...(providerHomeData?.trendingProviders || []),
    ...(providerHomeData?.newProviders || []),
  ]

  // Remove duplicates by ID
  const uniqueProviders = Array.from(
    new Map(allProviders.map(provider => [provider.id, provider])).values()
  )

  const hasProviders = uniqueProviders.length > 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container-custom py-6 md:py-8">
          {/* Page Header */}
          <PageHeader
            title="Wedding Providers"
            subtitle={`${uniqueProviders.length} providers available`}
            className="mb-6"
          />

          {/* Search and Filters Section */}
          <CardWrapper className="mb-8" padding="md">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search providers, services, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    prefixIcon={Search}
                    variant="fill"
                    size="lg"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  variant="default"
                  size="md"
                  className="sm:w-auto w-full"
                >
                  Search
                </Button>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category Select */}
                <div className="flex-1">
                  <TreatmentCategorySelect
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="All categories"
                    preparations={preparationsData?.preparations || []}
                    isLoading={isLoadingPreparations}
                  />
                </div>

                {/* Location Input */}
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => setIsLocationPopoverOpen(true)}
                    prefixIcon={MapPin}
                    variant="fill"
                    size="lg"
                  />
                  {isLocationPopoverOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsLocationPopoverOpen(false)}
                      />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
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
                            <Typography variant="bodySmall" className="font-medium text-gray-900">
                              {isGettingLocation ? 'Getting your location...' : 'Use current location'}
                            </Typography>
                            <Typography variant="bodyTiny" textColor="secondary">
                              {isGettingLocation ? 'Please wait' : 'Automatically detect your location'}
                            </Typography>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Date Picker */}
                <div className="flex-1">
                  <CustomDatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    selectedTimeSlot={selectedTimeSlot}
                    onTimeSlotChange={(slot) => setSelectedTimeSlot(slot)}
                    placeholder="Select date"
                  />
                </div>
              </div>
            </div>
          </CardWrapper>

          {/* Loading State */}
          {isLoadingProviderHome && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <ProviderCardSkeleton count={8} />
            </div>
          )}

          {/* Empty State */}
          {!isLoadingProviderHome && !hasProviders && (
            <EmptyState
              illustration={orderEmptySvg}
              title="No providers found"
              description="Try adjusting your search or filters to find more providers."
              actionLabel="Clear filters"
              onAction={() => {
                setSearchQuery('')
                setSelectedCategory('')
                setLocation('')
                setSelectedDate(undefined)
              }}
            />
          )}

          {/* Providers Sliders */}
          {!isLoadingProviderHome && hasProviders && (
            <div className="space-y-12">
              {/* Featured Providers */}
              {providerHomeData?.featuredProviders && providerHomeData.featuredProviders.length > 0 && (
                <section className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-24 font-normal">
                      Featured Providers
                    </Typography>
                    <Badge variant="secondary" size="md">
                      {providerHomeData.featuredProviders.length}
                    </Badge>
                  </div>
                  <div className="relative px-12">
                    <Swiper
                      ref={featuredRef}
                      modules={[SwiperNavigation]}
                      spaceBetween={24}
                      slidesPerView={1}
                      loop={providerHomeData.featuredProviders.length > 4}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                        },
                        1280: {
                          slidesPerView: 4,
                          spaceBetween: 24,
                        },
                      }}
                      navigation={{
                        nextEl: '.swiper-button-next-featured',
                        prevEl: '.swiper-button-prev-featured',
                      }}
                      className="!pb-12"
                    >
                      {providerHomeData.featuredProviders.map((provider) => (
                        <SwiperSlide key={provider.id}>
                          <ProviderCard
                            provider={{
                              id: provider.id.toString(),
                              name: provider.nameEn || provider.nameAr || 'Provider',
                              image: provider.publicBannerImageUrl || provider.publicLogoImageUrl,
                              verified: provider.isVerified,
                              rating: provider.rate,
                              profession: provider.topRatedService?.name,
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  {providerHomeData.featuredProviders.length > 4 && (
                    <>
                      <button
                        className="swiper-button-prev-featured absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Previous providers"
                        onClick={() => featuredRef.current?.swiper?.slidePrev()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
                      </button>
                      <button
                        className="swiper-button-next-featured absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Next providers"
                        onClick={() => featuredRef.current?.swiper?.slideNext()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </section>
              )}

              {/* Top Rated Providers */}
              {providerHomeData?.topRatedProviders && providerHomeData.topRatedProviders.length > 0 && (
                <section className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-24 font-normal">
                      Top Rated
                    </Typography>
                    <Badge variant="secondary" size="md">
                      {providerHomeData.topRatedProviders.length}
                    </Badge>
                  </div>
                  <div className="relative px-12">
                    <Swiper
                      ref={topRatedRef}
                      modules={[SwiperNavigation]}
                      spaceBetween={24}
                      slidesPerView={1}
                      loop={providerHomeData.topRatedProviders.length > 4}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                        },
                        1280: {
                          slidesPerView: 4,
                          spaceBetween: 24,
                        },
                      }}
                      navigation={{
                        nextEl: '.swiper-button-next-top-rated',
                        prevEl: '.swiper-button-prev-top-rated',
                      }}
                      className="!pb-12"
                    >
                      {providerHomeData.topRatedProviders.map((provider) => (
                        <SwiperSlide key={provider.id}>
                          <ProviderCard
                            provider={{
                              id: provider.id.toString(),
                              name: provider.nameEn || provider.nameAr || 'Provider',
                              image: provider.publicBannerImageUrl || provider.publicLogoImageUrl,
                              verified: provider.isVerified,
                              rating: provider.rate,
                              profession: provider.topRatedService?.name,
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  {providerHomeData.topRatedProviders.length > 4 && (
                    <>
                      <button
                        className="swiper-button-prev-top-rated absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Previous providers"
                        onClick={() => topRatedRef.current?.swiper?.slidePrev()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
                      </button>
                      <button
                        className="swiper-button-next-top-rated absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Next providers"
                        onClick={() => topRatedRef.current?.swiper?.slideNext()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </section>
              )}

              {/* Recommended Providers */}
              {providerHomeData?.recommendedProviders && providerHomeData.recommendedProviders.length > 0 && (
                <section className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-24 font-normal">
                      Recommended for You
                    </Typography>
                    <Badge variant="secondary" size="md">
                      {providerHomeData.recommendedProviders.length}
                    </Badge>
                  </div>
                  <div className="relative px-12">
                    <Swiper
                      ref={recommendedRef}
                      modules={[SwiperNavigation]}
                      spaceBetween={24}
                      slidesPerView={1}
                      loop={providerHomeData.recommendedProviders.length > 4}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                        },
                        1280: {
                          slidesPerView: 4,
                          spaceBetween: 24,
                        },
                      }}
                      navigation={{
                        nextEl: '.swiper-button-next-recommended',
                        prevEl: '.swiper-button-prev-recommended',
                      }}
                      className="!pb-12"
                    >
                      {providerHomeData.recommendedProviders.map((provider) => (
                        <SwiperSlide key={provider.id}>
                          <ProviderCard
                            provider={{
                              id: provider.id.toString(),
                              name: provider.nameEn || provider.nameAr || 'Provider',
                              image: provider.publicBannerImageUrl || provider.publicLogoImageUrl,
                              verified: provider.isVerified,
                              rating: provider.rate,
                              profession: provider.topRatedService?.name,
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  {providerHomeData.recommendedProviders.length > 4 && (
                    <>
                      <button
                        className="swiper-button-prev-recommended absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Previous providers"
                        onClick={() => recommendedRef.current?.swiper?.slidePrev()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
                      </button>
                      <button
                        className="swiper-button-next-recommended absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Next providers"
                        onClick={() => recommendedRef.current?.swiper?.slideNext()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </section>
              )}

              {/* Popular Providers */}
              {providerHomeData?.popularProviders && providerHomeData.popularProviders.length > 0 && (
                <section className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-24 font-normal">
                      Popular Providers
                    </Typography>
                    <Badge variant="secondary" size="md">
                      {providerHomeData.popularProviders.length}
                    </Badge>
                  </div>
                  <div className="relative px-12">
                    <Swiper
                      ref={popularRef}
                      modules={[SwiperNavigation]}
                      spaceBetween={24}
                      slidesPerView={1}
                      loop={providerHomeData.popularProviders.length > 4}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                        },
                        1280: {
                          slidesPerView: 4,
                          spaceBetween: 24,
                        },
                      }}
                      navigation={{
                        nextEl: '.swiper-button-next-popular',
                        prevEl: '.swiper-button-prev-popular',
                      }}
                      className="!pb-12"
                    >
                      {providerHomeData.popularProviders.map((provider) => (
                        <SwiperSlide key={provider.id}>
                          <ProviderCard
                            provider={{
                              id: provider.id.toString(),
                              name: provider.nameEn || provider.nameAr || 'Provider',
                              image: provider.publicBannerImageUrl || provider.publicLogoImageUrl,
                              verified: provider.isVerified,
                              rating: provider.rate,
                              profession: provider.topRatedService?.name,
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  {providerHomeData.popularProviders.length > 4 && (
                    <>
                      <button
                        className="swiper-button-prev-popular absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Previous providers"
                        onClick={() => popularRef.current?.swiper?.slidePrev()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
                      </button>
                      <button
                        className="swiper-button-next-popular absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Next providers"
                        onClick={() => popularRef.current?.swiper?.slideNext()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </section>
              )}

              {/* Trending Providers */}
              {providerHomeData?.trendingProviders && providerHomeData.trendingProviders.length > 0 && (
                <section className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-24 font-normal">
                      Trending Now
                    </Typography>
                    <Badge variant="secondary" size="md">
                      {providerHomeData.trendingProviders.length}
                    </Badge>
                  </div>
                  <div className="relative px-12">
                    <Swiper
                      ref={trendingRef}
                      modules={[SwiperNavigation]}
                      spaceBetween={24}
                      slidesPerView={1}
                      loop={providerHomeData.trendingProviders.length > 4}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                        },
                        1280: {
                          slidesPerView: 4,
                          spaceBetween: 24,
                        },
                      }}
                      navigation={{
                        nextEl: '.swiper-button-next-trending',
                        prevEl: '.swiper-button-prev-trending',
                      }}
                      className="!pb-12"
                    >
                      {providerHomeData.trendingProviders.map((provider) => (
                        <SwiperSlide key={provider.id}>
                          <ProviderCard
                            provider={{
                              id: provider.id.toString(),
                              name: provider.nameEn || provider.nameAr || 'Provider',
                              image: provider.publicBannerImageUrl || provider.publicLogoImageUrl,
                              verified: provider.isVerified,
                              rating: provider.rate,
                              profession: provider.topRatedService?.name,
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  {providerHomeData.trendingProviders.length > 4 && (
                    <>
                      <button
                        className="swiper-button-prev-trending absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Previous providers"
                        onClick={() => trendingRef.current?.swiper?.slidePrev()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
                      </button>
                      <button
                        className="swiper-button-next-trending absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Next providers"
                        onClick={() => trendingRef.current?.swiper?.slideNext()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </section>
              )}

              {/* New Providers */}
              {providerHomeData?.newProviders && providerHomeData.newProviders.length > 0 && (
                <section className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-24 font-normal">
                      New Providers
                    </Typography>
                    <Badge variant="secondary" size="md">
                      {providerHomeData.newProviders.length}
                    </Badge>
                  </div>
                  <div className="relative px-12">
                    <Swiper
                      ref={newProvidersRef}
                      modules={[SwiperNavigation]}
                      spaceBetween={24}
                      slidesPerView={1}
                      loop={providerHomeData.newProviders.length > 4}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                        },
                        1280: {
                          slidesPerView: 4,
                          spaceBetween: 24,
                        },
                      }}
                      navigation={{
                        nextEl: '.swiper-button-next-new',
                        prevEl: '.swiper-button-prev-new',
                      }}
                      className="!pb-12"
                    >
                      {providerHomeData.newProviders.map((provider) => (
                        <SwiperSlide key={provider.id}>
                          <ProviderCard
                            provider={{
                              id: provider.id.toString(),
                              name: provider.nameEn || provider.nameAr || 'Provider',
                              image: provider.publicBannerImageUrl || provider.publicLogoImageUrl,
                              verified: provider.isVerified,
                              rating: provider.rate,
                              profession: provider.topRatedService?.name,
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  {providerHomeData.newProviders.length > 4 && (
                    <>
                      <button
                        className="swiper-button-prev-new absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Previous providers"
                        onClick={() => newProvidersRef.current?.swiper?.slidePrev()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
                      </button>
                      <button
                        className="swiper-button-next-new absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Next providers"
                        onClick={() => newProvidersRef.current?.swiper?.slideNext()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </section>
              )}

              {/* Recently Viewed Providers */}
              {providerHomeData?.recentlyViewedProviders && providerHomeData.recentlyViewedProviders.length > 0 && (
                <section className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-24 font-normal">
                      Recently Viewed
                    </Typography>
                    <Badge variant="secondary" size="md">
                      {providerHomeData.recentlyViewedProviders.length}
                    </Badge>
                  </div>
                  <div className="relative px-12">
                    <Swiper
                      ref={recentlyViewedRef}
                      modules={[SwiperNavigation]}
                      spaceBetween={24}
                      slidesPerView={1}
                      loop={providerHomeData.recentlyViewedProviders.length > 4}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                        },
                        1280: {
                          slidesPerView: 4,
                          spaceBetween: 24,
                        },
                      }}
                      navigation={{
                        nextEl: '.swiper-button-next-recently',
                        prevEl: '.swiper-button-prev-recently',
                      }}
                      className="!pb-12"
                    >
                      {providerHomeData.recentlyViewedProviders.map((provider) => (
                        <SwiperSlide key={provider.id}>
                          <ProviderCard
                            provider={{
                              id: provider.id.toString(),
                              name: provider.nameEn || provider.nameAr || 'Provider',
                              image: provider.publicBannerImageUrl || provider.publicLogoImageUrl,
                              verified: provider.isVerified,
                              rating: provider.rate,
                              profession: provider.topRatedService?.name,
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  {providerHomeData.recentlyViewedProviders.length > 4 && (
                    <>
                      <button
                        className="swiper-button-prev-recently absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Previous providers"
                        onClick={() => recentlyViewedRef.current?.swiper?.slidePrev()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
                      </button>
                      <button
                        className="swiper-button-next-recently absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Next providers"
                        onClick={() => recentlyViewedRef.current?.swiper?.slideNext()}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </section>
              )}
            </div>
          )}

          {/* Reviews Section */}
          {!isLoadingProviderHome && providerHomeData?.testimonials && providerHomeData.testimonials.length > 0 && (
            <section className="relative py-12">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h3" className="text-24 font-normal">
                  Reviews
                </Typography>
                <Badge variant="secondary" size="md">
                  {providerHomeData.testimonials.length}
                </Badge>
              </div>
              <div className="relative px-12">
                <Swiper
                  ref={reviewsRef}
                  modules={[SwiperNavigation]}
                  spaceBetween={24}
                  slidesPerView={1}
                  loop={providerHomeData.testimonials.length > 3}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 24,
                    },
                  }}
                  navigation={{
                    nextEl: '.swiper-button-next-reviews',
                    prevEl: '.swiper-button-prev-reviews',
                  }}
                  className="!pb-12"
                >
                  {providerHomeData.testimonials.map((testimonial, index) => (
                    <SwiperSlide key={`testimonial-${index}`}>
                      <TestimonialCard
                        rating={testimonial.rating || 0}
                        title={testimonial.nameEn || testimonial.nameAr || ''}
                        comment={
                          testimonial.commentEn ||
                          testimonial.commentAr ||
                          testimonial.comment ||
                          testimonial.descriptionEn ||
                          testimonial.descriptionAr ||
                          ''
                        }
                        reviewerName={
                          testimonial.customerNameEn ||
                          testimonial.customerNameAr ||
                          testimonial.customerName ||
                          'Anonymous'
                        }
                        reviewerLocation={
                          testimonial.productEn ||
                          testimonial.productAr ||
                          testimonial.product ||
                          ''
                        }
                        reviewerImage={testimonial.imageUrl || null}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              {providerHomeData.testimonials.length > 3 && (
                <>
                  <button
                    className="swiper-button-prev-reviews absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label="Previous reviews"
                    onClick={() => reviewsRef.current?.swiper?.slidePrev()}
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
                  </button>
                  <button
                    className="swiper-button-next-reviews absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label="Next reviews"
                    onClick={() => reviewsRef.current?.swiper?.slideNext()}
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}
            </section>
          )}

          {/* Statistics Section - The top-rated destination */}
          {!isLoadingProviderHome && providerHomeData?.statistics && (
            <section className="py-16 md:py-24 bg-background relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-100/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>

              <div className="container-custom relative z-10">
                <div className="max-w-5xl mx-auto">
                  {/* Section Header */}
                  <div className="text-center mb-12 md:mb-16 animate-fade-in">
                    <Typography
                      variant="h2"
                      className="text-32 sm:text-40 md:text-48 lg:text-56 font-normal text-gray-900 mb-4 leading-tight"
                    >
                      The top-rated destination for wedding services
                    </Typography>
                    <Typography
                      variant="bodyLarge"
                      className="text-16 sm:text-18 md:text-20 text-gray-700 max-w-2xl leading-relaxed"
                    >
                      One solution, one software. Trusted by the best in the wedding industry
                    </Typography>
                  </div>

                  {/* Main Statistic Card */}
                  <CardWrapper 
                    className="mb-12 md:mb-16 text-center hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-slide-in" 
                    padding="lg"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-64 sm:text-80 md:text-96 lg:text-[120px] xl:text-[140px] font-normal text-brand-600 mb-4 tabular-nums">
                        {providerHomeData.statistics.totalAppointments?.toLocaleString() || '0'}
                      </div>
                      <Typography variant="bodyLarge" className="text-gray-700">
                        appointments booked on OurBride
                      </Typography>
                    </div>
                  </CardWrapper>

                  {/* Supporting Statistics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                    {[
                      {
                        value: providerHomeData.statistics.partnerBusinesses?.toLocaleString() || '0',
                        label: 'partner businesses',
                        icon: Building2,
                        color: 'text-blue-600',
                        iconColor: 'text-blue-600',
                      },
                      {
                        value: providerHomeData.statistics.countries?.toLocaleString() || '0',
                        label: 'using OurBride',
                        icon: Globe,
                        color: 'text-green-600',
                        iconColor: 'text-green-600',
                      },
                      {
                        value: providerHomeData.statistics.stylistsAndProfessionals?.toLocaleString() || '0',
                        label: 'stylists and professionals',
                        icon: Sparkles,
                        color: 'text-purple-600',
                        iconColor: 'text-purple-600',
                      },
                    ].map((stat, index) => {
                      const IconComponent = stat.icon
                      return (
                        <div
                          key={index}
                          className={cn(
                            "animate-slide-in"
                          )}
                          style={{ animationDelay: `${index * 0.15}s` }}
                        >
                          <CardWrapper 
                            className="text-center hover:shadow-lg transition-all duration-500 hover:-translate-y-2 group"
                            padding="md"
                          >
                            <div className="flex flex-col items-center">
                              <div 
                                className={cn(
                                  "mb-3 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12",
                                  stat.iconColor
                                )}
                              >
                                <IconComponent className="w-12 h-12 md:w-16 md:h-16" />
                              </div>
                              <div className={cn(
                                "text-32 sm:text-40 md:text-48 font-normal mb-2 tabular-nums transition-colors duration-300",
                                stat.color
                              )}>
                                {stat.value}
                              </div>
                              <Typography variant="body" className="text-gray-700">
                                {stat.label}
                              </Typography>
                            </div>
                          </CardWrapper>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* App Download Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column - Content */}
              <div className="flex flex-col">
            {/* Section Label */}
            <Typography variant="bodySmall" className="text-brand-600 mb-4 font-medium">
              Mobile App
            </Typography>

            {/* Heading */}
            <Typography
              variant="h2"
              className="text-32 sm:text-40 md:text-48 font-normal text-gray-900 mb-6 leading-tight"
            >
              Download the OurBride app
            </Typography>

            {/* Description */}
            <Typography
              variant="bodyLarge"
              className="text-16 sm:text-18 text-gray-700 mb-8 leading-relaxed"
            >
              Book unforgettable beauty and wellness experiences with the OurBride mobile app. Discover top-rated wedding providers, venues, and services trusted by couples worldwide.
            </Typography>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                'Browse verified providers',
                'Instant booking',
                'Exclusive deals',
                'Manage bookings',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-brand-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <Typography variant="body" className="text-gray-700">
                    {feature}
                  </Typography>
                </div>
              ))}
            </div>

            {/* Store Badges */}
            <div className="mb-8">
              <StoreBadges size="lg" className="gap-3" />
            </div>

            {/* QR Code Section */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-shrink-0">
                <QRCode
                  value="https://ourbride.app/download"
                  size={120}
                  className="bg-white p-3 rounded-lg shadow-sm"
                />
              </div>
              <div className="flex-1">
                <Typography variant="bodySmall" className="text-gray-900 font-medium mb-1">
                  Scan to download
                </Typography>
                <Typography variant="bodyTiny" textColor="secondary" className="leading-relaxed">
                  Point your camera at the QR code to get the app
                </Typography>
              </div>
            </div>
          </div>

          {/* Right Column - Phone Mockup */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              {/* Phone Frame */}
              <div className="relative w-[280px] h-[580px] mx-auto lg:mx-0 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 rounded-b-xl z-20" />

                  {/* Screen Content */}
                  <div className="w-full h-full pt-6 bg-white">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-4 py-2 mb-2">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      </div>
                      <div className="text-10 font-medium text-gray-900">9:41</div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 border border-gray-400 rounded-sm">
                          <div className="w-3 h-full bg-gray-400 rounded-sm" />
                        </div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="px-4 mb-4">
                      <div className="h-8 bg-gray-200 rounded-lg mb-2" />
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                    </div>

                    {/* App Content Cards */}
                    <div className="px-4 space-y-3">
                      <CardWrapper padding="sm" className="border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-brand-500 rounded-lg flex-shrink-0" />
                          <div className="flex-1">
                            <div className="h-3 bg-gray-300 rounded w-20 mb-1.5" />
                            <div className="h-2 bg-gray-200 rounded w-16" />
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded w-full mb-1" />
                        <div className="h-2 bg-gray-200 rounded w-4/5" />
                      </CardWrapper>

                      <CardWrapper padding="sm" className="border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex-shrink-0" />
                          <div className="flex-1">
                            <div className="h-3 bg-gray-300 rounded w-24 mb-1.5" />
                            <div className="h-2 bg-gray-200 rounded w-20" />
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded w-full mb-1" />
                        <div className="h-2 bg-gray-200 rounded w-3/4" />
                      </CardWrapper>

                      <CardWrapper padding="sm" className="border-gray-200">
                        <div className="h-2 bg-gray-200 rounded w-full mb-1.5" />
                        <div className="h-2 bg-gray-200 rounded w-5/6" />
                      </CardWrapper>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Background Circle */}
              <div className="absolute -z-10 -top-12 -right-12 w-64 h-64 bg-brand-100/30 rounded-full blur-3xl" />
            </div>
          </div>
            </div>
          </div>
        </section>

        {/* OurBride for Business Section */}
        <section className="py-16 md:py-24 bg-background relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl" />
          </div>

          <div className="container-custom relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Column - Content */}
                <div className="flex flex-col">
                  {/* Section Label */}
                  <Typography variant="bodySmall" className="text-brand-600 mb-4 font-medium">
                    For Business
                  </Typography>

                  {/* Heading */}
                  <Typography
                    variant="h2"
                    className="text-32 sm:text-40 md:text-48 font-normal text-gray-900 mb-6 leading-tight"
                  >
                    OurBride for business
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="bodyLarge"
                    className="text-16 sm:text-18 text-gray-700 mb-8 leading-relaxed"
                  >
                    Supercharge your business with the world&apos;s top booking platform for wedding services. Independently voted no. 1 by industry professionals.
                  </Typography>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    {[
                      'Award-winning booking platform',
                      'Trusted by industry professionals',
                      'Manage appointments effortlessly',
                      'Grow your business with OurBride',
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-brand-600" />
                        </div>
                        <Typography variant="body" className="text-gray-700">
                          {feature}
                        </Typography>
                      </div>
                    ))}
                  </div>

                  {/* Rating Section */}
                  <CardWrapper className="mb-8" padding="md">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Left: Rating Display */}
                      <div className="flex items-center gap-3">
                        <RatingDisplay
                          rating={5}
                          size="md"
                          showValue={false}
                          showCount={false}
                          format="stars-only"
                          starColor="brand"
                        />
                      </div>

                      {/* Middle: Rating Text */}
                      <div className="flex flex-col">
                        <Typography variant="bodySmall" className="font-semibold text-gray-900">
                        Excellent 5/5
                        </Typography>
                      </div>

                      {/* Divider */}
                      <div className="h-px sm:h-4 sm:w-px bg-gray-200" />

                      {/* Right: Review Source */}
                      <div className="flex flex-col">
                        <Typography variant="bodySmall" className="text-gray-600">
                          Over 1250 reviews on Capterra
                        </Typography>
                      </div>
                    </div>
                  </CardWrapper>

                  {/* CTA Button */}
                  <Button
                    variant="default"
                    size="md"
                    className="w-full sm:w-auto shadow-lg shadow-brand-600/25 group"
                    asChild
                  >
                    <a href="/auth/signup">
                      Find out more
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>

                {/* Right Column - Software Preview */}
                <div className="relative flex items-center justify-center lg:justify-end">
                  <div className="relative w-full max-w-lg">
                    {/* Main Dashboard Preview */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
                      <div className="w-full h-[400px] md:h-[500px] bg-white">
                        {/* Dashboard Header */}
                        <div className="bg-gray-50 border-b border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Image
                                src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src}
                                alt="OurBride Logo"
                                width={100}
                                height={40}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="px-3 py-1.5 bg-gray-100 rounded-lg">
                                <Typography variant="bodyTiny" className="text-gray-700">
                                  Dashboard
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="p-4 space-y-4">
                          {/* Stats Cards */}
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: 'Appointments', value: '247', color: 'bg-blue-50' },
                              { label: 'Revenue', value: '$12.5K', color: 'bg-green-50' },
                              { label: 'Clients', value: '1.2K', color: 'bg-purple-50' },
                            ].map((stat, idx) => (
                              <CardWrapper key={idx} className={cn("text-center", stat.color)} padding="sm">
                                <Typography variant="bodySmall" className="font-semibold text-gray-900 mb-1">
                                  {stat.value}
                                </Typography>
                                <Typography variant="bodyTiny" className="text-gray-600">
                                  {stat.label}
                                </Typography>
                              </CardWrapper>
                            ))}
                          </div>

                          {/* Calendar Preview */}
                          <CardWrapper padding="sm">
                            <Typography variant="bodySmall" className="font-semibold text-gray-900 mb-3">
                              Today&apos;s Schedule
                            </Typography>
                            <div className="space-y-2">
                              {[
                                { time: '9:00 AM', service: 'Hair Styling', client: 'Sarah M.' },
                                { time: '11:00 AM', service: 'Makeup', client: 'Emma L.' },
                                { time: '2:00 PM', service: 'Bridal Package', client: 'Jessica K.' },
                              ].map((appointment, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                  <div className="w-12 h-12 bg-brand-500 rounded-lg flex-shrink-0" />
                                  <div className="flex-1">
                                    <Typography variant="bodySmall" className="font-medium text-gray-900">
                                      {appointment.service}
                                    </Typography>
                                    <Typography variant="bodyTiny" className="text-gray-600">
                                      {appointment.time} • {appointment.client}
                                    </Typography>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardWrapper>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -z-10 -top-8 -right-8 w-48 h-48 bg-brand-100/30 rounded-full blur-2xl" />
                    <div className="absolute -z-10 -bottom-8 -left-8 w-64 h-64 bg-purple-100/30 rounded-full blur-2xl" />
                  </div>
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
