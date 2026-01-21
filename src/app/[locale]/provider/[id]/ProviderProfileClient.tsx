'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'
import {
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Share2,
  Heart,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Store,
  ThumbsUp,
  Building2,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, ErrorDisplay, CardWrapper, Typography, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import { formatRole } from '@/utils/role'
import { useProviderBranchPortfolio, useProviderTeamMemberPortfolio } from '@/hooks/providers/useProviderPortfolio'
import { useProviderPublicProfile } from '@/hooks/providers/useProviderPublicProfile'
import { useToggleProviderFollow, useToggleProviderFavorite } from '@/hooks/providers/useProviderInteractions'
import { useToast } from '@/components/ui/Toaster'
import { PortfolioModal } from '@/components/ui/PortfolioModal'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { RatingDisplay } from '@/components/ui/RatingDisplay'
import { DEFAULT_CURRENCY } from '@/utils/currency'

interface ProviderProfileClientProps {
  providerId: string
}

// Google Maps API types
interface GoogleMapsLatLng {
  lat(): number
  lng(): number
}

interface GoogleMapsGeocoderResult {
  geometry: {
    location: GoogleMapsLatLng
  }
}

type GoogleMapsGeocoderStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR'

interface GoogleMapsAPI {
  Map: new (element: HTMLElement, options?: Record<string, unknown>) => {
    setCenter: (center: { lat: number; lng: number }) => void
    setZoom: (zoom: number) => void
  }
  Marker: new (options?: {
    position?: { lat: number; lng: number }
    map?: unknown
    title?: string
  }) => unknown
  Geocoder: new () => {
    geocode: (
      request: { address: string },
      callback: (results: GoogleMapsGeocoderResult[] | null, status: GoogleMapsGeocoderStatus) => void
    ) => void
  }
}

// Type guard for window with Google Maps
type WindowWithGoogleMaps = Window & {
  google?: {
    maps: GoogleMapsAPI
  }
}

// Element with map instance property
interface HTMLElementWithMapInstance extends HTMLDivElement {
  __mapInstance?: unknown
}

// All data now comes from API - no mock data needed

export function ProviderProfileClient({
  providerId,
}: ProviderProfileClientProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<'services' | 'products' | 'branches' | 'team' | 'reviews' | 'about' | 'location' | 'opening-times' | 'links' | 'additional-info'>('services')
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [selectedBranchForPortfolio, setSelectedBranchForPortfolio] = useState<{ id: string; name: string } | null>(null)
  const [selectedTeamMemberForPortfolio, setSelectedTeamMemberForPortfolio] = useState<{ id: string; name: string; role: string } | null>(null)
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({})
  const [googleMapsLoaded, setGoogleMapsLoaded] = React.useState(false)

  // Follow and Favorite hooks - only mutations, no automatic fetching
  const toggleFollow = useToggleProviderFollow()
  const toggleFavorite = useToggleProviderFavorite()

  // Helper function to determine if a string is a number
  const isNumeric = (str: string): boolean => {
    return /^\d+$/.test(str)
  }

  const providerIdNum = isNumeric(providerId) ? parseInt(providerId, 10) : 0

  // Local state for follow/favorite status (optimistic updates)
  const [isFollowed, setIsFollowed] = React.useState(false)
  const [isFavorite, setIsFavorite] = React.useState(false)

  // Refs for scroll-based tab selection
  const sectionRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Fetch provider public profile data from API - MUST be called before any conditional returns
  // Support both ID and slug
  const { data: providerData, isLoading, error } = useProviderPublicProfile(providerId)

  // Update local state when providerData changes (if it includes follow/favorite status)
  React.useEffect(() => {
    if (providerData) {
      // Check if providerData has isFollowed/isFavorite properties
      const providerDataWithExtras = providerData as typeof providerData & {
        isFollowed?: boolean
        isFavorite?: boolean
      }
      if (providerDataWithExtras.isFollowed !== undefined) {
        setIsFollowed(providerDataWithExtras.isFollowed)
      }
      if (providerDataWithExtras.isFavorite !== undefined) {
        setIsFavorite(providerDataWithExtras.isFavorite)
      }
    }
  }, [providerData])

  // Fetch portfolio data for modals - MUST be called before any conditional returns
  // Only fetch if we have a numeric ID (portfolio endpoints may not support slug yet)
  const { data: branchPortfolio } = useProviderBranchPortfolio(
    providerIdNum,
    selectedBranchForPortfolio ? parseInt(selectedBranchForPortfolio.id) : 0,
    { enabled: !!selectedBranchForPortfolio && providerIdNum > 0 }
  )

  const { data: teamMemberPortfolio } = useProviderTeamMemberPortfolio(
    providerIdNum,
    selectedTeamMemberForPortfolio?.id || '',
    { enabled: !!selectedTeamMemberForPortfolio && providerIdNum > 0 }
  )

  // Calculate photos array from providerData (before early returns to avoid hook order issues)
  // Use publicBannerImageUrl first, then media
  const photos = providerData
    ? [
      ...(providerData.publicBannerImageUrl ? [providerData.publicBannerImageUrl] : []),
      ...(providerData.media || [])
        .map(m => {
          const url = m?.url || m?.thumbnailUrl || m?.previewUrl
          return typeof url === 'string' ? url : null
        })
        .filter((url): url is string => url !== null && url.trim() !== ''),
    ]
    : []

  // Reset photo index if current index is out of bounds
  React.useEffect(() => {
    if (photos.length > 0 && currentPhotoIndex >= photos.length) {
      setCurrentPhotoIndex(0)
    }
  }, [photos.length, currentPhotoIndex])

  // Load Google Maps script
  React.useEffect(() => {
    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDAwJZexZRlbt9nAwu2Kr8wWaJnMdtblfE'

    if (window.google?.maps) {
      setGoogleMapsLoaded(true)
      return
    }

    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Script already exists, wait for it to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          setGoogleMapsLoaded(true)
          clearInterval(checkInterval)
        }
      }, 100)
      return () => clearInterval(checkInterval)
    }

    if (!GOOGLE_MAPS_API_KEY) return

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => setGoogleMapsLoaded(true)
    script.onerror = () => console.error('Failed to load Google Maps')
    document.head.appendChild(script)
  }, [])

  // Track if user manually clicked a tab (to prevent auto-scroll interference)
  const [isManualTabChange, setIsManualTabChange] = React.useState(false)
  const [isHoursExpanded, setIsHoursExpanded] = React.useState(false)
  const observerTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Scroll-based tab selection using Intersection Observer
  React.useEffect(() => {
    // Skip observer if user manually changed tab
    if (isManualTabChange) {
      // Reset flag after a delay
      const timer = setTimeout(() => setIsManualTabChange(false), 1500)
      return () => clearTimeout(timer)
    }

    // Clear any pending timeout
    if (observerTimeoutRef.current) {
      clearTimeout(observerTimeoutRef.current)
    }

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px', // More precise margins to reduce overlap
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Multiple thresholds for better detection
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Filter to only intersecting entries and find the one with highest intersection ratio
      const intersectingEntries = entries.filter(entry => entry.isIntersecting)

      if (intersectingEntries.length === 0) return
      if (isManualTabChange) return

      // Find the section with the highest intersection ratio (most visible)
      const mostVisibleEntry = intersectingEntries.reduce((prev, current) => {
        return current.intersectionRatio > prev.intersectionRatio ? current : prev
      })

      // Only update if the intersection ratio is significant (at least 10% visible)
      if (mostVisibleEntry.intersectionRatio >= 0.1) {
        const sectionId = mostVisibleEntry.target.getAttribute('data-section-id')
        if (sectionId && sectionId !== activeTab) {
          // Debounce the tab change to prevent rapid switching
          if (observerTimeoutRef.current) {
            clearTimeout(observerTimeoutRef.current)
          }

          observerTimeoutRef.current = setTimeout(() => {
            setActiveTab(sectionId as typeof activeTab)
            observerTimeoutRef.current = null
          }, 150) // 150ms debounce
        }
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all section refs
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => {
      observer.disconnect()
      if (observerTimeoutRef.current) {
        clearTimeout(observerTimeoutRef.current)
      }
    }
  }, [activeTab, isManualTabChange])

  // Handle follow toggle - MUST be called before conditional returns
  const handleFollowToggle = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (toggleFollow.isPending) return

    // Optimistic update
    const newFollowState = !isFollowed
    setIsFollowed(newFollowState)

    // Call API
    toggleFollow.mutate(providerIdNum, {
      onError: () => {
        // Revert on error
        setIsFollowed(!newFollowState)
      }
    })
  }, [toggleFollow, providerIdNum, isFollowed])

  // Handle favorite toggle - MUST be called before conditional returns
  const handleFavoriteToggle = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (toggleFavorite.isPending) return

    // Optimistic update
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)

    // Call API
    toggleFavorite.mutate(providerIdNum, {
      onError: () => {
        // Revert on error
        setIsFavorite(!newFavoriteState)
      }
    })
  }, [toggleFavorite, providerIdNum, isFavorite])

  // Handle share - MUST be called before conditional returns
  const handleShare = React.useCallback(async () => {
    if (!providerData) return

    const providerName = providerData.nameEn || providerData.nameAr || 'Provider'
    const shareData = {
      title: `${providerName} - OurBride`,
      text: `Check out ${providerName} on OurBride`,
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        addToast('Shared successfully!', 'success')
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
        addToast('Link copied to clipboard!', 'success')
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name !== 'AbortError') {
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href)
          addToast('Link copied to clipboard!', 'success')
        } catch (clipboardError) {
          console.error('Failed to copy to clipboard:', clipboardError)
          addToast('Failed to share. Please try again.', 'error')
        }
      }
    }
  }, [providerData, addToast])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading profile..." fullScreen={true} />
        </main>
        <Footer />
      </div>
    )
  }

  // Show error state
  if (error || !providerData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <ErrorDisplay
            title="Provider not found"
            message="The provider you're looking for doesn't exist or has been removed."
            actionLabel="Back to Providers"
            actionHref="/providers"
          />
        </main>
        <Footer />
      </div>
    )
  }

  // Extract data from API response (ProviderPublicProfileResponse)
  const provider = {
    id: providerData.id.toString(),
    name: providerData.nameEn || providerData.nameAr || 'Provider',
    nameAr: providerData.nameAr || '',
    type: 'Service Provider',
    rating: providerData.rate || 0,
    averageRating: providerData.averageRating || providerData.rate || 0,
    totalReviews: providerData.totalReviews || 0,
    totalServices: providerData.totalServices || 0,
    totalProducts: providerData.totalProducts || 0,
    totalFollowers: providerData.totalFollowers || 0,
    totalViews: providerData.totalViews || 0,
    likes: providerData.likes || 0,
    address: providerData.address
      ? providerData.address.addressEn || providerData.address.addressAr || providerData.address.street || providerData.shortAddress || ''
      : providerData.shortAddress || '',
    fullAddress: providerData.address
      ? [
        providerData.address.street,
        providerData.address.building,
        providerData.address.floor,
        providerData.address.apartment,
        providerData.address.landmark,
        providerData.address.cityName,
        providerData.address.countryName,
      ]
        .filter(Boolean)
        .join(', ')
      : providerData.shortAddress || '',
    neighborhood: providerData.address?.regionName || providerData.address?.cityName || providerData.shortAddress || '',
    isVerified: providerData.isVerified,
    providerStatus: providerData.providerStatus,
    publicProfileSlug: providerData.publicProfileSlug,
    uniqueCode: providerData.uniqueCode,
    qrCodeData: providerData.qrCodeData,
    photos,
    description: providerData.descriptionEn || providerData.descriptionAr || '',
    phoneNumber: providerData.phoneNumber || '',
    profileURL: providerData.profileURL || providerData.publicLogoImageUrl || '',
    publicLogoImageUrl: providerData.publicLogoImageUrl,
    publicBannerImageUrl: providerData.publicBannerImageUrl,
    branches: (providerData.branches || []).map(branch => ({
      id: branch.id?.toString() || '',
      name: branch.nameEn || branch.nameAr || 'Branch',
      nameAr: branch.nameAr || '',
      nameEn: branch.nameEn || '',
      address: branch.address
        ? branch.address.addressEn || branch.address.addressAr || branch.address.street || ''
        : '',
      fullAddress: branch.address
        ? [
          branch.address.street,
          branch.address.building,
          branch.address.floor,
          branch.address.apartment,
          branch.address.landmark,
          branch.address.cityName,
          branch.address.countryName,
        ]
          .filter(Boolean)
          .join(', ')
        : '',
      phone: branch.phoneNumber || branch.phoneNumber2 || providerData.phoneNumber || '',
      phone2: branch.phoneNumber2 || '',
      isOpen: branch.isActive ?? true,
      isMain: branch.isMain ?? false,
      rate: branch.rate || 0,
      likes: branch.likes || 0,
      latitude: branch.address?.latitude,
      longitude: branch.address?.longitude,
    })),
    reviews: (providerData.reviews || []).map(review => ({
      id: review.id?.toString() || '',
      userName: review.nameEn || review.nameAr || review.title || 'User',
      date: review.creationDate ? new Date(review.creationDate).toLocaleDateString() : '',
      rating: review.rate || 0,
      text: review.comment || review.descriptionEn || review.descriptionAr || review.summary || '',
      title: review.title || '',
      likes: review.likes || 0,
      isVerified: review.isVerified || false,
      isFeatured: review.isFeatured || false,
      hasResponse: false, // Not available in ReviewResponse
      response: '', // Not available in ReviewResponse
    })),
    links: providerData.links || [],
    workingTimes: providerData.workingTimes || [],
    paymentMethods: providerData.paymentMethods || [],
    memberships: providerData.memberships || [],
    giftCards: providerData.giftCards || [],
    services: (providerData.services || []).map(service => ({
      id: service.id.toString(),
      name: service.nameEn || service.nameAr || 'Service',
      nameAr: service.nameAr || '',
      nameEn: service.nameEn || '',
      description: service.descriptionEn || service.descriptionAr || '',
      image: service.image || '',
      price: service.price || 0,
      saleBuyPrice: service.saleBuyPrice,
      saleRentPrice: service.saleRentPrice,
      rate: service.rate || 0,
      hasDiscount: service.hasDiscount || false,
      discountType: service.discountType,
      onSale: service.onSale || false,
      availableStartTime: service.availableStartTime,
      availableEndTime: service.availableEndTime,
      availableDaysOfWeek: service.availableDaysOfWeek,
      startDate: service.startDate,
      endDate: service.endDate,
    })),
    team: (providerData.teamMembers || []).map(member => ({
      id: member.id?.toString() || '',
      name: member.providerName || member.user?.email || 'Team Member',
      email: member.user?.email || '',
      role: formatRole(member.role?.name || member.roleKey || '') || '',
      roleKey: member.roleKey || '',
      isActive: member.isActive ?? true,
      branchId: member.branchId,
      placeId: member.placeId,
    })),
    products: (providerData?.products || []).map(product => {
      // Safely extract image URL - ensure it's a string
      let imageUrl: string | undefined = undefined
      if (typeof product.image === 'string' && product.image.trim() !== '') {
        imageUrl = product.image
      } else if (typeof product.url === 'string' && product.url.trim() !== '') {
        imageUrl = product.url
      }

      return {
        id: product.id?.toString() || product.productId?.toString() || '',
        name: product.nameEn || product.nameAr || product.name || 'Product',
        nameAr: product.nameAr || '',
        nameEn: product.nameEn || '',
        description: product.shortDescriptionEn || product.shortDescriptionAr || product.shortDescription || product.bioEn || product.bioAr || product.bio || '',
        image: imageUrl || '',
        price: product.salePrice || product.price || product.regularPrice || 0,
        originalPrice: product.hasDiscount && product.regularPrice ? product.regularPrice : undefined,
        currency: DEFAULT_CURRENCY,
        inStock: product.inStock ?? false,
        stock: product.stockQuantity,
        rate: typeof product.rate === 'string' ? parseFloat(product.rate) || 0 : (product.rate || 0),
        likes: product.likes || 0,
        hasDiscount: product.hasDiscount || false,
        isFeatured: product.isFeatured || false,
        published: product.published ?? true,
      }
    }),
    openingHours: (providerData.workingTimes || []).map(wt => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return {
        day: days[wt.dayOfWeek] || '',
        hours: wt.start && wt.end ? `${new Date(wt.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${new Date(wt.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : 'Closed',
        start: wt.start,
        end: wt.end,
      }
    }),
  }

  const handleBookService = (serviceId: string) => {
    // Navigate to booking page with service pre-selected
    router.push(`/provider/${providerId}/booking?service=${serviceId}`)
  }

  const nextPhoto = () => {
    if (photos.length === 0) return
    setCurrentPhotoIndex(prev => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    if (photos.length === 0) return
    setCurrentPhotoIndex(
      prev => (prev - 1 + photos.length) % photos.length
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Photos */}
        <div className="bg-white">
          <div className="container-custom py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-14 text-gray-600 mb-4">
              <button
                onClick={() => router.push('/')}
                className="hover:text-brand-600"
              >
                Home
              </button>
              <span>/</span>
              <button
                onClick={() => router.push('/providers')}
                className="hover:text-brand-600"
              >
                Providers
              </button>
              <span>/</span>
              <span className="text-gray-900">{provider.name}</span>
            </div>

            {/* Provider Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-28 md:text-36 font-semibold text-gray-900">
                    {provider.name}
                  </h1>
                  {provider.isVerified && (
                    <CheckCircle2 className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-14 text-gray-600">
                  <RatingDisplay
                    rating={provider.rating}
                    count={provider.totalReviews}
                    showCount={true}
                    size="sm"
                    format="default"
                    variant="compact"
                  />
                  {provider.totalServices > 0 && (
                    <>
                      <span>•</span>
                      <span>{provider.totalServices} Services</span>
                    </>
                  )}
                  {provider.totalProducts > 0 && (
                    <>
                      <span>•</span>
                      <span>{provider.totalProducts} Products</span>
                    </>
                  )}
                  {provider.totalFollowers > 0 && (
                    <>
                      <span>•</span>
                      <span>{provider.totalFollowers} Followers</span>
                    </>
                  )}
                  {provider.totalViews > 0 && (
                    <>
                      <span>•</span>
                      <span>{provider.totalViews} Views</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{provider.neighborhood}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  className="flex items-center gap-2"
                  onClick={handleShare}
                  disabled={toggleFollow.isPending || toggleFavorite.isPending}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant={isFollowed ? "brand" : "outline"}
                  size="md"
                  className={cn(
                    "flex items-center gap-2",
                    isFollowed && "!text-white"
                  )}
                  onClick={handleFollowToggle}
                  disabled={toggleFollow.isPending || toggleFavorite.isPending}
                >
                  <UserPlus className={cn(
                    "h-4 w-4",
                    toggleFollow.isPending && "animate-pulse"
                  )} />
                  {isFollowed ? 'Following' : 'Follow'}
                </Button>
                <Button
                  variant={isFavorite ? "brand" : "outline"}
                  size="md"
                  className={cn(
                    "flex items-center gap-2",
                    isFavorite && "!text-white"
                  )}
                  onClick={handleFavoriteToggle}
                  disabled={toggleFollow.isPending || toggleFavorite.isPending}
                >
                  <Heart className={cn(
                    "h-4 w-4",
                    toggleFavorite.isPending && "animate-pulse",
                    isFavorite && "fill-current"
                  )} />
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-[400px] md:h-[500px]">
              {(() => {
                const isValidIndex = currentPhotoIndex >= 0 && currentPhotoIndex < photos.length
                const currentPhoto = isValidIndex ? photos[currentPhotoIndex] : null
                const isValidPhoto = currentPhoto && typeof currentPhoto === 'string' && currentPhoto.trim() !== ''

                const photoKey = `photo-${currentPhotoIndex}`
                const hasError = imageErrors[photoKey]

                return isValidPhoto && !hasError ? (
                  <Image
                    src={currentPhoto}
                    alt={`${provider.name} - Photo ${currentPhotoIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1200px"
                    onError={() => setImageErrors(prev => ({ ...prev, [photoKey]: true }))}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-brand-500/20 flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-brand-600" />
                      </div>
                      <span className="text-14 text-gray-500 font-medium">No image available</span>
                    </div>
                  </div>
                )
              })()}

              {/* Navigation Arrows */}
              {photos.length > 1 && photos[currentPhotoIndex] && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-900" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-900" />
                  </button>
                </>
              )}

              {/* Photo Counter */}
              {photos.length > 0 && (
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-12 font-medium">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>
              )}

              {/* Thumbnail Indicators */}
              {photos.length > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        index === currentPhotoIndex
                          ? 'bg-white w-6'
                          : 'bg-white/60'
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="container-custom">
            <div className="flex items-center gap-4 md:gap-8 overflow-x-auto scrollbar-hide">
              {(
                [
                  { id: 'services' as const, label: 'Services' },
                  { id: 'products' as const, label: 'Products' },
                  { id: 'branches' as const, label: 'Branches' },
                  { id: 'team' as const, label: 'Team' },
                  { id: 'reviews' as const, label: 'Reviews' },
                  { id: 'about' as const, label: 'About' },
                  { id: 'location' as const, label: 'Location' },
                  { id: 'opening-times' as const, label: 'Opening Times' },
                  { id: 'links' as const, label: 'Links' },
                  { id: 'additional-info' as const, label: 'Additional Info' },
                ] as const
              ).map(tab => {
                // Check if tab has data
                const hasData = (() => {
                  switch (tab.id) {
                    case 'services': return provider.services.length > 0
                    case 'products': return provider.products.length > 0
                    case 'branches': return provider.branches.length > 0
                    case 'team': return provider.team.length > 0
                    case 'reviews': return provider.reviews.length > 0
                    case 'about': return !!provider.description
                    case 'location': return !!provider.address
                    case 'opening-times': return provider.openingHours.length > 0
                    case 'links': return provider.links.filter(l => l.isPublic && l.url).length > 0
                    case 'additional-info': return true // Always show, has payment methods, contact, stats
                    default: return true
                  }
                })()

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setIsManualTabChange(true)
                      setActiveTab(tab.id)
                      const section = sectionRefs.current[tab.id]
                      if (section) {
                        // Use requestAnimationFrame to prevent lag
                        requestAnimationFrame(() => {
                          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        })
                      }
                    }}
                    className={cn(
                      'py-4 text-14 md:text-16 font-medium transition-colors relative whitespace-nowrap flex-shrink-0',
                      activeTab === tab.id
                        ? 'text-brand-600'
                        : 'text-gray-600 hover:text-gray-900',
                      !hasData && 'opacity-60'
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content - All Sections Visible */}
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-16">
              {/* Services Section */}
              <div
                ref={el => { sectionRefs.current['services'] = el }}
                data-section-id="services"
                className="scroll-mt-32"
              >
                <h2 className="text-24 font-semibold text-gray-900 mb-6">
                  Services ({provider.totalServices})
                </h2>
                {provider.services.length > 0 ? (
                  <div className="space-y-3">
                    {provider.services.map(service => {
                      const displayPrice = service.saleBuyPrice || service.saleRentPrice || service.price || 0
                      const originalPrice = service.hasDiscount && service.price ? service.price : undefined
                      return (
                        <div
                          key={service.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-2">
                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                  {service.image && !imageErrors[`service-${service.id}`] ? (
                                    <Image
                                      src={service.image}
                                      alt={service.name}
                                      fill
                                      className="object-cover"
                                      sizes="80px"
                                      onError={() => setImageErrors(prev => ({ ...prev, [`service-${service.id}`]: true }))}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                      <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                                        <Store className="h-5 w-5 text-brand-600" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-16 font-semibold text-gray-900 mb-1">
                                    {service.name}
                                  </h3>
                                  {service.description && (
                                    <p className="text-14 text-gray-600 mb-2 line-clamp-2">
                                      {service.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 text-14 text-gray-600">
                                    <RatingDisplay
                                      rating={service.rate || 0}
                                      size="xs"
                                      format="stars-only"
                                      variant="compact"
                                    />
                                    {service.availableStartTime && service.availableEndTime && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {service.availableStartTime} - {service.availableEndTime}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <Button
                                variant="brand"
                                size="md"
                                onClick={() => handleBookService(service.id)}
                                className="!text-white"
                              >
                                Book
                              </Button>
                              <div className="flex flex-col items-end gap-1">
                                <PriceDisplay
                                  original={originalPrice}
                                  discounted={displayPrice}
                                  currency={DEFAULT_CURRENCY}
                                  size="sm"
                                  variant="compact"
                                  showOriginal={service.hasDiscount}
                                />
                                {service.onSale && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-12 font-semibold rounded">
                                    On Sale
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <Store className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-16 font-medium mb-1">No services available</p>
                    <p className="text-gray-400 text-14">This provider doesn&apos;t have any services listed yet.</p>
                  </div>
                )}
              </div>

              {/* Products Section */}
              <div
                ref={el => { sectionRefs.current['products'] = el }}
                data-section-id="products"
                className="scroll-mt-32"
              >
                <h2 className="text-24 font-semibold text-gray-900 mb-6">
                  Products ({provider.totalProducts})
                </h2>
                {provider.products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {provider.products.map(product => (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative w-full aspect-square bg-gray-100">
                          {(() => {
                            const imageUrl = typeof product.image === 'string' && product.image.trim() !== ''
                              ? product.image
                              : null
                            const productKey = `product-${product.id}`
                            const hasError = imageErrors[productKey]

                            return imageUrl && !hasError ? (
                              <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, 33vw"
                                onError={() => setImageErrors(prev => ({ ...prev, [productKey]: true }))}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center">
                                    <Store className="h-6 w-6 text-brand-600" />
                                  </div>
                                  <span className="text-12 text-gray-500 font-medium">No image</span>
                                </div>
                              </div>
                            )
                          })()}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-14 font-semibold">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-14 font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between mb-2">
                            <PriceDisplay
                              original={product.originalPrice}
                              discounted={product.price}
                              currency={product.currency}
                              size="sm"
                              variant="compact"
                              showOriginal={product.hasDiscount}
                            />
                          </div>
                          <Button
                            variant="brand"
                            size="sm"
                            disabled={!product.inStock}
                            className="w-full !text-white"
                          >
                            {product.inStock ? 'Add to Cart' : 'Sold Out'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <Store className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-16 font-medium mb-1">No products available</p>
                    <p className="text-gray-400 text-14">This provider doesn&apos;t have any products listed yet.</p>
                  </div>
                )}
              </div>

              {/* Branches Section */}
              <div
                ref={el => { sectionRefs.current['branches'] = el }}
                data-section-id="branches"
                className="scroll-mt-32"
              >
                <h2 className="text-24 font-semibold text-gray-900 mb-6">
                  Branches
                </h2>
                {provider.branches.length > 0 ? (
                  <div className="space-y-4">
                    {provider.branches.map(branch => {
                      const hasCoordinates = branch.latitude && branch.longitude

                      // Map initialization ref callback
                      const mapRefCallback = (element: HTMLDivElement | null) => {
                        const mapElement = element as HTMLElementWithMapInstance | null
                        if (!mapElement || !hasCoordinates || !googleMapsLoaded || mapElement.__mapInstance) return

                        const windowWithGoogle = window as WindowWithGoogleMaps
                        if (!windowWithGoogle.google?.maps) return

                        try {
                          const googleMaps = windowWithGoogle.google.maps
                          const map = new googleMaps.Map(mapElement, {
                            center: { lat: branch.latitude!, lng: branch.longitude! },
                            zoom: 15,
                            disableDefaultUI: false,
                            zoomControl: true,
                            mapTypeControl: false,
                            streetViewControl: false,
                            fullscreenControl: true,
                          })

                          new googleMaps.Marker({
                            position: { lat: branch.latitude!, lng: branch.longitude! },
                            map,
                            title: branch.name,
                          })

                          mapElement.__mapInstance = map
                        } catch (error) {
                          console.error('Error initializing map:', error)
                        }
                      }

                      return (
                        <div
                          key={branch.id}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-16 font-semibold text-gray-900 mb-2">
                                  {branch.name}
                                  {branch.isMain && (
                                    <span className="ml-2 px-2 py-0.5 bg-brand-100 text-brand-600 text-12 font-semibold rounded">
                                      Main
                                    </span>
                                  )}
                                </h3>
                                <div className="space-y-1.5">
                                  <div className="flex items-start gap-2 text-14 text-gray-600">
                                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <span>{branch.address || branch.fullAddress}</span>
                                  </div>
                                  {branch.phone && (
                                    <div className="flex items-center gap-2 text-14 text-gray-600">
                                      <Phone className="h-4 w-4 flex-shrink-0" />
                                      <a href={`tel:${branch.phone}`} className="hover:text-brand-600">
                                        {branch.phone}
                                      </a>
                                    </div>
                                  )}
                                  {branch.isOpen !== undefined && (
                                    <div className="flex items-center gap-2 text-14">
                                      <Clock className="h-4 w-4 flex-shrink-0" />
                                      <span
                                        className={
                                          branch.isOpen
                                            ? 'text-green-600 font-medium'
                                            : 'text-red-600 font-medium'
                                        }
                                      >
                                        {branch.isOpen ? 'Open' : 'Closed'}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 text-14">
                                    <RatingDisplay
                                      rating={branch.rate || 0}
                                      size="xs"
                                      format="stars-only"
                                      variant="compact"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const address = encodeURIComponent(branch.fullAddress || branch.address)
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
                                  }}
                                >
                                  Get Directions
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedBranchForPortfolio({ id: branch.id, name: branch.name })}
                                  className="flex items-center gap-1"
                                >
                                  <ImageIcon className="h-4 w-4" />
                                  Portfolio
                                </Button>
                              </div>
                            </div>
                          </div>
                          {hasCoordinates && (
                            <div className="relative w-full h-[300px] bg-gray-100">
                              {googleMapsLoaded ? (
                                <div ref={mapRefCallback} className="w-full h-full" />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500 text-14">Loading map...</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-16 font-medium mb-1">No branches available</p>
                    <p className="text-gray-400 text-14">This provider doesn&apos;t have any branches listed yet.</p>
                  </div>
                )}
              </div>

              {/* Team Section */}
              <div
                ref={el => { sectionRefs.current['team'] = el }}
                data-section-id="team"
                className="scroll-mt-32"
              >
                <h2 className="text-24 font-semibold text-gray-900 mb-6">
                  Team
                </h2>
                {provider.team.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {provider.team.map(member => (
                      <div
                        key={member.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-20 font-semibold text-gray-600">
                              {(member.name || member.email || 'T').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-16 font-semibold text-gray-900 mb-1 truncate">
                              {member.name || member.email || 'Team Member'}
                            </h3>
                            <p className="text-14 text-gray-600 mb-2 truncate">
                              {formatRole(member.role)}
                            </p>
                            {member.isActive && (
                              <span className="text-12 text-green-600 font-medium">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTeamMemberForPortfolio({ id: member.id, name: member.name || member.email || 'Team Member', role: member.role })}
                          className="w-full flex items-center justify-center gap-1"
                        >
                          <ImageIcon className="h-4 w-4" />
                          View Portfolio
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <span className="text-24 font-semibold text-gray-400">T</span>
                    </div>
                    <p className="text-gray-500 text-16 font-medium mb-1">No team members available</p>
                    <p className="text-gray-400 text-14">This provider doesn&apos;t have any team members listed yet.</p>
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div
                ref={el => { sectionRefs.current['reviews'] = el }}
                data-section-id="reviews"
                className="scroll-mt-32"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-24 font-semibold text-gray-900">
                    Reviews
                  </h2>
                  {provider.reviews.length > 0 && (
                    <RatingDisplay
                      rating={provider.averageRating || provider.rating}
                      count={provider.totalReviews}
                      showCount={true}
                      size="md"
                      format="default"
                      variant="default"
                    />
                  )}
                </div>
                {provider.reviews.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {provider.reviews.map(review => (
                        <div
                          key={review.id}
                          className="bg-white border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-16 font-semibold text-gray-900">
                                  {review.userName}
                                </h4>
                                {review.isVerified && (
                                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                )}
                                {review.isFeatured && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-12 font-semibold rounded">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-12 text-gray-500">
                                {review.date}
                              </p>
                            </div>
                            <RatingDisplay
                              rating={review.rating}
                              size="sm"
                              format="stars-only"
                              variant="compact"
                            />
                          </div>
                          {review.title && (
                            <h5 className="text-14 font-semibold text-gray-900 mb-1">
                              {review.title}
                            </h5>
                          )}
                          <p className="text-14 text-gray-700 leading-relaxed mb-2">
                            {review.text}
                          </p>
                          {review.hasResponse && review.response && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-12 text-gray-500 mb-1">Provider Response:</p>
                              <p className="text-14 text-gray-700">{review.response}</p>
                            </div>
                          )}
                          {review.likes > 0 && (
                            <div className="flex items-center gap-1 mt-2 text-12 text-gray-500">
                              <Heart className="h-3 w-3" />
                              <span>{review.likes} helpful</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-6">
                      <Button variant="outline" size="md">
                        See all reviews
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <ThumbsUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-16 font-medium mb-1">No reviews available</p>
                    <p className="text-gray-400 text-14">This provider doesn&apos;t have any reviews yet.</p>
                  </div>
                )}
              </div>

              {/* About Section */}
              <div
                ref={el => { sectionRefs.current['about'] = el }}
                data-section-id="about"
                className="scroll-mt-32"
              >
                <h2 className="text-24 font-semibold text-gray-900 mb-4">
                  About
                </h2>
                {provider.description ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <p className="text-16 text-gray-700 leading-relaxed">
                      {provider.description}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-16 font-medium mb-1">No description available</p>
                    <p className="text-gray-400 text-14">This provider hasn&apos;t added a description yet.</p>
                  </div>
                )}
              </div>

              {/* Location Section */}
              <div
                ref={el => { sectionRefs.current['location'] = el }}
                data-section-id="location"
                className="scroll-mt-32"
              >
                <h2 className="text-24 font-semibold text-gray-900 mb-6">
                  Location
                </h2>
                {provider.address ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-16 text-gray-900 font-medium mb-1">
                            {provider.fullAddress || provider.address}
                          </p>
                          {provider.neighborhood && (
                            <p className="text-14 text-gray-500">
                              {provider.neighborhood}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {googleMapsLoaded && provider.address && window.google?.maps ? (
                          <div
                            ref={(element) => {
                              const mapElement = element as HTMLElementWithMapInstance | null
                              if (!mapElement || mapElement.__mapInstance) return

                              const windowWithGoogle = window as WindowWithGoogleMaps
                              if (!windowWithGoogle.google?.maps) return

                              try {
                                const address = provider.fullAddress || provider.address
                                const googleMaps = windowWithGoogle.google.maps
                                const geocoder = new googleMaps.Geocoder()

                                geocoder.geocode({ address }, (results, status) => {
                                  if (status === 'OK' && results && results[0]) {
                                    const location = results[0].geometry.location
                                    const map = new googleMaps.Map(mapElement, {
                                      center: { lat: location.lat(), lng: location.lng() },
                                      zoom: 15,
                                      disableDefaultUI: false,
                                      zoomControl: true,
                                      mapTypeControl: false,
                                      streetViewControl: true,
                                      fullscreenControl: true,
                                    })

                                    new googleMaps.Marker({
                                      position: { lat: location.lat(), lng: location.lng() },
                                      map,
                                      title: provider.name,
                                    })

                                    mapElement.__mapInstance = map
                                  }
                                })
                              } catch (error) {
                                console.error('Error initializing location map:', error)
                              }
                            }}
                            className="w-full h-full"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-14">Loading map...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="md"
                        className="w-full"
                        onClick={() => {
                          const address = encodeURIComponent(provider.fullAddress || provider.address)
                          window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
                        }}
                      >
                        Get Directions
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-16 font-medium mb-1">No location available</p>
                    <p className="text-gray-400 text-14">This provider hasn&apos;t added a location yet.</p>
                  </div>
                )}
              </div>

              {/* Opening Times Section */}
              <div
                ref={el => { sectionRefs.current['opening-times'] = el }}
                data-section-id="opening-times"
                className="scroll-mt-32"
              >
                <h2 className="text-24 font-semibold text-gray-900 mb-6">
                  Opening Times
                </h2>
                {provider.openingHours.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="divide-y divide-gray-100">
                      {provider.openingHours.map((schedule, index) => {
                        const today = new Date().getDay()
                        const isToday = index === today || schedule.day.toLowerCase() === ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today].toLowerCase()
                        const isClosed = schedule.hours === 'Closed' || !schedule.hours

                        return (
                          <div
                            key={`${schedule.day}-${index}`}
                            className={cn(
                              "flex items-center justify-between px-6 py-4 transition-colors",
                              isToday && "bg-brand-50 border-l-4 border-l-brand-500"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Clock className={cn(
                                "h-5 w-5 flex-shrink-0",
                                isToday ? "text-brand-600" : "text-gray-400"
                              )} />
                              <span className={cn(
                                "text-16 font-medium",
                                isToday ? "text-brand-900 font-semibold" : "text-gray-700"
                              )}>
                                {schedule.day}
                                {isToday && (
                                  <span className="ml-2 px-2 py-0.5 bg-brand-500 text-white text-12 font-semibold rounded">
                                    Today
                                  </span>
                                )}
                              </span>
                            </div>
                            <span className={cn(
                              "text-16 font-semibold",
                              isClosed ? "text-red-600" : isToday ? "text-brand-900" : "text-gray-900"
                            )}>
                              {schedule.hours || 'Closed'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-16 font-medium mb-1">No opening times available</p>
                    <p className="text-gray-400 text-14">Opening hours have not been set for this provider.</p>
                  </div>
                )}
              </div>

              {/* Links Section */}
              <div
                ref={el => { sectionRefs.current['links'] = el }}
                data-section-id="links"
                className="scroll-mt-32"
              >
                <h2 className="text-24 font-semibold text-gray-900 mb-6">
                  Links
                </h2>
                {provider.links.filter(link => link.isPublic && link.url).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {provider.links
                      .filter(link => link.isPublic && link.url)
                      .map(link => {
                        const linkName = link.nameEn || link.nameAr || link.displayName || link.title || 'Link'
                        const linkDescription = link.descriptionEn || link.descriptionAr || link.displayDescription || link.metaDescription
                        const isEmail = link.url?.includes('mailto:')
                        const isWebsite = link.url?.startsWith('http')
                        const linkIcon = isEmail ? Mail : isWebsite ? Globe : Globe

                        return (
                          <a
                            key={link.id}
                            href={link.url || '#'}
                            target={link.isExternal || link.openInNewTab ? '_blank' : '_self'}
                            rel={link.isExternal || link.openInNewTab ? 'noopener noreferrer' : undefined}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all hover:border-brand-300 group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                                {linkIcon === Mail ? (
                                  <Mail className="h-5 w-5 text-brand-600" />
                                ) : (
                                  <Globe className="h-5 w-5 text-brand-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-16 font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-brand-600 transition-colors">
                                  {linkName}
                                </h3>
                                {linkDescription && (
                                  <p className="text-14 text-gray-600 line-clamp-2 mb-2">
                                    {linkDescription}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 text-12 text-gray-500">
                                  {link.isVerified && (
                                    <span className="flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                                      Verified
                                    </span>
                                  )}
                                  {link.clickCount > 0 && (
                                    <span>• {link.clickCount} clicks</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </a>
                        )
                      })}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-16 font-medium mb-1">No links available</p>
                    <p className="text-gray-400 text-14">This provider hasn&apos;t added any public links yet.</p>
                  </div>
                )}
              </div>

              {/* Additional Information Section */}
              <div
                ref={el => { sectionRefs.current['additional-info'] = el }}
                data-section-id="additional-info"
                className="scroll-mt-32"
              >
                <h2 className="text-24 font-semibold text-gray-900 mb-6">
                  Additional Information
                </h2>
                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                  {/* Payment Methods */}
                  {provider.paymentMethods.length > 0 && (
                    <div className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                      <h3 className="text-18 font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                          <span className="text-brand-600 text-14 font-bold">$</span>
                        </div>
                        Payment Methods
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.paymentMethods.map((method, index) => {
                          const paymentMethodName = method.paymentMethod?.nameEn ||
                            method.paymentMethod?.nameAr ||
                            method.statusDisplayName ||
                            'Payment Method'
                          return (
                            <span
                              key={index}
                              className="px-4 py-2 bg-brand-50 border border-brand-200 text-brand-700 text-14 font-medium rounded-lg hover:bg-brand-100 transition-colors"
                            >
                              {paymentMethodName}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  {(provider.phoneNumber || provider.links.filter(link => link.isPublic && link.url && (link.url.includes('mailto:') || link.url.startsWith('http'))).length > 0) && (
                    <div className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                      <h3 className="text-18 font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                          <Phone className="h-4 w-4 text-brand-600" />
                        </div>
                        Contact
                      </h3>
                      <div className="space-y-3">
                        {provider.phoneNumber && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <Phone className="h-5 w-5 text-brand-600 flex-shrink-0" />
                            <a href={`tel:${provider.phoneNumber}`} className="text-16 text-gray-900 font-medium hover:text-brand-600">
                              {provider.phoneNumber}
                            </a>
                          </div>
                        )}
                        {provider.links.filter(link => link.isPublic && link.url && link.url.includes('mailto:')).length > 0 && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <Mail className="h-5 w-5 text-brand-600 flex-shrink-0" />
                            <a
                              href={provider.links.find(link => link.url?.includes('mailto:'))?.url || '#'}
                              className="text-16 text-gray-900 font-medium hover:text-brand-600"
                            >
                              {provider.links.find(link => link.url?.includes('mailto:'))?.url?.replace('mailto:', '') || 'Email'}
                            </a>
                          </div>
                        )}
                        {provider.links.filter(link => link.isPublic && link.url && link.url.startsWith('http')).length > 0 && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <Globe className="h-5 w-5 text-brand-600 flex-shrink-0" />
                            <a
                              href={provider.links.find(link => link.url?.startsWith('http'))?.url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-16 text-gray-900 font-medium hover:text-brand-600"
                            >
                              {provider.links.find(link => link.url?.startsWith('http'))?.url || 'Website'}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Statistics */}
                  {(provider.totalServices > 0 || provider.totalProducts > 0 || provider.totalFollowers > 0 || provider.totalViews > 0) && (
                    <div>
                      <h3 className="text-18 font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                          <ThumbsUp className="h-4 w-4 text-brand-600" />
                        </div>
                        Statistics
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {provider.totalServices > 0 && (
                          <div className="text-center p-4 bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl border border-brand-200 hover:shadow-md transition-shadow">
                            <div className="text-24 font-bold text-brand-600 mb-1">{provider.totalServices}</div>
                            <div className="text-14 text-gray-700 font-medium">Services</div>
                          </div>
                        )}
                        {provider.totalProducts > 0 && (
                          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                            <div className="text-24 font-bold text-purple-600 mb-1">{provider.totalProducts}</div>
                            <div className="text-14 text-gray-700 font-medium">Products</div>
                          </div>
                        )}
                        {provider.totalFollowers > 0 && (
                          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                            <div className="text-24 font-bold text-blue-600 mb-1">{provider.totalFollowers}</div>
                            <div className="text-14 text-gray-700 font-medium">Followers</div>
                          </div>
                        )}
                        {provider.totalViews > 0 && (
                          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                            <div className="text-24 font-bold text-green-600 mb-1">{provider.totalViews}</div>
                            <div className="text-14 text-gray-700 font-medium">Views</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Floating Booking Card - 1/3 width */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <CardWrapper padding="lg" className="shadow-lg">
                  {/* Provider Name */}
                  <Typography variant="h4" className="mb-4">
                    {provider.name}
                  </Typography>

                  {/* Rating */}
                  <div className="mb-6">
                    <RatingDisplay
                      rating={provider.rating || 0}
                      count={provider.totalReviews}
                      showCount={true}
                      size="md"
                      format="default"
                      variant="default"
                    />
                  </div>

                  {/* Book Now Button */}
                  <Button
                    variant="brand"
                    size="md"
                    onClick={() => router.push(`/provider/${providerId}/booking`)}
                    className="w-full mb-4 !text-white font-semibold"
                  >
                    Book now
                  </Button>

                  {/* Open Store and Linkee Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => router.push(`/provider/${providerId}/store`)}
                      className="flex items-center justify-center gap-2"
                    >
                      <Store className="h-4 w-4" />
                      Open Store
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => router.push(`/provider/${providerId}/links`)}
                      className="flex items-center justify-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Linkee
                    </Button>
                  </div>

                  {/* Operating Hours */}
                  {provider.openingHours.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            {(() => {
                              const today = new Date().getDay()
                              const todaySchedule = provider.openingHours.find(
                                (schedule, index) => index === today || schedule.day.toLowerCase() === ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today].toLowerCase()
                              )
                              if (todaySchedule && todaySchedule.hours !== 'Closed') {
                                const endTime = todaySchedule.end
                                if (endTime) {
                                  const time = new Date(endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                                  return (
                                    <Typography variant="bodySmall" className="font-semibold text-brand-600">
                                      Open until {time}
                                    </Typography>
                                  )
                                }
                              }
                              return (
                                <Typography variant="bodySmall" className="font-medium text-gray-700">
                                  Check hours
                                </Typography>
                              )
                            })()}
                          </div>
                          <button
                            onClick={() => setIsHoursExpanded(!isHoursExpanded)}
                            className="flex items-center gap-1 text-12 text-brand-600 hover:text-brand-700 font-medium transition-colors"
                          >
                            {isHoursExpanded ? 'Hide hours' : 'View all hours'}
                            {isHoursExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>

                          {/* Expanded Hours List */}
                          {isHoursExpanded && (
                            <div className="mt-3 space-y-2">
                              {provider.openingHours.map((schedule, index) => {
                                const today = new Date().getDay()
                                const isToday = index === today || schedule.day.toLowerCase() === ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today].toLowerCase()
                                const isClosed = schedule.hours === 'Closed' || !schedule.hours

                                return (
                                  <div
                                    key={`${schedule.day}-${index}`}
                                    className={cn(
                                      "flex items-center justify-between py-2 px-3 rounded-lg transition-colors",
                                      isToday && "bg-brand-50"
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Typography
                                        variant="bodySmall"
                                        className={cn(
                                          "font-medium",
                                          isToday ? "text-brand-900 font-semibold" : "text-gray-700"
                                        )}
                                      >
                                        {schedule.day}
                                      </Typography>
                                      {isToday && (
                                        <Badge variant="secondary" size="sm" className="bg-brand-500 text-white border-0">
                                          Today
                                        </Badge>
                                      )}
                                    </div>
                                    <Typography
                                      variant="bodySmall"
                                      className={cn(
                                        "font-semibold",
                                        isClosed ? "text-red-600" : isToday ? "text-brand-900" : "text-gray-900"
                                      )}
                                    >
                                      {schedule.hours || 'Closed'}
                                    </Typography>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {provider.address && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-start gap-3 mb-2">
                        <MapPin className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
                        <Typography variant="bodySmall" className="flex-1 text-gray-700">
                          {provider.fullAddress || provider.address}
                        </Typography>
                      </div>
                      <button
                        onClick={() => {
                          // Open maps with address
                          const address = encodeURIComponent(provider.fullAddress || provider.address)
                          window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
                        }}
                        className="text-14 text-brand-600 hover:text-brand-700 font-medium transition-colors"
                      >
                        Get directions
                      </button>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="pt-4 space-y-3">
                    {provider.totalServices > 0 && (
                      <div className="flex items-center justify-between">
                        <Typography variant="bodySmall" textColor="secondary">
                          Services
                        </Typography>
                        <Typography variant="bodySmall" className="font-semibold">
                          {provider.totalServices}
                        </Typography>
                      </div>
                    )}
                    {provider.totalProducts > 0 && (
                      <div className="flex items-center justify-between">
                        <Typography variant="bodySmall" textColor="secondary">
                          Products
                        </Typography>
                        <Typography variant="bodySmall" className="font-semibold">
                          {provider.totalProducts}
                        </Typography>
                      </div>
                    )}
                    {provider.totalReviews > 0 && (
                      <div className="flex items-center justify-between">
                        <Typography variant="bodySmall" textColor="secondary">
                          Reviews
                        </Typography>
                        <Typography variant="bodySmall" className="font-semibold">
                          {provider.totalReviews}
                        </Typography>
                      </div>
                    )}
                  </div>
                </CardWrapper>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Branch Portfolio Modal */}
      {selectedBranchForPortfolio && (
        <PortfolioModal
          isOpen={!!selectedBranchForPortfolio}
          onClose={() => setSelectedBranchForPortfolio(null)}
          branchData={branchPortfolio}
          title={selectedBranchForPortfolio.name}
          subtitle="Branch Portfolio"
        />
      )}

      {/* Team Member Portfolio Modal */}
      {selectedTeamMemberForPortfolio && (
        <PortfolioModal
          isOpen={!!selectedTeamMemberForPortfolio}
          onClose={() => setSelectedTeamMemberForPortfolio(null)}
          branchData={teamMemberPortfolio}
          title={selectedTeamMemberForPortfolio.name}
          subtitle={formatRole(selectedTeamMemberForPortfolio.role) || undefined}
        />
      )}
    </div>
  )
}
