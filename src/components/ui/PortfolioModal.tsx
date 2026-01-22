'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Clock, Phone, MapPin, ImageIcon, Mail, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaResponse } from '@/types/responses'
import type { BranchPortfolioResponse } from '@/types/responses/branch-portfolio-response'
import { Button } from './Button'
import { PriceDisplay } from './PriceDisplay'
import { RatingDisplay } from './RatingDisplay'
import { Typography } from './Typography'
import { CardWrapper } from './CardWrapper'
import { Badge } from './Badge'
import { EmptyState } from './EmptyState'
import { DEFAULT_CURRENCY } from '@/utils/currency'

interface PortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  portfolio?: MediaResponse[] // For backward compatibility
  branchData?: BranchPortfolioResponse // New full response
  title: string
  subtitle?: string
}

type TabType = 'about' | 'services' | 'portfolio' | 'reviews'

export function PortfolioModal({
  isOpen,
  onClose,
  portfolio,
  branchData,
  title,
  subtitle,
}: PortfolioModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('about')
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  if (!isOpen) return null

  // Use branchData if available, otherwise fall back to portfolio array
  const portfolioImages = branchData?.portfolio || portfolio || []
  const about = branchData?.about
  const services = branchData?.services || []
  const reviews = branchData?.reviews
  const statistics = branchData?.statistics

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handleCloseImageViewer = () => {
    setSelectedImageIndex(null)
  }

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < portfolioImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  const formatDuration = (duration: string) => {
    // Format "02:06:00" to "2h 6m" or "00:30:00" to "30 min"
    const parts = duration.split(':')
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes} min`
  }

  return (
    <>
      {/* Main Portfolio Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col">
          {/* Header with Profile */}
          <div className="flex items-start gap-4 p-6">
            <div className="flex-shrink-0">
              {about?.imageUrl && about.imageUrl.trim() !== '' ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={about.imageUrl}
                    alt={about.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center border-2 border-brand-200">
                  <span className="text-24 font-semibold text-brand-600">
                    {about?.name?.charAt(0) || title?.charAt(0) || '?'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Typography variant="h4" className="truncate">
                {about?.name || title}
              </Typography>
              {subtitle && (
                <Typography variant="bodySmall" textColor="secondary" className="mt-1">
                  {subtitle}
                </Typography>
              )}
              {about && 'jobTitle' in about && typeof about.jobTitle === 'string' && (
                <Typography variant="bodySmall" textColor="secondary" className="mt-1">
                  {about.jobTitle}
                </Typography>
              )}
              {reviews && reviews.averageRating !== null && reviews.averageRating > 0 && (
                <div className="mt-2">
                  <RatingDisplay
                    rating={reviews.averageRating}
                    count={reviews.totalReviews}
                    showCount={true}
                    size="sm"
                    format="default"
                    variant="compact"
                  />
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="flex-shrink-0"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex items-center w-full border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {[
              { id: 'about' as const, label: 'About' },
              { id: 'services' as const, label: 'Services' },
              { id: 'portfolio' as const, label: 'Portfolio' },
              { id: 'reviews' as const, label: `Reviews${reviews && reviews.totalReviews > 0 ? ` ${reviews.totalReviews}` : ''}` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 px-4 py-3 text-14 font-medium transition-colors relative whitespace-nowrap text-center',
                  activeTab === tab.id
                    ? 'text-brand-500'
                    : 'text-gray-600 hover:text-brand-500'
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="p-6 space-y-6">
                {about && (
                  <>
                    {about.description && (
                      <div>
                        <Typography variant="h5" className="mb-2">Description</Typography>
                        <Typography variant="bodySmall" className="leading-relaxed">
                          {about.description}
                        </Typography>
                      </div>
                    )}

                    {statistics && (
                      <div>
                        <Typography variant="h5" className="mb-3">Statistics</Typography>
                        <div className="space-y-3">
                          <CardWrapper padding="sm" className="flex items-center justify-between">
                            <Typography variant="bodySmall">Appointments completed</Typography>
                            <Typography variant="body" className="font-semibold text-brand-600">
                              {statistics.appointmentsCompleted.toLocaleString()}
                            </Typography>
                          </CardWrapper>
                          <CardWrapper padding="sm" className="flex items-center justify-between">
                            <Typography variant="bodySmall">Clients served</Typography>
                            <Typography variant="body" className="font-semibold text-brand-600">
                              {statistics.clientsServed.toLocaleString()}
                            </Typography>
                          </CardWrapper>
                        </div>
                      </div>
                    )}

                    {about.address && (
                      <div>
                        <Typography variant="h5" className="mb-3">Location</Typography>
                        <CardWrapper padding="md">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <Typography variant="body" className="font-medium mb-1">
                                {about.address.fullAddress || about.address.displayAddress || about.address.displayName || about.address.nameEn || about.address.nameAr}
                              </Typography>
                              {(about.address.addressEn || about.address.addressAr) && (
                                <Typography variant="bodySmall" textColor="secondary">
                                  {about.address.addressEn || about.address.addressAr}
                                </Typography>
                              )}
                              {about.address.street && (
                                <Typography variant="bodySmall" textColor="secondary" className="mt-1">
                                  {about.address.street}
                                  {about.address.building && `, ${about.address.building}`}
                                  {about.address.floor && `, Floor ${about.address.floor}`}
                                  {about.address.apartment && `, Apt ${about.address.apartment}`}
                                </Typography>
                              )}
                              {(about.address.cityName || about.address.regionName || about.address.countryName) && (
                                <Typography variant="bodySmall" textColor="secondary" className="mt-1">
                                  {[about.address.cityName, about.address.regionName, about.address.countryName].filter(Boolean).join(', ')}
                                </Typography>
                              )}
                              {about.address.postalCode && (
                                <Typography variant="bodySmall" textColor="secondary" className="mt-1">
                                  Postal Code: {about.address.postalCode}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </CardWrapper>
                      </div>
                    )}

                    {(about.phoneNumber || about.phoneNumber2 || ('email' in about && typeof about.email === 'string')) && (
                      <div>
                        <Typography variant="h5" className="mb-3">Contact</Typography>
                        <CardWrapper padding="md">
                          <div className="space-y-3">
                            {about.phoneNumber && (
                              <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-brand-500 flex-shrink-0" />
                                <a href={`tel:${about.phoneNumber}`} className="hover:text-brand-500 transition-colors">
                                  <Typography variant="bodySmall">{about.phoneNumber}</Typography>
                                </a>
                              </div>
                            )}
                            {about.phoneNumber2 && (
                              <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-brand-500 flex-shrink-0" />
                                <a href={`tel:${about.phoneNumber2}`} className="hover:text-brand-500 transition-colors">
                                  <Typography variant="bodySmall">{about.phoneNumber2}</Typography>
                                </a>
                              </div>
                            )}
                            {'email' in about && typeof about.email === 'string' && about.email && (
                              <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-brand-500 flex-shrink-0" />
                                <a href={`mailto:${about.email}`} className="hover:text-brand-500 transition-colors">
                                  <Typography variant="bodySmall">{about.email}</Typography>
                                </a>
                              </div>
                            )}
                          </div>
                        </CardWrapper>
                      </div>
                    )}

                    {statistics && 'languages' in statistics && Array.isArray(statistics.languages) && statistics.languages.length > 0 && (
                      <div>
                        <Typography variant="h5" className="mb-3">Languages</Typography>
                        <div className="flex flex-wrap gap-2">
                          {statistics.languages.map((lang: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              size="md"
                              className="px-4 py-2 bg-brand-50 text-brand-700 border-brand-200"
                            >
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="p-6">
                <Typography variant="h4" className="mb-4">Services</Typography>
                {services.length > 0 ? (
                  <div className="space-y-3">
                    {services.map(service => (
                      <CardWrapper
                        key={service.id}
                        padding="md"
                        className="flex items-center justify-between hover:border-brand-300 hover:shadow-md transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                              {service.imageUrl && service.imageUrl.trim() !== '' ? (
                                <Image
                                  src={service.imageUrl}
                                  alt={service.name || 'Service image'}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <Store className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Typography variant="h6" className="mb-1">{service.name}</Typography>
                              {service.description && (
                                <Typography variant="bodySmall" textColor="secondary" className="mb-2 line-clamp-2">
                                  {service.description}
                                </Typography>
                              )}
                              {service.duration && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <Typography variant="bodySmall" textColor="secondary">
                                    {formatDuration(service.duration)}
                                  </Typography>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                          <Button
                            variant="brand"
                            size="sm"
                            className="!text-white"
                          >
                            Book
                          </Button>
                          <PriceDisplay
                            discounted={service.price}
                            currency={DEFAULT_CURRENCY}
                            size="md"
                            variant="compact"
                          />
                        </div>
                      </CardWrapper>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No services available"
                    description="This professional doesn't have any services listed yet."
                  />
                )}
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="p-6">
                <Typography variant="h4" className="mb-4">Portfolio</Typography>
                {portfolioImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {portfolioImages.map((media, index) => {
                      const imageUrl = media.url || media.thumbnailUrl || media.previewUrl
                      return imageUrl && imageUrl.trim() !== '' ? (
                        <button
                          key={media.id || index}
                          onClick={() => handleImageClick(index)}
                          className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-gray-200 hover:border-brand-300 transition-all"
                        >
                          <Image
                            src={imageUrl}
                            alt={media.alt || `Portfolio image ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 640px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </button>
                      ) : null
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                    <Typography variant="body" textColor="secondary" className="text-center">
                      This professional doesn&apos;t have a portfolio yet.
                    </Typography>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Typography variant="h4">Reviews</Typography>
                  {reviews && reviews.averageRating !== null && reviews.averageRating > 0 && (
                    <RatingDisplay
                      rating={reviews.averageRating}
                      count={reviews.totalReviews}
                      showCount={true}
                      size="md"
                      format="default"
                      variant="default"
                    />
                  )}
                </div>
                {reviews && reviews.items.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.items.map((review, index) => (
                      <CardWrapper
                        key={review.id || index}
                        padding="md"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <Typography variant="bodySmall" className="text-white font-semibold">
                                  {review.userName?.charAt(0).toUpperCase() || 'U'}
                                </Typography>
                              </div>
                              <div>
                                <Typography variant="bodySmall" className="font-semibold">
                                  {review.userName || 'Anonymous'}
                                </Typography>
                                {review.date && (
                                  <Typography variant="bodyTiny" textColor="secondary">
                                    {review.date}
                                  </Typography>
                                )}
                              </div>
                            </div>
                          </div>
                          <RatingDisplay
                            rating={review.rating || 0}
                            size="sm"
                            format="stars-only"
                            variant="compact"
                          />
                        </div>
                        {review.title && (
                          <Typography variant="bodySmall" className="font-semibold mb-1">
                            {review.title}
                          </Typography>
                        )}
                        {review.text && (
                          <Typography variant="bodySmall" className="leading-relaxed">
                            {review.text}
                          </Typography>
                        )}
                      </CardWrapper>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No reviews yet"
                    description="This professional doesn't have any reviews yet."
                  />
                )}
              </div>
            )}
          </div>

          {/* Book Now Button */}
          <div className="p-6 border-t border-gray-200">
            <Button
              variant="brand"
              size="md"
              className="w-full !text-white font-semibold"
              onClick={onClose}
            >
              Book now
            </Button>
          </div>
        </div>
      </div>

      {/* Full Image Viewer */}
      {selectedImageIndex !== null && portfolioImages[selectedImageIndex] && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseImageViewer}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white border-0 z-10"
            aria-label="Close image viewer"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation Buttons */}
          {selectedImageIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevImage}
              className="absolute left-4 bg-white/10 hover:bg-white/20 text-white border-0 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {selectedImageIndex < portfolioImages.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextImage}
              className="absolute right-4 bg-white/10 hover:bg-white/20 text-white border-0 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <Typography variant="bodySmall" className="text-white font-medium">
              {selectedImageIndex + 1} / {portfolioImages.length}
            </Typography>
          </div>

          {/* Main Image */}
          {(() => {
            const currentImage = portfolioImages[selectedImageIndex]
            const imageSrc = currentImage?.url || currentImage?.previewUrl || currentImage?.thumbnailUrl
            return imageSrc && imageSrc.trim() !== '' ? (
              <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
                <Image
                  src={imageSrc}
                  alt={currentImage?.alt || `Portfolio image ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>
            ) : null
          })()}
        </div>
      )}
    </>
  )
}
