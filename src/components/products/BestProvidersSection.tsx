'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { RatingDisplay } from '@/components/ui/RatingDisplay'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'

export interface ProviderProduct {
  id: string
  title: string
  image?: string
  rating: number
  price: number
  currency: string
  href: string
}

export interface Provider {
  id: string
  name: string
  image?: string
  profession: string
  verified: boolean
  rating: number
  product: ProviderProduct
}

export interface BestProvidersSectionProps {
  providers: Provider[]
  className?: string
  // Header props
  topText?: string
  highlightText?: string
  bottomText?: string
  bottomHighlightText?: string
  headerAlignment?: 'left' | 'center' | 'right'
  // Button text
  buttonText?: string
}

/**
 * BestProvidersSection Component
 * Displays best providers with their featured products
 */
export const BestProvidersSection = ({
  providers,
  className,
  topText = 'Best',
  highlightText = 'Providers',
  bottomText = 'With',
  bottomHighlightText = 'Best Products',
  headerAlignment = 'center',
  buttonText = 'Explore Now',
}: BestProvidersSectionProps) => {
  return (
    <section className={cn('py-12 md:py-20', className)}>
      {/* Section Header */}
      <div className="mb-12 md:mb-[50px]">
        <SectionHeader
          topText={topText}
          highlightText={highlightText}
          bottomText={bottomText}
          bottomHighlightText={bottomHighlightText}
          alignment={headerAlignment}
        />
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[20px] mb-8 md:mb-12">
        {providers.map(provider => (
          <div
            key={provider.id}
            className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 flex flex-col items-center gap-4 shadow-sm"
          >
            {/* Provider Avatar */}
            <div className="relative w-32 h-32 md:w-36 md:h-36">
              {/* Outer gray ring (thicker) */}
              <div className="absolute inset-0 rounded-full border-[3px] border-gray-200"></div>
              {/* Middle pink ring (thin) */}
              <div className="absolute inset-[3px] rounded-full border-2 border-brand-50"></div>
              {/* Inner image */}
              <div className="absolute inset-[7px] rounded-full overflow-hidden border-2 border-white">
                {provider.image ? (
                  <Image
                    src={provider.image}
                    alt={provider.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
            </div>

            {/* Provider Info */}
            <div className="flex flex-col gap-2 items-center w-full px-2">
              <div className="flex gap-2 items-center max-w-full">
                <h3 className="text-18 sm:text-20 md:text-24 font-semibold text-gray-900 leading-tight truncate">
                  {provider.name}
                </h3>
                {provider.verified && (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-13 sm:text-14 md:text-16 font-normal text-gray-600 text-center leading-normal w-full px-2 line-clamp-2">
                {provider.profession}
              </p>
              {/* Red Stars for Provider Rating */}
              <RatingDisplay
                rating={provider.rating}
                size="sm"
                format="stars-only"
                variant="compact"
                starColor="red"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[20px]">
        {providers.map(provider => (
          <Link
            key={`product-${provider.id}`}
            href={provider.product.href}
            className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow min-h-[152px]"
          >
            <div className="flex items-stretch h-full">
              {/* Product Image */}
              {provider.product.image && (
                <div className="relative w-[100px] h-full overflow-hidden flex-shrink-0">
                  <Image
                    src={provider.product.image}
                    alt={provider.product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-16 md:text-18 font-normal text-gray-900">
                    {provider.product.title}
                  </h4>
                  {/* Rating and Price on same row */}
                  <div className="flex items-center justify-between w-full">
                    <RatingDisplay
                      rating={provider.product.rating}
                      size="xs"
                      format="value-only"
                      variant="compact"
                      showValue={true}
                      starColor="red"
                      valueClassName="text-12 md:text-14 font-normal text-gray-500"
                    />
                    <PriceDisplay
                      discounted={provider.product.price}
                      currency={provider.product.currency}
                      size="lg"
                      variant="inline"
                      showOriginal={false}
                      discountedClassName="text-18 md:text-20 font-normal"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="text-13 sm:text-14 md:text-16 font-normal text-brand-500 p-0 h-auto self-end hover:bg-transparent"
                >
                  {buttonText}
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-1" />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
