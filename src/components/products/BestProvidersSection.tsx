'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { RatingDisplay } from '@/components/ui/RatingDisplay'
import { CheckCircle2, ChevronRight } from 'lucide-react'
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
    <section
      className={cn('py-12 md:py-20', className)}
    >
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[20px]">
        {providers.map(provider => (
          <div
            key={provider.id}
            className="bg-white border border-gray-100 rounded-[24px] p-5 flex flex-col gap-6"
          >
            {/* Provider Card */}
            <div className="flex flex-col gap-4 items-center">
              {/* Provider Avatar */}
              <div className="relative w-[220px] h-[220px] rounded-full border-[3.901px] border-brand-50 bg-brand-100 p-[18.723px]">
                <div className="relative w-full h-full rounded-full border-[9.362px] border-white overflow-hidden">
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
              <div className="flex flex-col gap-2 items-center">
                <div className="flex gap-2 items-center">
                  <h3 className="text-24 font-medium text-gray-900">
                    {provider.name}
                  </h3>
                  {provider.verified && (
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-16 font-normal text-gray-900 text-center">
                  {provider.profession}
                </p>
                <RatingDisplay
                  rating={provider.rating}
                  size="sm"
                  showCount={false}
                  className="gap-1"
                />
              </div>
            </div>

            {/* Product Card */}
            <Link href={provider.product.href}>
              <div className="flex gap-4 items-center">
                {/* Product Image */}
                {provider.product.image && (
                  <div className="relative w-[100px] h-[152px] rounded-bl-[24px] rounded-tl-[24px] overflow-hidden flex-shrink-0">
                    <Image
                      src={provider.product.image}
                      alt={provider.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="flex-1 bg-white border border-gray-100 rounded-br-[24px] rounded-tr-[24px] p-5 flex flex-col gap-4 items-end">
                  <div className="w-full flex flex-col gap-2 items-start">
                    <h4 className="text-24 font-medium text-gray-900 leading-[32px]">
                      {provider.product.title}
                    </h4>
                    <div className="flex gap-4 items-center w-full">
                      <div className="flex gap-1 items-center flex-1">
                        <RatingDisplay
                          rating={provider.product.rating}
                          size="sm"
                          showCount={false}
                          className="gap-1"
                        />
                        <span className="text-16 font-normal text-gray-500">
                          {provider.product.rating}
                        </span>
                      </div>
                      <div className="flex gap-0.5 items-center">
                        <span className="text-24 font-semibold text-gray-900">
                          {provider.product.price.toLocaleString()}
                        </span>
                        <span className="text-14 font-normal text-gray-900">
                          {provider.product.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-20 font-normal text-brand-500 hover:text-brand-600 p-0 h-auto"
                  >
                    {buttonText}
                    <ChevronRight className="h-6 w-6 ml-2" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

