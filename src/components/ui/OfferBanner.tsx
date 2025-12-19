'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from './Button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StaticImageData } from 'next/image'

export interface OfferBannerProps {
  heading: string
  description?: string
  offerPercentage?: number
  ctaText?: string
  ctaLink?: string
  productImage?: string | StaticImageData
  variant?: 'default' | 'newsletter'
  onSubscribe?: (email: string) => void
  className?: string
}

export const OfferBanner = ({
  heading,
  description,
  offerPercentage: _offerPercentage,
  ctaText = 'Start Shopping',
  ctaLink = '/products',
  productImage,
  variant = 'default',
  onSubscribe,
  className,
}: OfferBannerProps) => {
  const [email, setEmail] = useState('')

  const handleSubscribe = () => {
    if (onSubscribe && email) {
      onSubscribe(email)
      setEmail('')
    }
  }

  return (
    <section className={cn('container-custom overflow-visible', className)}>
      <div className="border border-brand-500 rounded-2xl overflow-visible bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 relative w-full">
          {/* Left Content - Text and Buttons */}
          <div className="text-center lg:text-left px-4 md:px-5 py-3 md:py-4 order-2 lg:order-1 flex flex-col justify-center">
            <h2 className="text-18 md:text-20 font-medium text-gray-900 mb-1.5 md:mb-2">
              {heading}
            </h2>
            {description && (
              <p className="text-13 md:text-14 text-gray-500 mb-3 md:mb-4 max-w-lg mx-auto lg:mx-0">
                {description}
              </p>
            )}
            {variant === 'newsletter' ? (
              <div className="flex flex-row gap-2 max-w-md mx-auto lg:mx-0 items-center">
                <input
                  type="email"
                  placeholder="Enter Your E-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 h-9 md:h-10 px-3 md:px-4 rounded-full border border-gray-300 text-13 md:text-14 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Button
                  variant="outline"
                  className="h-9 md:h-10 px-4 md:px-5 text-13 md:text-14 font-semibold border border-brand-500 rounded-full bg-white text-brand-500 hover:bg-gray-50 whitespace-nowrap"
                  onClick={handleSubscribe}
                >
                  {ctaText || 'Subscribe'}
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
                  <Link href={ctaLink}>
                    {ctaText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
          {/* Product Image - Right side, aligned from top border to bottom with form */}
          {productImage && (
            <div className="flex justify-end items-end order-1 lg:order-2 relative overflow-visible">
              <div className="relative w-full h-full flex items-end justify-end">
                <img
                  src={
                    typeof productImage === 'string'
                      ? productImage
                      : productImage.src
                  }
                  alt=""
                  className="w-auto h-[140px] md:h-[170px] lg:h-[200px] xl:h-[230px] object-contain object-bottom"
                  style={{ marginTop: '-1px' }}
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
