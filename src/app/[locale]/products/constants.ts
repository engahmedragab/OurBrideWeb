/**
 * Shared constants for product pages
 */

import type { ProductSortOption } from '@/types/product'
import type { HeroSlide } from '@/components/ui/HeroCarousel'
import type { Feature } from '@/components/products'
import group3Svg from '@/assets/svg/Group-3.svg'
import group1Svg from '@/assets/svg/Group-1.svg'

// Sort options for product listings
export const PRODUCT_SORT_OPTIONS: ProductSortOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
]

// Sort mapping for API
export const SORT_MAP: Record<string, string> = {
  'price-low': 'price_asc',
  'price-high': 'price_desc',
  rating: 'rating_desc',
  newest: 'date_desc',
  popular: 'popularity_desc',
}

// Default hero carousel slides
export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: '1',
    label: 'New Arrival',
    title: 'Avca Sun Cream',
    description:
      'A lightweight, moisture-rich sun cream designed to protect your skin while keeping it soft, fresh, and radiating a dewy, ready glow for brides who want flawless, healthy skin under makeup.',
    ctaText: 'Buy Now',
    ctaLink: '/products/avca-sun-cream',
    productImage: group3Svg.src || group3Svg,
  },
  {
    id: '2',
    label: 'Top Seller',
    title: 'Essential Wedding Cream',
    description:
      'Premium quality products for your special day. Discover our curated collection of wedding essentials designed to make you look and feel your best.',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    productImage: group1Svg.src || group1Svg,
  },
]

// Features for "Why Brides Choose Products" section
export const PRODUCT_FEATURES: Feature[] = [
  {
    title: 'Premium Brands',
    description:
      'Handpicked items from trusted, high-quality wedding suppliers',
  },
  {
    title: 'Bridal-Friendly Formulas',
    description:
      'Products selected to suit sensitive skin and long event days',
  },
  {
    title: 'Exclusive Discounts',
    description: "Special offers crafted to fit every bride's budget",
  },
  {
    title: 'Verified Sellers',
    description:
      'We work only with reliable, vetted beauty providers',
  },
]

// Default product grid columns
export const DEFAULT_PRODUCT_GRID_COLUMNS = 3

// Related products limit
export const RELATED_PRODUCTS_LIMIT = 4

// Default page size for products
export const DEFAULT_PAGE_SIZE = 100

// Maximum hero slides to display
export const MAX_HERO_SLIDES = 5

// Default products to display on home page
export const DEFAULT_HOME_PRODUCTS_COUNT = 4

