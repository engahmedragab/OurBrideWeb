'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import {
  ProductGrid,
  ProductList,
  ProductFilters,
  ProductSort,
  HeroCarousel,
  Button,
  OfferBanner,
} from '@/components/ui'
import { Grid3x3, List } from 'lucide-react'
import flowersImage from '@/assets/images/flowers.png'
import type {
  Product,
  ProductFilter,
  ProductCategory,
  ProductSortOption,
  ProductViewMode,
} from '@/types/product'

// Mock data - Replace with API calls
const mockCategories: ProductCategory[] = [
  { id: '1', name: 'Makeup', slug: 'makeup', productCount: 45 },
  { id: '2', name: 'Hair Care', slug: 'hair-care', productCount: 32 },
  { id: '3', name: 'Skin Care', slug: 'skin-care', productCount: 28 },
  { id: '4', name: 'Accessories', slug: 'accessories', productCount: 15 },
]

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Essential Wedding Cream',
    description: 'Premium quality wedding cream for bridal beauty.',
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
    ],
    provider: {
      id: '1',
      name: 'YUNJAC',
      verified: true,
    },
    price: { original: 6000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 128 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Makeup', 'Body Care'],
    inStock: true,
    showTopOfferBadge: true,
  },
  {
    id: '2',
    title: 'Bridal Makeup Kit',
    description: 'Complete bridal makeup kit for your special day.',
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
    ],
    provider: {
      id: '2',
      name: 'Beauty Pro',
      verified: true,
    },
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 89 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Makeup', 'Kit'],
    inStock: true,
    showTopOfferBadge: true,
  },
  {
    id: '3',
    title: 'Hair Care Essentials',
    description: 'Professional hair care products for wedding styling.',
    images: [
      'https://images.unsplash.com/photo-1583241801824-9055b66b9d29?w=400',
    ],
    provider: {
      id: '3',
      name: 'Hair Studio',
      verified: true,
    },
    price: { original: 5500, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 67 },
    category: { id: '2', name: 'Hair Care', slug: 'hair-care' },
    tags: ['Hair', 'Care'],
    inStock: true,
  },
  {
    id: '4',
    title: 'Skin Care Bundle',
    description: 'Complete skincare routine for glowing bridal skin.',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    ],
    provider: {
      id: '4',
      name: 'Skincare Co',
      verified: true,
    },
    price: { original: 6000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 94 },
    category: { id: '3', name: 'Skin Care', slug: 'skin-care' },
    tags: ['Skin', 'Care'],
    inStock: true,
  },
]

const sortOptions: ProductSortOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
]

// Hero Carousel Slides
const heroSlides = [
  {
    id: '1',
    label: 'New Arrival',
    title: 'Avca Sun Cream',
    description:
      'OurBride is your all-in-one platform for wedding planning and shopping. Find everything you need to create your perfect day.',
    ctaText: 'Buy Now',
    ctaLink: '/products/1',
    productImage:
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600',
    discountText: '50% OFF',
  },
  {
    id: '2',
    label: 'Top Seller',
    title: 'Essential Wedding Cream',
    description:
      'Premium quality products for your special day. Discover our curated collection of wedding essentials.',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    productImage:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600',
    discountText: '30% OFF',
  },
]

export default function Products() {
  const [viewMode, setViewMode] = useState<ProductViewMode>('grid')
  const [filters, setFilters] = useState<ProductFilter>({})
  const [sortBy, setSortBy] = useState('default')

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...mockProducts]

    // Apply filters
    if (filters.category && filters.category.length > 0) {
      result = result.filter(p => filters.category!.includes(p.category.id))
    }

    if (filters.priceRange) {
      result = result.filter(
        p =>
          p.price.discounted >= filters.priceRange!.min &&
          p.price.discounted <= filters.priceRange!.max
      )
    }

    if (filters.rating) {
      result = result.filter(p => p.rating.value >= filters.rating!)
    }

    if (filters.inStock !== undefined) {
      result = result.filter(p => p.inStock === filters.inStock)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price.discounted - b.price.discounted)
        break
      case 'price-high':
        result.sort((a, b) => b.price.discounted - a.price.discounted)
        break
      case 'rating':
        result.sort((a, b) => b.rating.value - a.rating.value)
        break
      case 'newest':
        // Assuming products have createdAt, sort by newest
        result.reverse()
        break
      case 'popular':
        result.sort((a, b) => b.rating.count - a.rating.count)
        break
      default:
        // Keep original order
        break
    }

    return result
  }, [filters, sortBy])

  const handleWishlistToggle = (productId: string) => {
    // TODO: Implement wishlist toggle
  }

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Carousel */}
        <HeroCarousel
          slides={heroSlides}
          autoPlay={true}
          autoPlayInterval={5000}
          showBackground={false}
        />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar: Filters */}
            <aside className="lg:col-span-1">
              <ProductFilters
                categories={mockCategories}
                filters={filters}
                onFiltersChange={setFilters}
                onReset={() => setFilters({})}
              />
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-14 text-gray-600">
                    {filteredAndSortedProducts.length} products found
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ProductSort
                    sortOptions={sortOptions}
                    currentSort={sortBy}
                    onSortChange={setSortBy}
                  />
                  <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {viewMode === 'grid' ? (
                <ProductGrid
                  products={filteredAndSortedProducts}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                  columns={3}
                />
              ) : (
                <ProductList
                  products={filteredAndSortedProducts}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                />
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Banner */}
        <div className="mb-12">
          <OfferBanner
            heading="Ready To Get Our News ?"
            description="OurBride is your all-in-one platform for wedding planning and shopping. Find everything you need to create your perfect day."
            variant="newsletter"
            ctaText="Submit"
            productImage={flowersImage}
            onSubscribe={email => {
              // TODO: Implement newsletter subscription
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
