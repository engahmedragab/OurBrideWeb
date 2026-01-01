'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MediaResponse } from '@/types/responses'

interface PortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  portfolio: MediaResponse[]
  title: string
  subtitle?: string
}

export function PortfolioModal({
  isOpen,
  onClose,
  portfolio,
  title,
  subtitle,
}: PortfolioModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  if (!isOpen) return null

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
    if (selectedImageIndex !== null && selectedImageIndex < portfolio.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  return (
    <>
      {/* Main Portfolio Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl mx-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-24 font-semibold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-14 text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Portfolio Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {portfolio.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {portfolio.map((media, index) => (
                  <button
                    key={media.id}
                    onClick={() => handleImageClick(index)}
                    className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src={media.url || media.thumbnailUrl || media.previewUrl}
                      alt={media.alt || `Portfolio image ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-16 text-gray-500">No portfolio images available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Image Viewer */}
      {selectedImageIndex !== null && (
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

          {selectedImageIndex < portfolio.length - 1 && (
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
              {selectedImageIndex + 1} / {portfolio.length}
            </p>
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
            <Image
              src={
                portfolio[selectedImageIndex].url ||
                portfolio[selectedImageIndex].previewUrl ||
                portfolio[selectedImageIndex].thumbnailUrl
              }
              alt={portfolio[selectedImageIndex].alt || `Portfolio image ${selectedImageIndex + 1}`}
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


