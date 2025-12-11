'use client'

import {
  ProductCategoriesSection,
  ProductOffersSection,
  WhyBridesChooseProductsSection,
  BestProvidersWithProductsSection,
  ProductsNewsletterSection,
  ProductsHeroSlider,
  type ProductsProvider,
  type ProductsProduct,
} from '@/components/products'
import type { Product } from '@/types/product'
import type {
  ProductCategory as CategoryType,
  Feature,
} from '@/components/products'
import flowersImage from '@/assets/images/flowers.png'
import perfumesIcon from '@/assets/category/perfumes.svg'
import makeupIcon from '@/assets/category/makeup.svg'
import skinCareIcon from '@/assets/category/skin-care.svg'
import boxesIcon from '@/assets/category/boxes.svg'
import hairCareIcon from '@/assets/category/hair-care.svg'
import bodyCareIcon from '@/assets/category/body-soap.svg'
import toolsDevicesIcon from '@/assets/category/tools-devices.svg'
import hairDryerIcon from '@/assets/category/hair-dryer.svg'
import whyBridesChooseProductsImage from '@/assets/images/bridProductSection.png'
import bridProductSectionImage from '@/assets/images/bridProductSection.png'
import productIntroImage from '@/assets/images/productintro.png'


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

// Providers data for slider
const providersData: ProductsProvider[] = [
  {
    id: '1',
    name: 'Hoda Mohamed',
    profession: 'Makeup Artist',
    verified: true,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    profession: 'Hair Stylist',
    verified: true,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
  },
  {
    id: '3',
    name: 'Emily Davis',
    profession: 'Makeup Artist',
    verified: true,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  },
  {
    id: '4',
    name: 'Jessica Brown',
    profession: 'Photographer',
    verified: true,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  },
  {
    id: '5',
    name: 'Maria Garcia',
    profession: 'Bridal Consultant',
    verified: true,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
  },
]

// Products data for slider
const productsData: ProductsProduct[] = [
  {
    id: '1',
    title: 'Bridal Makeup Collection',
    image: bridProductSectionImage.src,
    rating: 4.8,
    price: 4500,
    currency: 'egp',
    href: '/products/1',
    ctaText: 'Explore Now',
  },
  {
    id: '2',
    title: 'Hair Styling Essentials',
    image: bridProductSectionImage.src,
    rating: 4.9,
    price: 3200,
    currency: 'egp',
    href: '/products/2',
    ctaText: 'Explore Now',
  },
  {
    id: '3',
    title: 'Wedding Photography Package',
    image: bridProductSectionImage.src,
    rating: 4.7,
    price: 8500,
    currency: 'egp',
    href: '/products/3',
    ctaText: 'Explore Now',
  },
  {
    id: '4',
    title: 'Bridal Skincare Set',
    image: bridProductSectionImage.src,
    rating: 4.6,
    price: 2800,
    currency: 'egp',
    href: '/products/4',
    ctaText: 'Explore Now',
  },
  {
    id: '5',
    title: 'Complete Beauty Package',
    image: bridProductSectionImage.src,
    rating: 4.9,
    price: 5500,
    currency: 'egp',
    href: '/products/5',
    ctaText: 'Explore Now',
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

  // Demo images for the slider
  const demoSliderImages = [
    productIntroImage.src,
    productIntroImage.src,
    productIntroImage.src,
    productIntroImage.src,
    productIntroImage.src,
  ]

  return (
    <div className="bg-white">
      {/* 1) ProductsHeroSlider */}
      <ProductsHeroSlider className="w-full" images={demoSliderImages} />

      {/* 2) ProductCategoriesSection */}
      <section className="container-custom py-8 md:py-12">
        <ProductCategoriesSection
          categories={PRODUCT_CATEGORIES}
          topText="Choose"
          highlightText="From"
          bottomText="Our Product"
          bottomHighlightText="Categories"
          headerAlignment="center"
        />
      </section>

      {/* 3) ProductOffersSection */}
      <section className="container-custom py-8 md:py-12">
        <ProductOffersSection
          products={mockProducts}
          timerText="23 H 45 Min"
          title="Today's Best Product Offers"
          onWishlistToggle={handleWishlistToggle}
          onAddToCart={handleAddToCart}
        />
      </section>

      {/* 4) WhyBridesChooseProductsSection */}
      <section className="container-custom py-8 md:py-12">
        <WhyBridesChooseProductsSection
          image={whyBridesChooseProductsImage}
          features={features}
          topText="Why"
          highlightText="Brides"
          bottomText="Choose"
          bottomHighlightText="OurBride Products"
          headerAlignment="center"
        />
      </section>

      {/* 5) BestProvidersWithProductsSection */}
      <section className="container-custom py-8 md:py-12">
        <BestProvidersWithProductsSection
          topText="Best"
          highlightText="Providers"
          bottomText="With"
          bottomHighlightText="Best Products"
          headerAlignment="center"
          providers={providersData}
          products={productsData}
        />
      </section>

      {/* 6) ProductsNewsletterSection */}
      <section className="container-custom py-8 md:py-12">
        <ProductsNewsletterSection
          image={flowersImage}
          title="Get Products Updates & Offers"
          description="Stay informed about new providers, offers, and wedding planning tips"
          placeholder="Enter Your E-mail"
          buttonText="Subscribe"
          onSubscribe={handleSubscribe}
        />
      </section>
    </div>
  )
}

