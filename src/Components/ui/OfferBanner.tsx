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
      <div className="bg-brand-500 rounded-2xl px-6 md:px-8 pt-6 md:pt-8 pb-0 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-end">
          {/* Left Content */}
          <div className="text-center lg:text-left pb-6 md:pb-8">
            <h2 className="text-32 md:text-40 lg:text-48 font-black text-white mb-4">
              {heading}
            </h2>
            {description && (
              <p className="text-18 md:text-18 text-white/90 mb-6 max-w-lg mx-auto lg:mx-0">
                {description}
              </p>
            )}
            {variant === 'newsletter' ? (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter Your E-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-full text-16 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-16 font-semibold rounded-full bg-white text-brand-500 hover:bg-gray-50 border-white whitespace-nowrap"
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
                  className="px-8 py-6 text-16 font-semibold rounded-full bg-white text-brand-500 hover:bg-gray-50 border-white"
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
          {/* Right Content - Product Images */}
          {productImage && (
            <div className="flex justify-center lg:justify-end items-end -mr-6 md:-mr-8 -mt-20 md:-mt-32 lg:-mt-40">
              <img
                src={
                  typeof productImage === 'string'
                    ? productImage
                    : productImage.src
                }
                alt=""
                className="w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain block m-0"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

