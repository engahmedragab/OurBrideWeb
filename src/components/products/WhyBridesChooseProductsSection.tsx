'use client'

import Image from 'next/image'
import { StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'
import { SectionHeader } from '@/components/ui/SectionHeader'

export interface Feature {
  title: string
  description: string
}

export interface WhyBridesChooseProductsSectionProps {
  image?: string | StaticImageData
  features: Feature[]
  className?: string
}

/**
 * WhyBridesChooseProductsSection Component
 * Displays why brides choose OurBride products with features
 */
export const WhyBridesChooseProductsSection = ({
  image,
  features,
  className,
}: WhyBridesChooseProductsSectionProps) => {
  return (
    <section
      className={cn('container-custom py-12 md:py-20', className)}
    >
      {/* Section Header */}
      <div className="flex flex-col gap-4 items-center mb-12 md:mb-[50px]">
        <div className="flex gap-3.5 md:gap-[14px] items-center leading-[72px] text-[64px] text-gray-900">
          <h2 className="font-normal">Why</h2>
          <h2 className="font-semibold">Brides</h2>
        </div>
        <div className="flex gap-3 md:gap-[12px] items-center justify-center leading-[72px] text-[64px] text-gray-900 w-full">
          <h2 className="font-semibold">Choose</h2>
          <h2 className="font-normal">OurBride Products</h2>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex flex-col lg:flex-row gap-5 md:gap-[20px] items-start">
        {/* Left Side - Image */}
        {image && (
          <div className="relative w-full lg:w-[695px] h-[633px] rounded-bl-[24px] rounded-tl-[24px] overflow-hidden border-2 border-brand-500">
            <Image
              src={typeof image === 'string' ? image : image.src}
              alt="Product showcase"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Right Side - Features Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-[20px] w-full lg:max-w-[700px]">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border-l-[3px] border-brand-500 pl-5 flex flex-col gap-[13px] py-0"
            >
              <h3 className="text-24 md:text-30 font-medium text-gray-900 leading-[40px]">
                {feature.title}
              </h3>
              <p className="text-16 md:text-20 font-normal text-gray-500 leading-[24px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

