'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProductsProvidersSlider, type Provider } from './ProductsProvidersSlider'
import { ProductsProductsSlider, type Product } from './ProductsProductsSlider'

// Re-export types for convenience
export type { Provider, Product }

/**
 * Main component props
 */
export interface BestProvidersWithProductsSectionProps {
  providers?: Provider[]
  products?: Product[]
  className?: string
  // Header props
  topText?: string
  highlightText?: string
  bottomText?: string
  bottomHighlightText?: string
  headerAlignment?: 'left' | 'center' | 'right'
}

/**
 * BestProvidersWithProductsSection Component
 * 
 * Parent section component that displays:
 * 1. Section header using SectionHeader
 * 2. Providers slider (ProductsProvidersSlider)
 * 3. Products slider (ProductsProductsSlider)
 */
export const BestProvidersWithProductsSection = ({
  providers = [],
  products = [],
  className,
  topText = 'Best',
  highlightText = 'Providers',
  bottomText = 'With',
  bottomHighlightText = 'Best Products',
  headerAlignment = 'center',
}: BestProvidersWithProductsSectionProps) => {
  return (
    <div className={cn('w-full', className)}>
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

      {/* Providers Slider */}
      <ProductsProvidersSlider providers={providers} />

      {/* Products Slider */}
      <ProductsProductsSlider products={products} />
    </div>
  )
}

