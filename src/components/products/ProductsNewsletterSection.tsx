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
}

/**
 * ProductsNewsletterSection Component
 * Newsletter subscription section for product updates
 */
export const ProductsNewsletterSection = ({
  image,
  className,
  onSubscribe,
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
    <section
      className={cn('py-12 md:py-20', className)}
    >
      <div className="relative border border-brand-500 rounded-[24px] p-8 md:px-[74px] md:py-[31px] flex flex-col gap-6 md:gap-[24px] min-h-[277px] md:h-[277px]">
        {/* Background Image */}
        {image && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[327px] md:w-[458px] h-[272px] md:h-[381px] overflow-hidden pointer-events-none">
            <Image
              src={typeof image === 'string' ? image : image.src}
              alt="Flower bouquet"
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-4 md:gap-[16px] max-w-[865px]">
          <h2 className="text-24 md:text-32 font-medium text-gray-900 leading-[40px]">
            Get Products Updates & Offers
          </h2>
          <p className="text-16 md:text-28 font-normal text-gray-500 leading-[24px] md:leading-[40px]">
            Stay informed about new providers, offers, and wedding planning tips
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex flex-col sm:flex-row gap-2 md:gap-[9px] items-end max-w-[632px]"
        >
          <Input
            type="email"
            placeholder="Enter Your E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 h-[48px] md:h-[60px] rounded-[24px] md:rounded-[60px] px-5 md:px-[20px] text-16"
            variant="default"
            size="lg"
          />
          <Button
            type="submit"
            variant="outlineBrand"
            className="h-[48px] md:h-[60px] px-4 md:px-8 rounded-[24px] md:rounded-[60px] text-16 md:text-20 font-normal text-brand-500 border-brand-500 hover:bg-brand-50 w-full sm:w-auto sm:min-w-[273px]"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}


