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
import type {
  ProductCategory as CategoryType,
  Feature,
  Provider,
} from '@/components/products'
import {
  useProductCategories,
  useProductOffers,
  useProducts,
} from '@/Hooks/products'
import flowersImage from '@/assets/images/flowers.png'
import perfumesIcon from '@/assets/category/perfumes.svg'
import skinCareIcon from '@/assets/category/skin-care.svg'
import boxesIcon from '@/assets/category/boxes.svg'
import hairCareIcon from '@/assets/category/hair-care.svg'
import bodyCareIcon from '@/assets/category/body-soap.svg'
import toolsDevicesIcon from '@/assets/category/tools-devices.svg'
import hairDryerIcon from '@/assets/category/hair-dryer.svg'
import whyBridesChooseProductsImage from '@/assets/images/bridProductSection.png'
import { useMemo } from 'react'

// Category icon mapping - maps category slugs to icons
const categoryIconMap: Record<string, string> = {
  perfumes: perfumesIcon,
  makeup: toolsDevicesIcon,
  'skin-care': skinCareIcon,
  boxes: boxesIcon,
  'hair-care': hairCareIcon,
  'body-care': bodyCareIcon,
  'tools-devices': toolsDevicesIcon,
  'hair-dryer': hairDryerIcon,
}

// Default icon fallback
const defaultCategoryIcon = toolsDevicesIcon

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
  // Fetch data using hooks
  const { data: categories = [], isLoading: categoriesLoading } = useProductCategories()
  const { data: offerProducts = [], isLoading: offersLoading } = useProductOffers()
  const { data: allProducts = [], isLoading: productsLoading } = useProducts({
    pageSize: 8,
  })

  // Map API categories to component format
  const mappedCategories: CategoryType[] = useMemo(() => {
    return categories.map(category => ({
      id: category.id,
      title: category.name,
      description: 'Exclusive coupons and discounts designed for your budget.',
      href: `/products/category/${category.slug || category.id}`,
      icon: categoryIconMap[category.slug] || defaultCategoryIcon,
    }))
  }, [categories])

  // Use offer products if available, otherwise use regular products
  const displayProducts = offerProducts.length > 0 ? offerProducts : allProducts.slice(0, 4)

  const handleWishlistToggle = (_productId: string) => {
    // TODO: Implement wishlist toggle
  }

  const handleAddToCart = (_productId: string) => {
    // TODO: Implement add to cart
  }

  const handleSubscribe = (_email: string) => {
    // TODO: Implement newsletter subscription
  }

  // Show loading state
  if (categoriesLoading || offersLoading || productsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-18 text-gray-600">Loading products...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
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
          {mappedCategories.length > 0 && (
            <ProductCategoriesSection
              categories={mappedCategories}
              topText="Choose"
              highlightText="From"
              bottomText="Our Product"
              bottomHighlightText="Categories"
              headerAlignment="center"
            />
          )}

          {/* 3) ProductOffersSection */}
          {displayProducts.length > 0 && (
            <ProductOffersSection
              products={displayProducts}
              timerText="23 H 45 Min"
              title="Today's Best Product Offers"
              onWishlistToggle={handleWishlistToggle}
              onAddToCart={handleAddToCart}
            />
          )}

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
              offers={[
                {
                  heading: 'Get Products Updates & Offers',
                  description:
                    'Stay informed about new providers, offers, and wedding planning tips',
                  variant: 'newsletter',
                  ctaText: 'Subscribe',
                  productImage: flowersImage,
                },
              ]}
              onSubscribe={handleSubscribe}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

