'use client'

import Image from 'next/image'
import { StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useIsRTL } from '@/i18n'
import { useI18nTranslations } from '@/i18n/hooks'

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
  const isRTL = useIsRTL()
  const t = useI18nTranslations('products')

  return (
    <section className={cn('w-full py-8 md:py-12', className)}>
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
        <div className="flex flex-col md:flex-row items-stretch px-4 lg:px-1 ">
        {/* Left Image with offset border */}
        {image && (
          <div
            className="
              relative 
              w-full md:w-[340px] lg:w-[420px] 
              h-[220px] sm:h-[270px] md:h-[310px] lg:h-[360px]
              flex-shrink-0
            "
          >
          
            <div
              className={cn(
                "absolute inset-0 rounded-2xl md:rounded-l-2xl border-2 border-brand-500 pointer-events-none",
                isRTL
                  ? "md:rounded-tl-none md:rounded-bl-none translate-x-3 md:translate-x-5 -translate-y-3 md:translate-y-5 "
                  :  "md:rounded-tr-none md:rounded-br-none -translate-x-3 md:-translate-x-5 -translate-y-3 md:translate-y-5 "
              )}
              />
 
            <div className={cn("relative w-full h-full rounded-2xl md:rounded-l-2xl  overflow-hidden", isRTL ? "md:rounded-tl-none md:rounded-bl-none" : "md:rounded-tr-none md:rounded-br-none")}>
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
          {features.map((feature, index) => {
            // Helper function to check if a string is a translation key
            // Translation keys typically:
            // - Start with lowercase letters or common prefixes
            // - Don't contain spaces (usually)
            // - Have dots in the middle (not just at the end as punctuation)
            
            const isTranslationKey = (str: string): boolean => {
              // If it doesn't contain a dot, it's not a key
              if (!str.includes('.')) return false
              
              // If it contains spaces, it's likely already translated text
              if (str.includes(' ')) return false
              
              // Check if dots are in the middle (not just at the end)
              // Translation keys have dots as separators, not punctuation
              const dotIndex = str.indexOf('.')
              const lastDotIndex = str.lastIndexOf('.')
              
              // If the last dot is at the end, it's likely punctuation, not a key
              if (lastDotIndex === str.length - 1) return false
              
              // If it starts with a lowercase letter or common namespace, it's likely a key
              const firstChar = str.charAt(0)
              if (firstChar >= 'a' && firstChar <= 'z') return true
              
              // Common namespace prefixes
              const commonPrefixes = ['product', 'service', 'common', 'auth', 'navbar']
              if (commonPrefixes.some(prefix => str.startsWith(prefix))) return true
              
              return false
            }
            
            const isTitleKey = isTranslationKey(feature.title)
            const isDescriptionKey = isTranslationKey(feature.description)
            const title = isTitleKey ? t(feature.title) : feature.title
            const description = isDescriptionKey ? t(feature.description) : feature.description
           
            return (
              <div
                key={index}
                className={cn(" flex flex-col gap-2", isRTL ? "border-r-[3px] border-brand-500 pr-3 md:pr-4" : "border-l-[3px] border-brand-500 pl-3 md:pl-4")}
              >
                <h3 className="text-15 md:text-17 lg:text-19 font-medium text-gray-900 leading-tight">
                  {title}
                </h3>
                <p className="text-12 md:text-13 lg:text-14 font-normal text-gray-500 leading-snug">
                  {description}
                </p>
              </div>
            )
          })}
        </div>
        </div>
      </div>
    </section>
  )
}
