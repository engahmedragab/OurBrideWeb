'use client'

import { useState } from 'react'
import Image from 'next/image'
import { StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export interface ProductsNewsletterSectionProps {
  image?: string | StaticImageData
  className?: string
  onSubscribe?: (email: string) => void
  // Content props
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
}

/**
 * ProductsNewsletterSection Component
 * Newsletter subscription section for product updates
 */
export const ProductsNewsletterSection = ({
  image,
  className,
  onSubscribe,
  title = 'Get Products Updates & Offers',
  description = 'Stay informed about new providers, offers, and wedding planning tips',
  placeholder = 'Enter Your E-mail',
  buttonText = 'Subscribe',
}: ProductsNewsletterSectionProps) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && onSubscribe) {
      onSubscribe(email)
      setEmail('')
    }
  }

  return (
    <div
      className={cn('w-full', className)}
    >
      <div className="relative border border-brand-500 rounded-[24px] p-6 md:p-8 md:px-[74px] md:py-[31px] flex flex-col gap-6 md:gap-[24px] min-h-auto md:min-h-[277px] md:h-[277px]">
        {/* Image - Top on mobile, Right on desktop */}
        {image && (
          <div className="relative md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 w-full md:w-[327px] lg:w-[458px] h-[200px] sm:h-[250px] md:h-[272px] lg:h-[381px] overflow-hidden pointer-events-none -mx-6 md:mx-0 -mt-6 md:mt-0 rounded-t-[24px] md:rounded-t-none">
            <Image
              src={typeof image === 'string' ? image : image.src}
              alt="Flower bouquet"
              fill
              className="object-cover md:object-contain"
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-4 md:gap-[16px] max-w-[865px] text-center md:text-left">
          <h2 className="text-20 md:text-24 lg:text-32 font-medium text-gray-900 leading-tight md:leading-[40px]">
            {title}
          </h2>
          <p className="text-14 md:text-16 lg:text-20 font-normal text-gray-500 leading-snug md:leading-[24px] lg:leading-[40px]">
            {description}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex flex-col sm:flex-row gap-2 md:gap-[9px] items-stretch sm:items-end max-w-[632px] mx-auto md:mx-0 mt-4 md:mt-6"
        >
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 h-[48px] md:h-[60px] rounded-[24px] md:rounded-[60px] px-5 md:px-[20px] text-14 md:text-16"
            variant="default"
            size="lg"
          />
          <Button
            type="submit"
            variant="outlineBrand"
            className="h-[48px] md:h-[60px] px-4 md:px-8 rounded-[24px] md:rounded-[60px] text-14 md:text-16 lg:text-20 font-normal text-brand-500 border-brand-500 hover:bg-brand-50 w-full sm:w-auto sm:min-w-[273px]"
          >
            {buttonText}
          </Button>
        </form>
      </div>
    </div>
  )
}


