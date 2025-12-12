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
      <div className="border border-primary/50 rounded-2xl pb-0 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-end relative w-full">
          {/* Left Content - Text and Buttons */}
          <div className="text-center lg:text-left px-4 pb-6 md:pb-8 order-2 lg:order-1">
            <h2 className="text-24 font-medium text-black mb-4">
              {heading}
            </h2>
            {description && (
              <p className="text-18 md:text-18 text-gray-500 mb-6 max-w-lg mx-auto lg:mx-0">
                {description}
              </p>
            )}
            {variant === 'newsletter' ? (
              <div className="flex flex-row gap-3 max-w-md mx-auto lg:mx-0 items-center">
                <input
                  type="email"
                  placeholder="Enter Your E-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 h-14 sm:h-12 px-4 rounded-full border border-gray-300 text-16 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button
                  variant="outline"
                  className="h-14 sm:h-12 px-8 text-16 font-semibold border border-primary rounded-full bg-white text-brand-500 hover:bg-gray-50 whitespace-nowrap"
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
                  className="px-8 py-6 text-16 font-semibold rounded-full bg-white text-brand-500 hover:bg-gray-50 border-primary"
                  asChild
                >
                  <Link href={ctaLink}>
                    {ctaText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
          {/* Product Image - Above on mobile, right on large screens */}
          {productImage && (
            <div className="flex justify-end items-end order-1 lg:order-2 -mt-20 md:-mt-32 lg:-mt-40 lg:ml-auto">
              <img
                src={
                  typeof productImage === 'string'
                    ? productImage
                    : productImage.src
                }
                alt=""
                className="w-128 h-128 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 object-contain block m-0"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
