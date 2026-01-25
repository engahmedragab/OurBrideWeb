'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { Button } from './Button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n'

export interface OfferItem {
  headingAr?: string
  headingEn?: string
  descriptionAr?: string
  descriptionEn?: string
  description?: string
  heading?: string
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
  const tC = useI18nTranslations('common')
  const tS = useI18nTranslations('services.intro')
  const isRTL = useIsRTL()

  useEffect(() => {
    if (offers.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length)
    }, autoPlayInterval)
    return () => clearInterval(interval)
  }, [offers.length, autoPlayInterval])

  const handleSubscribe = () => {
    if (onSubscribe && email) {
      onSubscribe(email)
      setEmail('')
    }
  }

  const goToSlide = (index: number) => setCurrentIndex(index)

  if (!offers || offers.length === 0) return null
  const currentOffer = offers[currentIndex]
  if (!currentOffer) return null

  const wrapperClass = cn(
    noContainer ? 'py-4 md:py-6' : 'container-custom py-4 md:py-6',
    className
  )

  return (
    <section className={wrapperClass}>
      <div className="relative w-full">
        {/* Card */}
        <div className="relative w-full rounded-2xl border border-brand-500 bg-white overflow-visible">
          <div
            className={cn(
             
              'grid grid-cols-1 md:grid-cols-[1fr_360px] xl:md:grid-cols-[1fr_420px]',
              'items-center',
              'gap-0 md:gap-6',
              'w-full overflow-visible'
            )}
          >
            {/* Image (Mobile first) */}
            {currentOffer.productImage && (
              <div
             
                className={cn(
                  'relative overflow-visible',
                  
                  'order-1 md:order-2',
                  // Mobile alignment
                  'flex ',
                  // Pull up a bit on mobile like screenshot
                  '-mt-10 sm:-mt-8 md:mt-0',
                  'pt-4 md:pt-0 pr-0',
                  isRTL ? 'scale-x-[-1] justify-start' : 'scale-x-100 justify-end',
                  
                )}
              >
                <Image
                  src={
                    typeof currentOffer.productImage === 'string'
                      ? currentOffer.productImage
                      : currentOffer.productImage.src
                  }
                  alt=""
                  width={520}
                  height={360}
                  aria-hidden="true"
                  className={cn(
                    // Mobile sizes
                    'h-[220px] w-auto sm:h-[260px]',
                    // Desktop sizes
                    'md:h-[220px] xl:h-[250px]',
                    'object-contain object-bottom select-none pointer-events-none',
                   
                   
                  )}
                />
              </div>
            )}

            {/* Content */}
            <div
              className={cn(
                'order-2 md:order-1',
                'flex flex-col justify-center',
                
                'px-6 sm:px-8 md:px-10',
                'pb-6 pt-2 sm:pt-0 md:py-8',
                // Text alignment
                'text-center',
                isRTL ? 'md:text-right' : 'md:text-left',
                
                isRTL ? 'md:pr-3' : 'md:pr-10'
              )}
            >
              <h2 className="font-semibold text-gray-900 text-[16px] sm:text-[18px] md:text-[20px]">
                { currentOffer.heading ? currentOffer.heading : (isRTL ? currentOffer.headingAr : currentOffer.headingEn)}
              </h2>

              {currentOffer.description || currentOffer.descriptionAr || currentOffer.descriptionEn && (
                <p className="mt-2 text-gray-500 text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed max-w-[52ch] mx-auto md:mx-0">
                  { currentOffer.description ? currentOffer.description : (isRTL ? currentOffer.descriptionAr : currentOffer.descriptionEn)}
                </p>
              )}

              {currentOffer.variant === 'newsletter' ? (
                <div className="mt-4 w-full max-w-md mx-auto md:mx-0">
                  {/* Mobile: stacked | Desktop: row */}
                  <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
                    <input
                      type="email"
                      placeholder={tS('newsletter.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full md:flex-1 h-10 md:h-10 px-4 rounded-full border border-gray-200 text-[13px] md:text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />

                    <Button
                      variant="outline"
                      onClick={handleSubscribe}
                      className="w-full md:w-auto h-10 px-8 text-[13px] md:text-[14px] font-semibold border border-brand-500 rounded-full bg-white text-brand-500 hover:bg-gray-50 whitespace-nowrap"
                    >
                      {currentOffer.ctaText || tC('subscribeButton')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex justify-center md:justify-start">
                  <Button
                    variant="outline"
                    size="md"
                    className="px-6 py-4 text-[13px] md:text-[14px] font-semibold rounded-full bg-white text-brand-500 hover:bg-gray-50 border-brand-500"
                    asChild
                  >
                    <Link href={currentOffer.ctaLink || '/products'}>
                      {currentOffer.ctaText || tC('startShopping')}
                      <ArrowRight className={cn('h-4 w-4', isRTL ? 'mr-2 rotate-180' : "ml-1")} />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
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
                  index === currentIndex ? 'w-12 bg-brand-500' : 'w-4 bg-gray-300'
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
