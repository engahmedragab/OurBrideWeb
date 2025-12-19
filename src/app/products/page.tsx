'use client'

import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { HeroCarousel, OfferBanner } from '@/components/ui'
import {
  ProductCategoriesSection,
  ProductOffersSection,
  WhyBridesChooseProductsSection,
  BestProvidersSection,
} from '@/components/products'
import type { Product } from '@/types/product'
import type {
  ProductCategory as CategoryType,
  Feature,
  Provider,
} from '@/components/products'
import flowersImage from '@/assets/images/flowers.png'
import perfumesIcon from '@/assets/category/perfumes.svg'
import skinCareIcon from '@/assets/category/skin-care.svg'
import boxesIcon from '@/assets/category/boxes.svg'
import hairCareIcon from '@/assets/category/hair-care.svg'
import bodyCareIcon from '@/assets/category/body-soap.svg'
import toolsDevicesIcon from '@/assets/category/tools-devices.svg'
import hairDryerIcon from '@/assets/category/hair-dryer.svg'
import whyBridesChooseProductsImage from '@/assets/images/bridProductSection.png'

// Mock data - Replace with API calls
const PRODUCT_CATEGORIES: CategoryType[] = [
  {
    id: 'perfumes',
    title: 'Perfumes',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/perfumes',
    icon: perfumesIcon,
  },
  {
    id: 'makeup',
    title: 'Makeup',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/makeup',
    icon: toolsDevicesIcon,
  },
  {
    id: 'skin-care',
    title: 'Skin Care',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/skin-care',
    icon: skinCareIcon,
  },
  {
    id: 'boxes',
    title: 'Boxes',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/boxes',
    icon: boxesIcon,
  },
  {
    id: 'hair-care',
    title: 'Hair Care',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/hair-care',
    icon: hairCareIcon,
  },
  {
    id: 'body-care',
    title: 'Body Care',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/body-care',
    icon: bodyCareIcon,
  },
  {
    id: 'tools-devices',
    title: 'Tools & Devices',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/tools-devices',
    icon: toolsDevicesIcon,
  },
  {
    id: 'hair-dryer',
    title: 'Hair-dryer',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/products/hair-dryer',
    icon: hairDryerIcon,
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

// Hero Carousel Slides
const heroSlides = [
  {
    id: '1',
    label: 'New Arrival',
    title: 'Avca Sun Cream',
    description:
      'A lightweight, moisture-rich sun cream designed to protect your skin while keeping it soft, fresh, and radiating a dewy, ready glow for brides who want flawless, healthy skin under makeup.',
    ctaText: 'Buy Now',
    ctaLink: '/products/avca-sun-cream',
    productImage:
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600',
    discountText: '30% OFF',
  },
  {
    id: '2',
    label: 'Top Seller',
    title: 'Essential Wedding Cream',
    description:
      'Premium quality products for your special day. Discover our curated collection of wedding essentials designed to make you look and feel your best.',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    productImage:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600',
    discountText: '50% OFF',
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-white">
        {/* Hero Carousel */}
        <HeroCarousel
          slides={heroSlides}
          autoPlay={true}
          autoPlayInterval={5000}
          showBackground={false}
        />

        {/* Consistent container wrapper for all other sections */}
        <div className="container-custom">
          {/* 2) ProductCategoriesSection */}
          <ProductCategoriesSection
            categories={PRODUCT_CATEGORIES}
            topText="Choose"
            highlightText="From"
            bottomText="Our Product"
            bottomHighlightText="Categories"
            headerAlignment="center"
          />

          {/* 3) ProductOffersSection */}
          <ProductOffersSection
            products={mockProducts}
            timerText="23 H 45 Min"
            title="Today's Best Product Offers"
            onWishlistToggle={handleWishlistToggle}
            onAddToCart={handleAddToCart}
          />

          {/* 4) WhyBridesChooseProductsSection */}
          <WhyBridesChooseProductsSection
            image={whyBridesChooseProductsImage}
            features={features}
            topText="Why"
            highlightText="Brides"
            bottomText="Choose"
            bottomHighlightText="OurBride Products"
            headerAlignment="center"
          />

          {/* 5) BestProvidersSection */}
          <BestProvidersSection
            providers={providers}
            topText="Best"
            highlightText="Providers"
            bottomText="With"
            bottomHighlightText="Best Products"
            headerAlignment="center"
            buttonText="Explore Now"
          />

          {/* 6) Newsletter Banner */}
          <div className="mb-12">
            <OfferBanner
              heading="Get Products Updates & Offers"
              description="Stay informed about new providers, offers, and wedding planning tips"
              variant="newsletter"
              ctaText="Subscribe"
              productImage={flowersImage}
              onSubscribe={handleSubscribe}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

