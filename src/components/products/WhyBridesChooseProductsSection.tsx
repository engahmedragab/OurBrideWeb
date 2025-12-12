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
  // Header props
  topText?: string
  highlightText?: string
  bottomText?: string
  bottomHighlightText?: string
  headerAlignment?: 'left' | 'center' | 'right'
}

export const WhyBridesChooseProductsSection = ({
  image,
  features,
  className,
  topText = 'Why',
  highlightText = 'Brides',
  bottomText = 'Choose',
  bottomHighlightText = 'OurBride Products',
  headerAlignment = 'center',
}: WhyBridesChooseProductsSectionProps) => {
  return (
    <section className={cn('w-full py-5 md:py-7 lg:py-9', className)}>
      <div className="w-full">
        {/* Header */}
        <div className="mb-5 md:mb-7">
          <SectionHeader
            topText={topText}
            highlightText={highlightText}
            bottomText={bottomText}
            bottomHighlightText={bottomHighlightText}
            alignment={headerAlignment}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-stretch gap-0">
        {/* Left Image with offset border */}
        {image && (
          <div
            className="
              relative 
              w-full md:w-[420px] 
              h-[220px] sm:h-[270px] md:h-[310px] lg:h-[360px]
              flex-shrink-0
            "
          >
          
            <div
              className="
                absolute inset-0
                rounded-2xl md:rounded-l-2xl md:rounded-br-none 
                border-2 border-brand-500
                -translate-x-3 md:-translate-x-5 -translate-y-3 md:translate-y-5   
                pointer-events-none
              "
            />
 
            <div className="relative w-full h-full rounded-2xl md:rounded-l-2xl md:rounded-tr-none md:rounded-br-none   overflow-hidden">
              <Image
                src={typeof image === 'string' ? image : image.src}
                alt="Product showcase"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Right Features */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-3.5 p-4 md:p-4.5 lg:p-5.5 bg-white">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border-l-[3px] border-brand-500 pl-3 md:pl-3.5 flex flex-col gap-2"
            >
              <h3 className="text-15 md:text-17 lg:text-19 font-medium text-gray-900 leading-tight">
                {feature.title}
              </h3>
              <p className="text-12 md:text-13 lg:text-14 font-normal text-gray-500 leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}
