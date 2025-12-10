'use client'

import { PromoHero } from '@/components/ui'
import {
  ProductCategoriesSection,
  ProductOffersSection,
  WhyBridesChooseProductsSection,
  BestProvidersSection,
  ProductsNewsletterSection,
} from '@/components/products'
import type { Product } from '@/types/product'
import type {
  ProductCategory as CategoryType,
  Feature,
  Provider,
} from '@/components/products'
import flowersImage from '@/assets/images/flowers.png'

// Mock data - Replace with API calls
const PRODUCT_CATEGORIES: CategoryType[] = [
  {
    id: 'perfumes',
    title: 'Perfumes',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/perfumes',
    icon: '/icons/perfume.svg',
  },
  {
    id: 'makeup',
    title: 'Makeup',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/makeup',
    icon: '/icons/makeup.svg',
  },
  {
    id: 'skin-care',
    title: 'Skin Care',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/skin-care',
    icon: '/icons/skin-care.svg',
  },
  {
    id: 'boxes',
    title: 'Boxes',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/boxes',
    icon: '/icons/boxes.svg',
  },
  {
    id: 'hair-care',
    title: 'Hair Care',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/hair-care',
    icon: '/icons/hair-care.svg',
  },
  {
    id: 'body-care',
    title: 'Body Care',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/body-care',
    icon: '/icons/body-care.svg',
  },
  {
    id: 'tools-devices',
    title: 'Tools & Devices',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/tools-devices',
    icon: '/icons/tools.svg',
  },
]

const mockProducts: Product[] = [
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
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 128 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Makeup', 'Body Care', 'Tag', 'Tag'],
    inStock: true,
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
    tags: ['Makeup', 'Body Care', 'Tag', 'Tag'],
    inStock: true,
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
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 67 },
    category: { id: '2', name: 'Hair Care', slug: 'hair-care' },
    tags: ['Makeup', 'Body Care', 'Tag', 'Tag'],
    inStock: true,
    showTopOfferBadge: true,
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
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 94 },
    category: { id: '3', name: 'Skin Care', slug: 'skin-care' },
    tags: ['Makeup', 'Body Care', 'Tag', 'Tag'],
    inStock: true,
    showTopOfferBadge: true,
  },
]

const features: Feature[] = [
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

const providers: Provider[] = [
  {
    id: '1',
    name: 'Hoda Mohamed',
    profession: 'Makeup Artist',
    verified: true,
    rating: 5,
    product: {
      id: '1',
      title: 'Product Title',
      image:
        'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
      rating: 4.5,
      price: 4500,
      currency: 'egp',
      href: '/products/1',
    },
  },
  {
    id: '2',
    name: 'Hoda Mohamed',
    profession: 'Makeup Artist',
    verified: true,
    rating: 5,
    product: {
      id: '2',
      title: 'Product Title',
      image:
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
      rating: 4.5,
      price: 4500,
      currency: 'egp',
      href: '/products/2',
    },
  },
  {
    id: '3',
    name: 'Hoda Mohamed',
    profession: 'Makeup Artist',
    verified: true,
    rating: 5,
    product: {
      id: '3',
      title: 'Product Title',
      image:
        'https://images.unsplash.com/photo-1583241801824-9055b66b9d29?w=400',
      rating: 4.5,
      price: 4500,
      currency: 'egp',
      href: '/products/3',
    },
  },
]

export default function ProductIntroPage() {
  const handleWishlistToggle = (productId: string) => {
    // TODO: Implement wishlist toggle
  }

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart
  }

  const handleSubscribe = (email: string) => {
    // TODO: Implement newsletter subscription
  }

  return (
    <div className="bg-white">
      {/* 1) PromoHero */}
      <PromoHero
        badge="New Arrival"
        title="Avca Sun Cream"
        description="A lightweight, moisture-rich sun cream designed to protect your skin while keeping it soft, fresh, and wedding-day ready. Ideal for brides who want flawless, healthy skin under makeup."
        ctaLabel="Buy Now"
        ctaLink="/products/avca-sun-cream"
        productImage="https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600"
        bannerImage="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200"
        discountText="30% OFF"
      />

      {/* 2) ProductCategoriesSection */}
      <ProductCategoriesSection categories={PRODUCT_CATEGORIES} />

      {/* 3) ProductOffersSection */}
      <ProductOffersSection
        products={mockProducts}
        timerText="23 H 45 Min"
        onWishlistToggle={handleWishlistToggle}
        onAddToCart={handleAddToCart}
      />

      {/* 4) WhyBridesChooseProductsSection */}
      <WhyBridesChooseProductsSection
        image="https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800"
        features={features}
      />

      {/* 5) BestProvidersSection */}
      <BestProvidersSection providers={providers} />

      {/* 6) ProductsNewsletterSection */}
      <ProductsNewsletterSection
        image={flowersImage}
        onSubscribe={handleSubscribe}
      />
    </div>
  )
}

