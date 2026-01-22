'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18nTranslations } from '@/i18n/hooks'

export interface ProductImageGalleryProps {
  images: string[]
  productName: string
  className?: string
}

export const ProductImageGallery = ({
  images,
  productName,
  className,
}: ProductImageGalleryProps) => {
  // Filter out empty strings and invalid image URLs
  const validImages = images.filter(
    img => img && typeof img === 'string' && img.trim() !== ''
  )
  const t = useI18nTranslations('common')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const goToPrevious = () => {
    setSelectedIndex(prev => (prev === 0 ? validImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex(prev => (prev === validImages.length - 1 ? 0 : prev + 1))
  }

  if (validImages.length === 0) {
    return (
      <div className={cn('aspect-square bg-gray-100 rounded-xl', className)}>
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          {t('noImageAvailable')}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Image */}
      <div className="relative aspect-square md:aspect-[5/3] lg:aspect-square bg-gray-100 rounded-xl overflow-hidden group">

        {validImages[selectedIndex] && !imageErrors.has(selectedIndex) ? (
          <Image
            src={validImages[selectedIndex]}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={selectedIndex === 0}
            onError={() => setImageErrors(prev => new Set(prev).add(selectedIndex))}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-12 font-medium">
              {t('noImageAvailable')}
            </span>
          </div>
        )}

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-12 px-3 py-1 rounded-full">
            {selectedIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                selectedIndex === index
                  ? 'border-brand-500 ring-2 ring-brand-200'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              {image && image.trim() !== '' && !imageErrors.has(index) ? (
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 12vw"
                  className="object-cover"
                  onError={() => setImageErrors(prev => new Set(prev).add(index))}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-10 font-medium">
                    {t('noImageAvailable')}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
