'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './Button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StaticImageData } from 'next/image'
import { useI18nTranslations, useIsRTL } from '@/i18n'

export interface OfferItem {
  heading: string
  description?: string
  offerPercentage?: number
  ctaText?: string
  ctaLink?: string
  productImage?: string | StaticImageData
  variant?: 'default' | 'newsletter'
}

export interface OfferBannerProps {
  offers: OfferItem[]
  autoPlayInterval?: number
  onSubscribe?: (email: string) => void
  className?: string
  noContainer?: boolean
}

export const OfferBanner = ({
  offers,
  autoPlayInterval = 5000,
  onSubscribe,
  className,
  noContainer = false,
}: OfferBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [email, setEmail] = useState('')
  // localization
  const t = useI18nTranslations('common')
  const isRTL = useIsRTL()

  // Auto-play carousel
  useEffect(() => {
    if (offers.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [offers.length, autoPlayInterval])

  const handleSubscribe = () => {
    if (onSubscribe && email) {
      onSubscribe(email)
      setEmail('')
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Early return if no offers
  if (!offers || offers.length === 0) {
    return null
  }

  const currentOffer = offers[currentIndex]

  // Safety check - return null if currentOffer is undefined
  if (!currentOffer) {
    return null
  }

  return (
    <section className={cn(noContainer ? 'py-4 md:py-6' : 'container-custom py-4 md:py-6', className)}>
      <div className="relative w-full">
        <div className="border border-brand-500 rounded-2xl overflow-hidden bg-white w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 relative w-full">
            {/* Left Content - Text and Buttons */}
            <div className={cn("text-center lg:text-left px-4 md:px-6 py-3 md:py-4 order-1 lg:order-1 flex flex-col justify-center", isRTL ? 'lg:text-right' : 'lg:text-left')}>
              <h2 className="text-18 md:text-20 font-medium text-gray-900 mb-1.5 md:mb-2">
                {currentOffer.heading}
              </h2>
              {currentOffer.description && (
                <p className="text-13 md:text-14 text-gray-500 mb-3 md:mb-4 max-w-lg mx-auto lg:mx-0">
                  {currentOffer.description}
                </p>
              )}
              {currentOffer.variant === 'newsletter' ? (
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto lg:mx-0 items-stretch sm:items-center">
                  <input
                    type="email"
                    placeholder={t('enterYourEmail')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 min-w-0 h-9 md:h-10 px-3 md:px-4 rounded-full border border-gray-300 text-13 md:text-14 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Button
                    variant="outline"
                    className="h-9 md:h-10 px-4 md:px-5 text-13 md:text-14 font-semibold border border-brand-500 rounded-full bg-white text-brand-500 hover:bg-gray-50 whitespace-nowrap flex-shrink-0"
                    onClick={handleSubscribe}
                  >
                    {currentOffer.ctaText || 'Subscribe'}
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center lg:justify-start">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-5 md:px-6 py-3 md:py-4 text-13 md:text-14 font-semibold rounded-full bg-white text-brand-500 hover:bg-gray-50 border-brand-500"
                    asChild
                  >
                    <Link href={currentOffer.ctaLink || '/products'}>
                      {currentOffer.ctaText || 'Start Shopping'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            {/* Product Image - Right side, aligned from top border to bottom with form */}
            {currentOffer.productImage && (
              <div className="flex justify-end items-end order-1 lg:order-2 relative overflow-hidden">
                <div className="relative w-full h-full flex items-end justify-end">
                  <Image
                    src={
                      typeof currentOffer.productImage === 'string'
                        ? currentOffer.productImage
                        : currentOffer.productImage.src
                    }
                    alt=""
                    width={300}
                    height={230}
                    className="w-auto h-[140px] md:h-[170px] lg:h-[200px] xl:h-[230px] object-contain object-bottom"
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dash Indicators */}
        {offers.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {offers.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'w-12 bg-brand-500'
                    : 'w-4 bg-gray-300'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
