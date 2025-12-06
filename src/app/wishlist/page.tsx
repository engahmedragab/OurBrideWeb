'use client'

import { useState } from 'react'
import { UserPageLayout } from '@/components/layout'
import {
  EmptyState,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ServiceGrid,
  ProductGrid,
} from '@/components/ui'
import type { Service } from '@/types/service'
import type { Product } from '@/types/product'
import { ChevronDown } from 'lucide-react'
import orderEmptySvg from '@/assets/svg/order-empty.svg'

// Mock wishlist services data
const mockWishlistServices: Service[] = [
  {
    id: '1',
    title: 'Service Title',
    description: 'Professional bridal makeup for your special day.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    ],
    provider: {
      id: '1',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 24 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    isWishlisted: true,
    showTopOfferBadge: true,
  },
  {
    id: '2',
    title: 'Service Title',
    description: 'Expert hair styling and hairdo for weddings.',
    images: [
      'https://images.unsplash.com/photo-1560066984-10d1eeb6b2a5?w=400',
    ],
    provider: {
      id: '2',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 24 },
    category: { id: '2', name: 'Hair Care', slug: 'hair-care' },
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    isWishlisted: true,
    showTopOfferBadge: true,
  },
  {
    id: '3',
    title: 'Service Title',
    description: 'Complete skincare routine for glowing bridal skin.',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    ],
    provider: {
      id: '3',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 24 },
    category: { id: '3', name: 'Skin Care', slug: 'skin-care' },
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    isWishlisted: true,
    showTopOfferBadge: true,
  },
  {
    id: '4',
    title: 'Service Title',
    description: 'Full body spa treatment for pre-wedding relaxation.',
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    ],
    provider: {
      id: '4',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 24 },
    category: { id: '4', name: 'Spa & Massage', slug: 'spa-massage' },
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    isWishlisted: true,
    showTopOfferBadge: true,
  },
  {
    id: '5',
    title: 'Service Title',
    description: 'Professional wedding photography services.',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    ],
    provider: {
      id: '5',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 24 },
    category: { id: '5', name: 'Photography', slug: 'photography' },
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: true,
    },
    isWishlisted: true,
    showTopOfferBadge: true,
  },
  {
    id: '6',
    title: 'Service Title',
    description: 'Cinematic wedding videography services.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=400',
    ],
    provider: {
      id: '6',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 24 },
    category: { id: '6', name: 'Videography', slug: 'videography' },
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: true,
    },
    isWishlisted: true,
    showTopOfferBadge: true,
  },
]

// Mock wishlist products data
const mockWishlistProducts: Product[] = [
  {
    id: '1',
    title: 'Product Title',
    description: 'Premium quality wedding cream for bridal beauty.',
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
    ],
    provider: {
      id: '1',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 6000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 128 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Makeup', 'Body Care'],
    inStock: true,
    isWishlisted: true,
    showTopOfferBadge: true,
  },
  {
    id: '2',
    title: 'Product Title',
    description: 'Complete bridal makeup kit for your special day.',
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
    ],
    provider: {
      id: '2',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 89 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Makeup', 'Kit'],
    inStock: true,
    isWishlisted: true,
    showTopOfferBadge: true,
  },
  {
    id: '3',
    title: 'Product Title',
    description: 'Professional hair care products for wedding styling.',
    images: [
      'https://images.unsplash.com/photo-1583241801824-9055b66b9d29?w=400',
    ],
    provider: {
      id: '3',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 5500, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 67 },
    category: { id: '2', name: 'Hair Care', slug: 'hair-care' },
    tags: ['Hair', 'Care'],
    inStock: true,
    isWishlisted: true,
  },
  {
    id: '4',
    title: 'Product Title',
    description: 'Complete skincare routine for glowing bridal skin.',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    ],
    provider: {
      id: '4',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 6000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 94 },
    category: { id: '3', name: 'Skin Care', slug: 'skin-care' },
    tags: ['Skin', 'Care'],
    inStock: true,
    isWishlisted: true,
  },
  {
    id: '5',
    title: 'Product Title',
    description: 'Premium wedding accessories collection.',
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
    ],
    provider: {
      id: '5',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 4000, discounted: 3500, currency: 'egp' },
    rating: { value: 4.5, count: 56 },
    category: { id: '4', name: 'Accessories', slug: 'accessories' },
    tags: ['Accessories', 'Wedding'],
    inStock: true,
    isWishlisted: true,
    showTopOfferBadge: true,
  },
  {
    id: '6',
    title: 'Product Title',
    description: 'Luxury bridal beauty essentials set.',
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
    ],
    provider: {
      id: '6',
      name: 'Provider Name',
      verified: true,
    },
    price: { original: 7000, discounted: 5500, currency: 'egp' },
    rating: { value: 4.5, count: 112 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Makeup', 'Beauty'],
    inStock: true,
    isWishlisted: true,
  },
]

export default function WishlistPage() {
  const [wishlistType, setWishlistType] = useState<'services' | 'products'>('services')
  const [wishlistServices, setWishlistServices] = useState<Service[]>(mockWishlistServices)
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>(mockWishlistProducts)

  const hasServices = wishlistServices.length > 0
  const hasProducts = wishlistProducts.length > 0
  const hasWishlistItems =
    (wishlistType === 'services' && hasServices) ||
    (wishlistType === 'products' && hasProducts)

  const handleServiceWishlistToggle = (serviceId: string) => {
    // Remove from wishlist
    setWishlistServices(prev => prev.filter(service => service.id !== serviceId))
  }

  const handleProductWishlistToggle = (productId: string) => {
    // Remove from wishlist
    setWishlistProducts(prev => prev.filter(product => product.id !== productId))
  }

  const handleBookNow = (_serviceId: string) => {
    // TODO: Implement book now
  }

  const handleAddToCart = (_productId: string) => {
    // TODO: Implement add to cart
  }

  return (
    <UserPageLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-32 font-semibold text-gray-900">
            Wishlist{' '}
            {hasWishlistItems && (
              <span className="text-20 font-normal text-gray-600">
                {wishlistType === 'services' ? wishlistServices.length : wishlistProducts.length} Items
              </span>
            )}
          </h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="brand"
                className="gap-2 px-4 py-2 text-14 font-medium text-white"
              >
                {wishlistType === 'services' ? 'Services' : 'Products'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => setWishlistType('services')}
                className={wishlistType === 'services' ? 'bg-brand-50' : ''}
              >
                Services
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setWishlistType('products')}
                className={wishlistType === 'products' ? 'bg-brand-50' : ''}
              >
                Products
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content Area */}
      {wishlistType === 'services' && hasServices ? (
        <ServiceGrid
          services={wishlistServices}
          onWishlistToggle={handleServiceWishlistToggle}
          onBookNow={handleBookNow}
          columns={3}
        />
      ) : wishlistType === 'products' && hasProducts ? (
        <ProductGrid
          products={wishlistProducts}
          onWishlistToggle={handleProductWishlistToggle}
          onAddToCart={handleAddToCart}
          columns={3}
        />
      ) : (
        <EmptyState
          illustration={orderEmptySvg}
          title="You don't have any items in your wishlist"
          description="Start exploring services and products to begin your journey"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      )}
    </UserPageLayout>
  )
}

