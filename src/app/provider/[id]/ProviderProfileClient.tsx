'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, ErrorDisplay } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useProviderBranchPortfolio, useProviderTeamMemberPortfolio } from '@/hooks/providers/useProviderPortfolio'
import { useProviderDetail } from '@/hooks/providers/useProviderDetail'
import { PortfolioModal } from '@/components/ui/PortfolioModal'

interface ProviderProfileClientProps {
  providerId: string
}

// All data now comes from API - no mock data needed

export function ProviderProfileClient({
  providerId,
}: ProviderProfileClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services')
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [selectedBranchForPortfolio, setSelectedBranchForPortfolio] = useState<{ id: string; name: string } | null>(null)
  const [selectedTeamMemberForPortfolio, setSelectedTeamMemberForPortfolio] = useState<{ id: string; name: string; role: string } | null>(null)

  // Fetch provider data from API - MUST be called before any conditional returns
  const { data: providerData, isLoading, error } = useProviderDetail(parseInt(providerId))

  // Fetch portfolio data for modals - MUST be called before any conditional returns
  const { data: branchPortfolio } = useProviderBranchPortfolio(
    parseInt(providerId),
    selectedBranchForPortfolio ? parseInt(selectedBranchForPortfolio.id) : 0,
    { enabled: !!selectedBranchForPortfolio }
  )

  const { data: teamMemberPortfolio } = useProviderTeamMemberPortfolio(
    parseInt(providerId),
    selectedTeamMemberForPortfolio?.id || '',
    { enabled: !!selectedTeamMemberForPortfolio }
  )

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

  // Extract data from API response
  const provider = {
    id: providerData.id.toString(),
    name: providerData.nameEn || providerData.nameAr || 'Provider',
    nameAr: providerData.nameAr || '',
    type: providerData.serviceClasses || 'Service Provider',
    rating: providerData.rate || 0,
    totalReviews: providerData.reviews?.length || 0,
    address: providerData.shortAddress || '',
    neighborhood: providerData.shortAddress || '',
    isVerified: providerData.providerStatus === 'Active',
    openUntil: '10:00 PM', // Not in API
    isOpen: true, // Not in API
    photos: providerData.media?.map(m => m.url || m.thumbnailUrl).filter(Boolean) || [],
    description: providerData.descriptionEn || providerData.descriptionAr || '',
    phoneNumber: providerData.phoneNumber || '',
    phoneNumber2: providerData.phoneNumber2 || '',
    profileURL: providerData.profileURL || '',
    branches: (providerData.branches || []).map(branch => ({
      id: branch.id?.toString() || '',
      name: branch.nameEn || branch.nameAr || 'Branch',
      address: branch.address?.displayAddress || branch.address?.fullAddress || '',
      phone: providerData.phoneNumber || '',
      isOpen: true,
      openUntil: '10:00 PM',
    })),
    reviews: (providerData.reviews || []).map(review => ({
      id: review.id?.toString() || '',
      userName: 'User', // User info not in ReviewResponse
      date: review.creationDate ? new Date(review.creationDate).toLocaleDateString() : '',
      rating: review.rate || 0,
      text: review.comment || '',
    })),
    links: providerData.links || [],
    workingTimes: providerData.workingTimes || [],
    services: [] as Array<{ id: string; name: string; duration: number; price: number; currency: string }>, // Services come from separate endpoint
    team: [] as Array<{ id: string; name: string; role: string; avatar: string; rating: number }>, // Team members come from separate endpoint
    products: [] as Array<{ id: string; name: string; image: string; price: number; currency: string; inStock: boolean }>, // Products come from separate endpoint
    openingHours: (providerData.workingTimes || []).map(wt => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return {
        day: days[wt.dayOfWeek] || '',
        hours: wt.start && wt.end ? `${new Date(wt.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${new Date(wt.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : 'Closed',
      }
    }),
    amenities: [] as string[], // Amenities not in API yet
  }

  const handleBookService = (serviceId: string) => {
    // Navigate to booking page with service pre-selected
    router.push(`/provider/${providerId}/booking?service=${serviceId}`)
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex(prev => (prev + 1) % provider.photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex(
      prev => (prev - 1 + provider.photos.length) % provider.photos.length
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
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {provider.rating}
                    </span>
                    <span>({provider.totalReviews.toLocaleString()})</span>
                  </div>
                  <span>•</span>
                  <span
                    className={
                      provider.isOpen ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {provider.isOpen
                      ? `Open until ${provider.openUntil}`
                      : 'Closed'}
                  </span>
                  <span>•</span>
                  <span>{provider.neighborhood}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-[400px] md:h-[500px]">
              <Image
                src={provider.photos[currentPhotoIndex]}
                alt={`${provider.name} - Photo ${currentPhotoIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />

              {/* Navigation Arrows */}
              {provider.photos.length > 1 && (
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
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-12 font-medium">
                {currentPhotoIndex + 1} / {provider.photos.length}
              </div>

              {/* Thumbnail Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {provider.photos.map((_, index) => (
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
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="container-custom">
            <div className="flex items-center gap-8 overflow-x-auto">
              {(
                [
                  { id: 'services' as const, label: 'Services' },
                  { id: 'products' as const, label: 'Products' },
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'py-4 text-16 font-medium transition-colors relative whitespace-nowrap',
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

        {/* Content */}
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Services Tab Content */}
              {activeTab === 'services' && (
                <>
                  {/* Services Section */}
                  {provider.services.length > 0 && (
                    <div>
                      <h2 className="text-24 font-semibold text-gray-900 mb-6">
                        Services
                      </h2>
                      <div className="space-y-3">
                        {provider.services.map(service => (
                          <div
                            key={service.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="text-16 font-semibold text-gray-900 mb-1">
                                  {service.name}
                                </h3>
                                <div className="flex items-center gap-3 text-14 text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {service.duration} min
                                  </span>
                                  <span className="font-semibold text-gray-900">
                                    {service.currency} {service.price}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="brand"
                                size="md"
                                onClick={() => handleBookService(service.id)}
                                className="ml-4 !text-white"
                              >
                                Book
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Branches Section */}
                  {provider.branches.length > 0 && (
                    <div>
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
                                  <div className="flex items-center gap-2 text-14">
                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                    <span
                                      className={
                                        branch.isOpen
                                          ? 'text-green-600'
                                          : 'text-red-600'
                                      }
                                    >
                                      {branch.isOpen
                                        ? `Open until ${branch.openUntil}`
                                        : 'Closed'}
                                    </span>
                                  </div>
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
                    <div>
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
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={member.avatar}
                                  alt={member.name}
                                  fill
                                  className="rounded-full object-cover"
                                  sizes="64px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-16 font-semibold text-gray-900 mb-1 truncate">
                                  {member.name}
                                </h3>
                                <p className="text-14 text-gray-600 mb-2 truncate">
                                  {member.role}
                                </p>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-14 font-semibold text-gray-900">
                                    {member.rating}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTeamMemberForPortfolio({ id: member.id, name: member.name, role: member.role })}
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
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-24 font-semibold text-gray-900">
                          Reviews
                        </h2>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-18 font-semibold text-gray-900">
                            {provider.rating}
                          </span>
                          <span className="text-14 text-gray-600">
                            ({provider.totalReviews})
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {provider.reviews.map(review => (
                          <div
                            key={review.id}
                            className="bg-white border border-gray-200 rounded-xl p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="text-16 font-semibold text-gray-900">
                                  {review.userName}
                                </h4>
                                <p className="text-12 text-gray-500">
                                  {review.date}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-14 font-semibold text-gray-900">
                                  {review.rating}
                                </span>
                              </div>
                            </div>
                            <p className="text-14 text-gray-700 leading-relaxed">
                              {review.text}
                            </p>
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
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-24 font-semibold text-gray-900 mb-4">
                        About
                      </h2>
                      <p className="text-16 text-gray-700 leading-relaxed">
                        {provider.description}
                      </p>
                    </div>

                    {provider.openingHours.length > 0 && (
                      <div>
                        <h3 className="text-20 font-semibold text-gray-900 mb-4">
                          Opening Hours
                        </h3>
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                          <div className="space-y-2">
                            {provider.openingHours.map((schedule, index) => (
                              <div
                                key={`${schedule.day}-${index}`}
                                className="flex items-center justify-between text-14"
                              >
                                <span className="text-gray-600">
                                  {schedule.day}
                                </span>
                                <span className="text-gray-900 font-medium">
                                  {schedule.hours}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {provider.amenities.length > 0 && (
                      <div>
                        <h3 className="text-20 font-semibold text-gray-900 mb-4">
                          Amenities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {provider.amenities.map((amenity, index) => (
                            <span
                              key={`${amenity}-${index}`}
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-14 rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Products Tab Content */}
              {activeTab === 'products' && (
                <div>
                  <h2 className="text-24 font-semibold text-gray-900 mb-6">
                    Products
                  </h2>
                  {provider.products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {provider.products.map(product => (
                        <div
                          key={product.id}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="relative w-full aspect-square">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 33vw"
                            />
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
                            <div className="flex items-center justify-between">
                              <span className="text-16 font-semibold text-brand-600">
                                {product.currency} {product.price}
                              </span>
                              <Button
                                variant="brand"
                                size="sm"
                                disabled={!product.inStock}
                                className="!text-white"
                              >
                                {product.inStock ? 'Add to Cart' : 'Sold Out'}
                              </Button>
                            </div>
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
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Location Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-18 font-semibold text-gray-900 mb-4">
                    Location
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-14 text-gray-700">
                        {provider.address}
                      </p>
                    </div>
                    <Button variant="outline" size="md" className="w-full">
                      Get Directions
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-18 font-semibold text-gray-900 mb-4">
                    Contact
                  </h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </Button>
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
          portfolio={branchPortfolio || []}
          title={selectedBranchForPortfolio.name}
          subtitle="Branch Portfolio"
        />
      )}

      {/* Team Member Portfolio Modal */}
      {selectedTeamMemberForPortfolio && (
        <PortfolioModal
          isOpen={!!selectedTeamMemberForPortfolio}
          onClose={() => setSelectedTeamMemberForPortfolio(null)}
          portfolio={teamMemberPortfolio || []}
          title={selectedTeamMemberForPortfolio.name}
          subtitle={selectedTeamMemberForPortfolio.role}
        />
      )}
    </div>
  )
}
