'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'
import {
  Star,
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
  ImageIcon,
  Store,
  ThumbsUp,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, ErrorDisplay } from '@/components/ui'
import { cn } from '@/lib/utils'
import { formatRole } from '@/utils/role'
import { useProviderBranchPortfolio, useProviderTeamMemberPortfolio } from '@/hooks/providers/useProviderPortfolio'
import { useProviderPublicProfile } from '@/hooks/providers/useProviderPublicProfile'
import { useToggleProviderFollow, useToggleProviderFavorite } from '@/hooks/providers/useProviderInteractions'
import { useFavoriteItems, useFollowItems } from '@/hooks'
import { useToast } from '@/components/ui/Toaster'
import { PortfolioModal } from '@/components/ui/PortfolioModal'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { RatingDisplay } from '@/components/ui/RatingDisplay'
import { DEFAULT_CURRENCY } from '@/utils/currency'

interface ProviderProfileClientProps {
  providerId: string
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
      const providerDataAny = providerData as any
      if (providerDataAny.isFollowed !== undefined) {
        setIsFollowed(providerDataAny.isFollowed)
      }
      if (providerDataAny.isFavorite !== undefined) {
        setIsFavorite(providerDataAny.isFavorite)
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

  // Scroll-based tab selection using Intersection Observer
  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section-id')
          if (sectionId && sectionId !== activeTab) {
            setActiveTab(sectionId as typeof activeTab)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all section refs
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [activeTab])

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
          <LoadingSpinner size="lg" />
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

                return isValidPhoto ? (
                  <Image
                    src={currentPhoto}
                    alt={`${provider.name} - Photo ${currentPhotoIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1200px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-24 w-24 text-gray-400" />
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
              ).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    const section = sectionRefs.current[tab.id]
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className={cn(
                    'py-4 text-14 md:text-16 font-medium transition-colors relative whitespace-nowrap flex-shrink-0',
                    activeTab === tab.id
                      ? 'text-brand-600'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
                  )}
                </button>
              ))}
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
                                {service.image && (
                                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                    <Image
                                      src={service.image}
                                      alt={service.name}
                                      fill
                                      className="object-cover"
                                      sizes="80px"
                                    />
                                  </div>
                                )}
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
                                    {service.rate && service.rate > 0 && (
                                      <RatingDisplay
                                        rating={service.rate}
                                        size="xs"
                                        format="stars-only"
                                        variant="compact"
                                      />
                                    )}
                                    {service.availableStartTime && service.availableEndTime && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {service.availableStartTime} - {service.availableEndTime}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <PriceDisplay
                                  original={originalPrice}
                                  discounted={displayPrice}
                                  currency={DEFAULT_CURRENCY}
                                  size="md"
                                  variant="compact"
                                  showOriginal={service.hasDiscount}
                                />
                                {service.onSale && (
                                  <span className="px-2 py-1 bg-red-100 text-red-600 text-12 font-semibold rounded">
                                    On Sale
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="brand"
                              size="md"
                              onClick={() => handleBookService(service.id)}
                              className="ml-4 !text-white flex-shrink-0"
                            >
                              Book
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <p className="text-gray-500">No services available</p>
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
                            return imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
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
                    <p className="text-gray-500">No products available</p>
                  </div>
                )}
              </div>

              {/* Branches Section */}
              {provider.branches.length > 0 && (
                <div
                  ref={el => { sectionRefs.current['branches'] = el }}
                  data-section-id="branches"
                  className="scroll-mt-32"
                >
                  <h2 className="text-24 font-semibold text-gray-900 mb-6">
                    Branches
                  </h2>
                  <div className="space-y-3">
                    {provider.branches.map(branch => (
                      <div
                        key={branch.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-16 font-semibold text-gray-900 mb-2">
                              {branch.name}
                            </h3>
                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2 text-14 text-gray-600">
                                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span>{branch.address}</span>
                              </div>
                              {branch.phone && (
                                <div className="flex items-center gap-2 text-14 text-gray-600">
                                  <Phone className="h-4 w-4 flex-shrink-0" />
                                  <span>{branch.phone}</span>
                                </div>
                              )}
                              {branch.isOpen !== undefined && (
                                <div className="flex items-center gap-2 text-14">
                                  <Clock className="h-4 w-4 flex-shrink-0" />
                                  <span
                                    className={
                                      branch.isOpen
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }
                                  >
                                    {branch.isOpen ? 'Open' : 'Closed'}
                                  </span>
                                </div>
                              )}
                              {branch.rate && branch.rate > 0 && (
                                <div className="flex items-center gap-2 text-14">
                                  <RatingDisplay
                                    rating={branch.rate}
                                    size="xs"
                                    format="stars-only"
                                    variant="compact"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
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
                    ))}
                  </div>
                </div>
              )}

              {/* Team Section */}
              {provider.team.length > 0 && (
                <div
                  ref={el => { sectionRefs.current['team'] = el }}
                  data-section-id="team"
                  className="scroll-mt-32"
                >
                  <h2 className="text-24 font-semibold text-gray-900 mb-6">
                    Team
                  </h2>
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
                </div>
              )}

              {/* Reviews Section */}
              {provider.reviews.length > 0 && (
                <div
                  ref={el => { sectionRefs.current['reviews'] = el }}
                  data-section-id="reviews"
                  className="scroll-mt-32"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-24 font-semibold text-gray-900">
                      Reviews
                    </h2>
                    <RatingDisplay
                      rating={provider.averageRating || provider.rating}
                      count={provider.totalReviews}
                      showCount={true}
                      size="md"
                      format="default"
                      variant="default"
                    />
                  </div>
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
                </div>
              )}

              {/* About Section */}
              {provider.description && (
                <div
                  ref={el => { sectionRefs.current['about'] = el }}
                  data-section-id="about"
                  className="scroll-mt-32"
                >
                  <h2 className="text-24 font-semibold text-gray-900 mb-4">
                    About
                  </h2>
                  <p className="text-16 text-gray-700 leading-relaxed">
                    {provider.description}
                  </p>
                </div>
              )}

              {/* Location Section */}
              <div
                ref={el => { sectionRefs.current['location'] = el }}
                data-section-id="location"
                className="scroll-mt-32"
              >
                <h2 className="text-24 font-semibold text-gray-900 mb-6">
                  Location
                </h2>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-14 text-gray-700 mb-1">
                          {provider.fullAddress || provider.address}
                        </p>
                        {provider.neighborhood && (
                          <p className="text-12 text-gray-500">
                            {provider.neighborhood}
                          </p>
                        )}
                      </div>
                    </div>
                    {provider.address && (
                      <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100">
                        {/* Map placeholder - you can integrate Google Maps here */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Map view coming soon</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <Button variant="outline" size="md" className="w-full">
                      Get Directions
                    </Button>
                  </div>
                </div>
              </div>

              {/* Opening Times Section */}
              {provider.openingHours.length > 0 && (
                <div
                  ref={el => { sectionRefs.current['opening-times'] = el }}
                  data-section-id="opening-times"
                  className="scroll-mt-32"
                >
                  <h2 className="text-24 font-semibold text-gray-900 mb-6">
                    Opening Times
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="space-y-2">
                      {provider.openingHours.map((schedule, index) => (
                        <div
                          key={`${schedule.day}-${index}`}
                          className="flex items-center justify-between text-14 py-2 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-gray-600 font-medium">
                            {schedule.day}
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Links Section */}
              {provider.links.length > 0 && (
                <div
                  ref={el => { sectionRefs.current['links'] = el }}
                  data-section-id="links"
                  className="scroll-mt-32"
                >
                  <h2 className="text-24 font-semibold text-gray-900 mb-6">
                    Links
                  </h2>
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
                  {provider.links.filter(link => link.isPublic && link.url).length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                      <p className="text-gray-500">No public links available</p>
                    </div>
                  )}
                </div>
              )}

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
                    <div>
                      <h3 className="text-18 font-semibold text-gray-900 mb-3">
                        Payment Methods
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.paymentMethods.map((method, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-14 rounded-full"
                          >
                            {(method as any).name || (method as any).paymentMethodName || 'Payment Method'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-18 font-semibold text-gray-900 mb-3">
                      Contact
                    </h3>
                    <div className="space-y-2">
                      {provider.phoneNumber && (
                        <div className="flex items-center gap-2 text-14 text-gray-700">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a href={`tel:${provider.phoneNumber}`} className="hover:text-brand-600">
                            {provider.phoneNumber}
                          </a>
                        </div>
                      )}
                      {provider.links.filter(link => link.isPublic && link.url && link.url.includes('mailto:')).length > 0 && (
                        <div className="flex items-center gap-2 text-14 text-gray-700">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <a
                            href={provider.links.find(link => link.url?.includes('mailto:'))?.url || '#'}
                            className="hover:text-brand-600"
                          >
                            Email
                          </a>
                        </div>
                      )}
                      {provider.links.filter(link => link.isPublic && link.url && link.url.startsWith('http')).length > 0 && (
                        <div className="flex items-center gap-2 text-14 text-gray-700">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <a
                            href={provider.links.find(link => link.url?.startsWith('http'))?.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-brand-600"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h3 className="text-18 font-semibold text-gray-900 mb-3">
                      Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {provider.totalServices > 0 && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-20 font-bold text-brand-600">{provider.totalServices}</div>
                          <div className="text-12 text-gray-600">Services</div>
                        </div>
                      )}
                      {provider.totalProducts > 0 && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-20 font-bold text-brand-600">{provider.totalProducts}</div>
                          <div className="text-12 text-gray-600">Products</div>
                        </div>
                      )}
                      {provider.totalFollowers > 0 && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-20 font-bold text-brand-600">{provider.totalFollowers}</div>
                          <div className="text-12 text-gray-600">Followers</div>
                        </div>
                      )}
                      {provider.totalViews > 0 && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-20 font-bold text-brand-600">{provider.totalViews}</div>
                          <div className="text-12 text-gray-600">Views</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Booking Card - 1/3 width */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                  {/* Provider Name */}
                  <h2 className="text-24 font-bold text-gray-900 mb-4">
                    {provider.name}
                  </h2>

                  {/* Rating */}
                  <div className="mb-6">
                    <RatingDisplay
                      rating={provider.rating}
                      count={provider.totalReviews}
                      showCount={true}
                      size="md"
                      format="default"
                      variant="default"
                    />
                  </div>

                  {/* Book Now Button */}
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => router.push(`/provider/${providerId}/booking`)}
                    className="w-full mb-3 !bg-brand-600 hover:!bg-brand-700 !text-white font-semibold"
                  >
                    Book now
                  </Button>

                  {/* Open Store and Likes Buttons */}
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
                      <span>Linkee</span>
                    </Button>
                  </div>

                  {/* Operating Hours */}
                  {provider.openingHours.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2 text-14 text-gray-700">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <div className="font-medium">
                            {(() => {
                              const today = new Date().getDay()
                              const todaySchedule = provider.openingHours.find(
                                (schedule, index) => index === today || schedule.day.toLowerCase() === ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today].toLowerCase()
                              )
                              if (todaySchedule && todaySchedule.hours !== 'Closed') {
                                const endTime = todaySchedule.end
                                if (endTime) {
                                  const time = new Date(endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                                  return `Open until ${time}`
                                }
                              }
                              return 'Check hours'
                            })()}
                          </div>
                          <button className="text-12 text-brand-600 hover:text-brand-700 mt-1">
                            View all hours
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {provider.address && (
                    <div className="mb-4">
                      <div className="flex items-start gap-2 text-14 text-gray-700 mb-2">
                        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <span className="flex-1">{provider.fullAddress || provider.address}</span>
                      </div>
                      <button
                        onClick={() => {
                          // Open maps with address
                          const address = encodeURIComponent(provider.fullAddress || provider.address)
                          window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
                        }}
                        className="text-14 text-brand-600 hover:text-brand-700 font-medium"
                      >
                        Get directions
                      </button>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    {provider.totalServices > 0 && (
                      <div className="flex items-center justify-between text-14">
                        <span className="text-gray-600">Services</span>
                        <span className="font-semibold text-gray-900">{provider.totalServices}</span>
                      </div>
                    )}
                    {provider.totalProducts > 0 && (
                      <div className="flex items-center justify-between text-14">
                        <span className="text-gray-600">Products</span>
                        <span className="font-semibold text-gray-900">{provider.totalProducts}</span>
                      </div>
                    )}
                    {provider.totalReviews > 0 && (
                      <div className="flex items-center justify-between text-14">
                        <span className="text-gray-600">Reviews</span>
                        <span className="font-semibold text-gray-900">{provider.totalReviews}</span>
                      </div>
                    )}
                  </div>
                </div>
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
