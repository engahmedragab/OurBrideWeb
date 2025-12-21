'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import {
  HeroCarousel,
  OfferBanner,
  Card,
  type ServiceCardData,
  type HeroSlide,
} from '@/components/ui'
import { WhyBridesChooseProductsSection } from '@/components/products/WhyBridesChooseProductsSection'
import {
  ProductCategoriesSection,
  type ProductCategory,
} from '@/components/products/ProductCategoriesSection'
import { BestProvidersSection } from '@/components/products/BestProvidersSection'
import type { Provider as BestProvider } from '@/components/products/BestProvidersSection'
import { AccessoriesIcon } from '@/assets/icons/AccessoriesIcon'
import { BouquetIcon } from '@/assets/icons/BouquetIcon'
import { BridalBeautyIcon } from '@/assets/icons/BridalBeautyIcon'
import { PhotographyIcon } from '@/assets/icons/PhotographyIcon'
import { WeddingCakeIcon } from '@/assets/icons/WeddingCakeIcon'
import { WeddingDressIcon } from '@/assets/icons/WeddingDressIcon'
import { WeddingHallIcon } from '@/assets/icons/WeddingHallIcon'
import { WeddingSuitIcon } from '@/assets/icons/WeddingSuitIcon'
import flowersImage from '@/assets/images/flowers.png'
import type { Service } from '@/types/service'
import why_trust_ourBrideImage from '@/assets/images/why_trust_ourBride.svg'

// Mock services for "Today's Offers" slider
const mockOffersServices: Service[] = [
  {
    id: '1',
    title: 'Wedding Makeup Service',
    description: 'Professional bridal makeup for your special day.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    ],
    provider: {
      id: '1',
      name: 'Beauty Studio Pro',
      verified: true,
    },
    price: { original: 5000, discounted: 4500, currency: 'egp' },
    rating: { value: 4.5, count: 128 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Makeup', 'Bridal'],
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
    showTopOfferBadge: true,
  },
  {
    id: '4',
    title: 'Spa & Relaxation Package',
    description: 'Full body spa treatment for pre-wedding relaxation.',
    images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'],
    provider: {
      id: '4',
      name: 'Luxury Spa',
      verified: true,
    },
    price: { original: 8000, discounted: 6500, currency: 'egp' },
    rating: { value: 4.9, count: 94 },
    category: { id: '4', name: 'Spa & Massage', slug: 'spa-massage' },
    tags: ['Spa', 'Massage', 'Relaxation'],
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
    showTopOfferBadge: true,
  },
  {
    id: '13',
    title: 'Bridal Makeup & Hair Package',
    description: 'Complete bridal beauty package with makeup and hair.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    ],
    provider: {
      id: '13',
      name: 'Complete Beauty',
      verified: true,
    },
    price: { original: 9000, discounted: 7500, currency: 'egp' },
    rating: { value: 4.9, count: 201 },
    category: { id: '1', name: 'Makeup', slug: 'makeup' },
    tags: ['Makeup', 'Hair', 'Package'],
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
    showTopOfferBadge: true,
  },
  {
    id: '18',
    title: 'Drone Videography',
    description: 'Aerial wedding videography with drone technology.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=400',
    ],
    provider: {
      id: '18',
      name: 'Aerial Video Pro',
      verified: true,
    },
    price: { original: 20000, discounted: 17000, currency: 'egp' },
    rating: { value: 4.9, count: 178 },
    category: { id: '6', name: 'Videography', slug: 'videography' },
    tags: ['Videography', 'Drone'],
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
    showTopOfferBadge: true,
  },
]

// Hero Carousel Slides
const heroSlides: HeroSlide[] = [
  {
    id: '1',
    label: 'Limited Offer | 2d 4h 45m',
    title: 'Wedding Makeup',
    description:
      'OurBride is your all-in-one platform for wedding planning and shopping. Find everything you need to create your perfect day.',
    ctaText: 'Book Now',
    ctaLink: '/services/category?category=1',
    productImage:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
    discountText: '30% OFF',
  },
  {
    id: '2',
    label: 'Top Seller',
    title: 'Bridal Photography',
    description:
      'Capture your special moments with our professional wedding photography services. Premium quality for your perfect day.',
    ctaText: 'Book Now',
    ctaLink: '/services/category?category=6',
    productImage:
      'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=600',
    discountText: '25% OFF',
  },
  {
    id: '3',
    label: 'New Arrival',
    title: 'Wedding Planning',
    description:
      'Complete wedding planning services to make your special day unforgettable. From venues to decorations, we have it all.',
    ctaText: 'Explore Now',
    ctaLink: '/services',
    productImage:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600',
    discountText: '20% OFF',
  },
]


// Features for "Why Brides Trust OurBride" section
const trustFeatures = [
  {
    title: 'Usp Title',
    description:
      'OurBride is your all-in-one platform for wedding planning .',
  },
  {
    title: 'Usp Title',
    description:
      'OurBride is your all-in-one platform for wedding planning .',
  },
  {
    title: 'Usp Title',
    description:
      'OurBride is your all-in-one platform for wedding planning .',
  },
  {
    title: 'Usp Title',
    description:
      'OurBride is your all-in-one platform for wedding planning .',
  },
]

// Categories for "Why Brides Trust OurBride" section (ProductCategoriesSection)
// Using all icons from assets/icons with icon name as id and title
const trustCategories: ProductCategory[] = [
  {
    id: 'accessories',
    title: 'Accessories',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/services/category?category=accessories',
    icon: <AccessoriesIcon className="w-20 h-20 text-brand-500" />,
  },
  {
    id: 'bouquet',
    title: 'Bouquet',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/services/category?category=bouquet',
    icon: <BouquetIcon className="w-20 h-20 text-brand-500" />,
  },
  {
    id: 'bridal-beauty',
    title: 'Bridal Beauty',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/services/category?category=bridal-beauty',
    icon: <BridalBeautyIcon className="w-20 h-20 text-brand-500" />,
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/services/category?category=photography',
    icon: <PhotographyIcon className="w-20 h-20 text-brand-500" />,
  },
  {
    id: 'wedding-cake',
    title: 'Wedding Cake',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/services/category?category=wedding-cake',
    icon: <WeddingCakeIcon className="w-20 h-20 text-brand-500" />,
  },
  {
    id: 'wedding-dress',
    title: 'Wedding Dress',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/services/category?category=wedding-dress',
    icon: <WeddingDressIcon className="w-20 h-20 text-brand-500" />,
  },
  {
    id: 'wedding-hall',
    title: 'Wedding Hall',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/services/category?category=wedding-hall',
    icon: <WeddingHallIcon className="w-20 h-20 text-brand-500" />,
  },
  {
    id: 'wedding-suit',
    title: 'Wedding Suit',
    description: 'Exclusive coupons and discounts designed for your budget.',
    href: '/services/category?category=wedding-suit',
    icon: <WeddingSuitIcon className="w-20 h-20 text-brand-500" />,
  },
]

// Demo providers for Best Providers section
const demoProviders = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Makeup Artist',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    rating: 4.8,
    isVerified: true,
  },
  {
    id: '2',
    name: 'Emily Davis',
    role: 'Hair Stylist',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    rating: 4.9,
    isVerified: true,
  },
  {
    id: '3',
    name: 'Jessica Brown',
    role: 'Photographer',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    rating: 4.7,
    isVerified: true,
  },
  {
    id: '4',
    name: 'Amanda Wilson',
    role: 'Wedding Planner',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    rating: 4.6,
    isVerified: true,
  },
  {
    id: '5',
    name: 'Maria Garcia',
    role: 'Florist',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    rating: 4.9,
    isVerified: true,
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    role: 'Cake Designer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rating: 4.8,
    isVerified: true,
  },
]

// Demo products for Best Products section
const demoProducts = [
  {
    id: '1',
    title: 'Bridal Makeup Collection',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    rating: 4.8,
    price: 4500,
    currency: 'egp',
    href: '/products/1',
  },
  {
    id: '2',
    title: 'Hair Styling Essentials',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
    rating: 4.9,
    price: 3200,
    currency: 'egp',
    href: '/products/2',
  },
  {
    id: '3',
    title: 'Wedding Photography Package',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    rating: 4.7,
    price: 8500,
    currency: 'egp',
    href: '/products/3',
  },
  {
    id: '4',
    title: 'Bridal Bouquet Collection',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    rating: 4.6,
    price: 2800,
    currency: 'egp',
    href: '/products/4',
  },
  {
    id: '5',
    title: 'Wedding Cake Designs',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    rating: 4.9,
    price: 5500,
    currency: 'egp',
    href: '/products/5',
  },
  {
    id: '6',
    title: 'Bridal Accessories Set',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    rating: 4.8,
    price: 1800,
    currency: 'egp',
    href: '/products/6',
  },
]

// Combine providers with products for BestProvidersSection
const bestProviders: BestProvider[] = demoProviders.map((provider, index) => ({
  id: provider.id,
  name: provider.name,
  image: provider.image,
  profession: provider.role,
  verified: provider.isVerified || false,
  rating: provider.rating,
  product: demoProducts[index] || demoProducts[0],
}))

/**
 * ServicesIntroPageContent - Main content component
 * Redirects to /services/category if filter params are present in URL
 */
function ServicesIntroPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Redirect logic: If any filter params are present, redirect to /services/category
  useEffect(() => {
    const hasFilterParams =
      searchParams.has('category') ||
      searchParams.has('subCategory') ||
      searchParams.has('priceRangeMin') ||
      searchParams.has('priceRangeMax') ||
      searchParams.has('rating') ||
      searchParams.has('availability') ||
      searchParams.has('sort') ||
      searchParams.has('page') ||
      searchParams.has('search')

    if (hasFilterParams) {
      const queryString = searchParams.toString()
      router.replace(`/services/category?${queryString}`)
    }
  }, [searchParams, router])

  const handleWishlistToggle = (_serviceId: string) => {
    // TODO: Implement wishlist toggle
  }

  const handleBookNow = (_serviceId: string) => {
    // TODO: Implement book now
  }

  // Convert Service to ServiceCardData for Today's Offers
  const offersServiceCards: ServiceCardData[] = mockOffersServices.map(
    service => ({
      id: service.id,
      image: service.images[0],
      title: service.title,
      providerName: service.provider.name,
      verified: service.provider.verified,
      rating: service.rating.value,
      originalPrice: service.price.original,
      discountedPrice: service.price.discounted,
      tags: service.tags,
      showTopOfferBadge: service.showTopOfferBadge,
      onWishlistToggle: () => handleWishlistToggle(service.id),
      onBookNow: () => handleBookNow(service.id),
    })
  )

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

        {/* Consistent container wrapper for all sections */}
        <div className="container-custom">
          {/* Section 2: Why Brides Trust OurBride - ProductCategoriesSection */}
          <ProductCategoriesSection
            categories={trustCategories}
            topText="Why"
            highlightText="Brides"
            bottomText="Trust"
            bottomHighlightText="OurBride"
            headerAlignment="center"
          />

          {/* Today's Offers Section */}
          <section className="py-12 md:py-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 md:mb-8">
              <h2 className="text-20 sm:text-24 md:text-30 font-medium text-gray-900 leading-tight sm:leading-[32px] md:leading-[40px]">
                Today&apos;s Offers
              </h2>
              <span className="text-14 sm:text-16 md:text-20 text-gray-500 whitespace-nowrap leading-normal sm:leading-[24px] md:leading-[32px]">
                23 H 45 Min
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offersServiceCards.map(cardData => (
                <Card key={cardData.id} cardData={{ type: 'service', ...cardData }} />
              ))}
            </div>
          </section>

          {/* Why Brides Trust OurBride - Features Section */}
          <section>
            <WhyBridesChooseProductsSection
              image={why_trust_ourBrideImage}
              features={trustFeatures}
              topText="Why"
              highlightText="Brides"
              bottomText="Trust"
              bottomHighlightText="OurBride"
              headerAlignment="center"
            />
          </section>

          {/* Section 4: Best Providers With Best Products */}
          <BestProvidersSection
            providers={bestProviders}
            topText="Best"
            highlightText="Providers"
            bottomText="With"
            bottomHighlightText="Best Products"
            headerAlignment="center"
            buttonText="Explore Now"
          />

          {/* Newsletter Banner */}
          <div className="mb-12">
            <OfferBanner
              offers={[
                {
                  heading: 'Ready To Get Our News ?',
                  description:
                    'OurBride is your all-in-one platform for wedding planning and shopping. Find everything you need to create your perfect day.',
                  variant: 'newsletter',
                  ctaText: 'Submit',
                  productImage: flowersImage,
                },
              ]}
              onSubscribe={_email => {
                // TODO: Implement newsletter subscription
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

/**
 * ServicesIntroPage - Introduction page for services
 * Wrapped in Suspense for useSearchParams compatibility
 * Route: /services
 */
export default function ServicesIntroPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-16 text-gray-600">Loading...</div>
        </div>
      }
    >
      <ServicesIntroPageContent />
    </Suspense>
  )
}
