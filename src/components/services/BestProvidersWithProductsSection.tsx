'use client'

import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { ServicesProvidersSlider, type Provider } from './ServicesProvidersSlider'
import { ServicesProductsSlider, type Product } from './ServicesProductsSlider'

/**
 * Title part interface for mixed bold/normal text
 */
export interface TitlePart {
  text: string
  isHighlighted?: boolean
}

// Re-export types for convenience
export type { Provider, Product }

/**
 * Main component props
 */
export interface BestProvidersWithProductsSectionProps {
  titleParts: TitlePart[]
  providers?: Provider[]
  products?: Product[]
  className?: string
}

/**
 * Title style variants using cva
 */
const titleVariants = cva('text-center', {
  variants: {
    alignment: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    alignment: 'center',
  },
})


/**
 * BestProvidersWithProductsSection Component
 * 
 * Parent section component that displays:
 * 1. Title with mixed bold/normal text
 * 2. Providers slider (ServicesProvidersSlider)
 * 3. Products slider (ServicesProductsSlider)
 */
export const BestProvidersWithProductsSection = ({
  titleParts,
  providers = [],
  products = [],
  className,
}: BestProvidersWithProductsSectionProps) => {
  return (
    <section className={cn('w-full py-12 md:py-20', className)}>
      <div className="w-full px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32">
        {/* Title */}
        <div className={cn(titleVariants({ alignment: 'center' }), 'mb-12 md:mb-16')}>
          <h2 className="text-48 md:text-56 lg:text-64 xl:text-72 2xl:text-80 font-black text-gray-900 leading-tight">
            <span className="block">
              {titleParts.slice(0, 2).map((part, index) => (
                <span
                  key={index}
                  className={part.isHighlighted ? 'font-semibold' : 'font-normal'}
                >
                  {part.text}
                  {index < 1 && ' '}
                </span>
              ))}
            </span>
            <span className="block">
              {titleParts.slice(2).map((part, index) => (
                <span
                  key={index + 2}
                  className={part.isHighlighted ? 'font-semibold' : 'font-normal'}
                >
                  {part.text}
                  {index < titleParts.slice(2).length - 1 && ' '}
                </span>
              ))}
            </span>
          </h2>
        </div>

        {/* Providers Slider */}
        <ServicesProvidersSlider providers={providers} />

        {/* Products Slider */}
        <ServicesProductsSlider products={products} />
      </div>
    </section>
  )
}

