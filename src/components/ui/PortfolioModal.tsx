'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Clock, Phone, MapPin, Star, ImageIcon, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaResponse } from '@/types/responses'
import type { BranchPortfolioResponse } from '@/types/responses/branch-portfolio-response'
import { Button } from './Button'
import { PriceDisplay } from './PriceDisplay'
import { RatingDisplay } from './RatingDisplay'
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
          <div className="flex items-start gap-4 p-6 border-b border-gray-200">
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
              <h2 className="text-24 font-semibold text-gray-900 truncate">
                {about?.name || title}
              </h2>
              {subtitle && (
                <p className="text-14 text-gray-600 mt-1">{subtitle}</p>
              )}
              {about && (about as any).jobTitle && (
                <p className="text-14 text-gray-600 mt-1">{(about as any).jobTitle}</p>
              )}
              {reviews && reviews.averageRating !== null && (
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
            <button
              onClick={onClose}
              className="p-2 hover:bg-brand-50 rounded-full transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-gray-600 hover:text-brand-500 transition-colors" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
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
                  'px-4 py-3 text-14 font-medium transition-colors relative whitespace-nowrap',
                  activeTab === tab.id
                    ? 'text-brand-500 bg-brand-50 rounded-t-lg'
                    : 'text-gray-600 hover:text-brand-500 hover:bg-brand-50/50'
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
                        <h3 className="text-18 font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-14 text-gray-700 leading-relaxed">{about.description}</p>
                      </div>
                    )}
                    
                    {statistics && (
                      <div>
                        <h3 className="text-18 font-semibold text-gray-900 mb-3">Statistics</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="text-14 text-gray-700">Appointments completed</span>
                            <span className="text-16 font-semibold text-brand-600">{statistics.appointmentsCompleted.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="text-14 text-gray-700">Clients served</span>
                            <span className="text-16 font-semibold text-brand-600">{statistics.clientsServed.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {about.address && (
                      <div>
                        <h3 className="text-18 font-semibold text-gray-900 mb-3">Location</h3>
                        <div className="flex items-start gap-2 text-14 text-gray-700">
                          <MapPin className="h-4 w-4 text-brand-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">
                              {about.address.fullAddress || about.address.displayAddress || about.address.displayName || about.address.nameEn || about.address.nameAr}
                            </p>
                            {(about.address.addressEn || about.address.addressAr) && (
                              <p className="text-gray-600">
                                {about.address.addressEn || about.address.addressAr}
                              </p>
                            )}
                            {about.address.street && (
                              <p className="text-gray-600 mt-1">
                                {about.address.street}
                                {about.address.building && `, ${about.address.building}`}
                                {about.address.floor && `, Floor ${about.address.floor}`}
                                {about.address.apartment && `, Apt ${about.address.apartment}`}
                              </p>
                            )}
                            {(about.address.cityName || about.address.regionName || about.address.countryName) && (
                              <p className="text-gray-600 mt-1">
                                {[about.address.cityName, about.address.regionName, about.address.countryName].filter(Boolean).join(', ')}
                              </p>
                            )}
                            {about.address.postalCode && (
                              <p className="text-gray-600 mt-1">
                                Postal Code: {about.address.postalCode}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {(about.phoneNumber || about.phoneNumber2 || (about as any).email) && (
                      <div>
                        <h3 className="text-18 font-semibold text-gray-900 mb-3">Contact</h3>
                        <div className="space-y-2">
                          {about.phoneNumber && (
                            <div className="flex items-center gap-2 text-14 text-gray-700">
                              <Phone className="h-4 w-4 text-brand-500" />
                              <a href={`tel:${about.phoneNumber}`} className="hover:text-brand-500 transition-colors">
                                {about.phoneNumber}
                              </a>
                            </div>
                          )}
                          {about.phoneNumber2 && (
                            <div className="flex items-center gap-2 text-14 text-gray-700">
                              <Phone className="h-4 w-4 text-brand-500" />
                              <a href={`tel:${about.phoneNumber2}`} className="hover:text-brand-500 transition-colors">
                                {about.phoneNumber2}
                              </a>
                            </div>
                          )}
                          {(about as any).email && (
                            <div className="flex items-center gap-2 text-14 text-gray-700">
                              <Mail className="h-4 w-4 text-brand-500" />
                              <a href={`mailto:${(about as any).email}`} className="hover:text-brand-500 transition-colors">
                                {(about as any).email}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {statistics && (statistics as any).languages && Array.isArray((statistics as any).languages) && (statistics as any).languages.length > 0 && (
                      <div>
                        <h3 className="text-18 font-semibold text-gray-900 mb-3">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {(statistics as any).languages.map((lang: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-brand-50 text-brand-700 text-14 font-medium rounded-lg border border-brand-200"
                            >
                              {lang}
                            </span>
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
                <h3 className="text-24 font-semibold text-gray-900 mb-4">Services</h3>
                {services.length > 0 ? (
                  <div className="space-y-3">
                    {services.map(service => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-brand-300 hover:shadow-md transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            {service.imageUrl && service.imageUrl.trim() !== '' ? (
                              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                  src={service.imageUrl}
                                  alt={service.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                            ) : null}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-16 font-semibold text-gray-900 mb-1">{service.name}</h4>
                              {service.description && (
                                <p className="text-14 text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                              )}
                              <div className="flex items-center gap-3 text-14 text-gray-600">
                                {service.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {formatDuration(service.duration)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                          <div className="text-right">
                            <PriceDisplay
                              discounted={service.price}
                              currency={DEFAULT_CURRENCY}
                              size="md"
                              variant="compact"
                            />
                          </div>
                          <Button
                            variant="brand"
                            size="sm"
                            className="!text-white flex-shrink-0"
                          >
                            Book
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No services available</p>
                  </div>
                )}
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="p-6">
                <h3 className="text-24 font-semibold text-gray-900 mb-4">Portfolio</h3>
                {portfolioImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {portfolioImages.map((media, index) => {
                      const imageUrl = media.url || media.thumbnailUrl || media.previewUrl
                      return imageUrl && imageUrl.trim() !== '' ? (
                        <button
                          key={media.id || index}
                          onClick={() => handleImageClick(index)}
                          className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
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
                  <div className="text-center py-12">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">This professional doesn't have a portfolio yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-24 font-semibold text-gray-900">Reviews</h3>
                  {reviews && reviews.averageRating !== null && (
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
                      <div
                        key={review.id || index}
                        className="border border-gray-200 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                <span className="text-white text-12 font-semibold">
                                  {review.userName?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-14 font-semibold text-gray-900">{review.userName || 'Anonymous'}</h4>
                                {review.date && (
                                  <p className="text-12 text-gray-500">{review.date}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <RatingDisplay
                            rating={review.rating}
                            size="sm"
                            format="stars-only"
                            variant="compact"
                          />
                        </div>
                        {review.title && (
                          <h5 className="text-14 font-semibold text-gray-900 mb-1">{review.title}</h5>
                        )}
                        {review.text && (
                          <p className="text-14 text-gray-700 leading-relaxed">{review.text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Book Now Button */}
          <div className="p-6 border-t border-gray-200">
            <Button
              variant="default"
              size="lg"
              className="w-full !bg-gray-900 hover:!bg-gray-800 !text-white font-semibold"
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
          <button
            onClick={handleCloseImageViewer}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Close image viewer"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          {selectedImageIndex > 0 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
          )}

          {selectedImageIndex < portfolioImages.length - 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <p className="text-14 text-white font-medium">
              {selectedImageIndex + 1} / {portfolioImages.length}
            </p>
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
            <Image
              src={
                portfolioImages[selectedImageIndex].url ||
                portfolioImages[selectedImageIndex].previewUrl ||
                portfolioImages[selectedImageIndex].thumbnailUrl ||
                ''
              }
              alt={portfolioImages[selectedImageIndex].alt || `Portfolio image ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
