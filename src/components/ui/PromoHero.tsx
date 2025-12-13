'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PromoHeroProps {
  badge: string
  title: string
  description: string
  ctaLabel: string
  ctaLink?: string
  productImage?: string | StaticImageData
  bannerImage?: string | StaticImageData
  discountText?: string
  className?: string
  onCtaClick?: () => void
}

/**
 * PromoHero Component
 * Reusable hero section for promotional content with product showcase
 * Can be used for Products, Services, or any promotional content
 */
export const PromoHero = ({
  badge,
  title,
  description,
  ctaLabel,
  ctaLink,
  productImage,
  bannerImage,
  discountText,
  className,
  onCtaClick,
}: PromoHeroProps) => {
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick()
    }
  }

  const ctaButton = (
    <Button
      variant="default"
      size="lg"
      className="h-[60px] px-8 text-20 font-medium rounded-[60px] bg-brand-500 hover:bg-brand-600"
      onClick={handleCtaClick}
    >
      {ctaLabel}
    </Button>
  )

  return (
    <div
      className={cn(
        'relative bg-gray-25 border-b border-gray-100 overflow-hidden',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Side - Content */}
          <div className="flex-1 flex flex-col gap-6 items-start w-full lg:max-w-[753px]">
            <div className="flex flex-col gap-2">
              <Badge
                variant="default"
                className="bg-transparent border-0 px-0 py-0 text-24 text-brand-500 font-normal"
              >
                {badge}
              </Badge>
              <h1 className="text-32 md:text-[41.667px] font-bold text-gray-800 leading-[50px]">
                {title}
              </h1>
            </div>
            <p className="text-20 md:text-24 text-gray-700 leading-[32px] max-w-full">
              {description}
            </p>
            {ctaLink ? (
              <Link href={ctaLink}>{ctaButton}</Link>
            ) : (
              ctaButton
            )}
          </div>

          {/* Right Side - Banner & Product Image */}
          <div className="relative w-full lg:w-[880px] h-[329px] lg:h-[484px] flex-shrink-0">
            {/* Banner Background */}
            {bannerImage && (
              <div className="absolute inset-0 rounded-bl-[50px] rounded-tl-[50px] overflow-hidden">
                {typeof bannerImage === 'string' ? (
                  <Image
                    src={bannerImage}
                    alt="Promotional banner"
                    fill
                    className="object-cover mix-blend-soft-light opacity-63"
                  />
                ) : (
                  <Image
                    src={bannerImage.src}
                    alt="Promotional banner"
                    fill
                    className="object-cover mix-blend-soft-light opacity-63"
                  />
                )}
              </div>
            )}

            {/* Discount Text Overlay */}
            {discountText && (
              <div className="absolute left-1/2 top-[77px] -translate-x-1/2 z-10">
                <p className="text-[209.593px] font-extrabold text-white leading-[183px] text-center">
                  {discountText}
                </p>
              </div>
            )}

            {/* Product Image */}
            {productImage && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                {typeof productImage === 'string' ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={productImage}
                      alt={title}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={productImage.src}
                      alt={title}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Navigation Arrows */}
            <Button
              variant="default"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-[60px] w-[60px] rounded-[60px] bg-brand-500 hover:bg-brand-600 hidden lg:flex"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-[60px] w-[60px] rounded-[60px] bg-brand-500 hover:bg-brand-600 hidden lg:flex"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

