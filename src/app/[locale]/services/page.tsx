'use client'

import React, { useEffect, Suspense, useCallback, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import {
  HeroCarousel,
  OfferBanner,
  Card,
  LoadingSpinner,
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
import why_trust_ourBrideImage from '@/assets/images/why_trust_ourBride.svg'
import { useServicesHome } from '@/hooks/services/useServicesHome'

// Icon map - created once to avoid recreation
const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  accessories: <AccessoriesIcon className="w-20 h-20 text-brand-500" />,
  bouquet: <BouquetIcon className="w-20 h-20 text-brand-500" />,
  'bridal-beauty': <BridalBeautyIcon className="w-20 h-20 text-brand-500" />,
  photography: <PhotographyIcon className="w-20 h-20 text-brand-500" />,
  'wedding-cake': <WeddingCakeIcon className="w-20 h-20 text-brand-500" />,
  'wedding-dress': <WeddingDressIcon className="w-20 h-20 text-brand-500" />,
  'wedding-hall': <WeddingHallIcon className="w-20 h-20 text-brand-500" />,
  'wedding-suit': <WeddingSuitIcon className="w-20 h-20 text-brand-500" />,
}

// Helper function to map category name to icon
const getCategoryIcon = (categoryName: string): React.ReactNode => {
  const normalizedName = categoryName.toLowerCase().replace(/\s+/g, '-')
  return CATEGORY_ICON_MAP[normalizedName] || CATEGORY_ICON_MAP[Object.keys(CATEGORY_ICON_MAP)[0]] || null
}

// Static features for "Why Brides Trust OurBride" section
const TRUST_FEATURES = [
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

/**
 * ServicesIntroPageContent - Main content component
 * Redirects to /services/category if filter params are present in URL
 */
function ServicesIntroPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data, isLoading, error } = useServicesHome()

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

  const handleWishlistToggle = useCallback((_serviceId: string) => {
    // TODO: Implement wishlist toggle
  }, [])

  const handleBookNow = useCallback(
    (serviceId: string) => {
      router.push(`/booking/${serviceId}`)
    },
    [router]
  )

  // Default hero slides for services (same as category page)
  const DEFAULT_SERVICE_HERO_SLIDES: HeroSlide[] = [
    {
      id: '1',
      label: 'Featured Service',
      title: 'Bridal Makeup & Hair',
      description:
        'Professional bridal beauty services to make you look stunning on your special day. Expert makeup artists and hairstylists ready to create your perfect bridal look.',
      ctaText: 'Book Now',
      ctaLink: '/services/category',
      productImage:
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
      discountText: '30% OFF',
    },
    {
      id: '2',
      label: 'Top Rated',
      title: 'Wedding Photography',
      description:
        'Capture your precious moments with our professional wedding photography services. Experienced photographers dedicated to creating beautiful memories.',
      ctaText: 'Explore Services',
      ctaLink: '/services/category',
      productImage:
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
      discountText: '50% OFF',
    },
  ]

  // Map API data to hero slides - use same images as category page
  const heroSlides: HeroSlide[] = useMemo(
    () => {
      if (data?.heroSlides && data.heroSlides.length > 0) {
        return data.heroSlides.map((slide, index) => {
          // Use the same images from DEFAULT_SERVICE_HERO_SLIDES based on index
          const defaultSlide = DEFAULT_SERVICE_HERO_SLIDES[index % DEFAULT_SERVICE_HERO_SLIDES.length]
          return {
            ...slide,
            productImage: defaultSlide.productImage, // Use same images as category page
            discountText: slide.discountText || defaultSlide.discountText,
          }
        })
      }
      return DEFAULT_SERVICE_HERO_SLIDES
    },
    [data?.heroSlides]
  )

  const offersServiceCards: ServiceCardData[] = useMemo(
    () =>
      data?.offers && data.offers.length > 0
        ? data.offers.map(service => ({
            ...service,
            onWishlistToggle: () => handleWishlistToggle(service.id),
            onBookNow: () => handleBookNow(service.id),
          }))
        : [],
    [data?.offers, handleWishlistToggle, handleBookNow]
  )

  const trustCategories: ProductCategory[] = useMemo(
    () =>
      data?.categories && data.categories.length > 0
        ? data.categories.map(category => ({
            id: String(category.id),
            title: category.name,
            description:
              category.description ||
              'Exclusive coupons and discounts designed for your budget.',
            href: `/services/category?category=${category.id}`,
            icon: getCategoryIcon(category.name),
          }))
        : [],
    [data?.categories]
  )


  // Map providers to BestProvider format - memoized
  const bestProviders: BestProvider[] = useMemo(() => {
    if (!data?.providers || data.providers.length === 0) return []

    // Format profession helper - moved outside map for better performance
    const formatProfession = (profession: string): string => {
      if (!profession) return 'Service Provider'
      const services = profession.split(',').map(s => s.trim())
      if (services.length <= 2) {
        return profession
      }
      // Show first 2 services with ellipsis
      return services.slice(0, 2).join(', ') + (services.length > 2 ? '...' : '')
    }

    return data.providers
      .slice(0, 6) // Limit to 6 providers
      .map((provider, index) => {
        // Get a service from offers for each provider, or use first service
        const providerService =
          data?.offers?.find(
            (service: ServiceCardData) => service.providerName === provider.name
          ) || data?.offers?.[index % (data?.offers?.length || 1)]

        return {
          id: provider.id,
          name: provider.name,
          image: provider.image || '',
          profession: formatProfession(provider.profession || 'Service Provider'),
          verified: provider.verified || false,
          rating: provider.rating || 0,
          product: providerService
            ? {
                id: providerService.id,
                title: providerService.title,
                image: providerService.image,
                rating: providerService.rating,
                price: providerService.originalPrice,
                currency: 'egp',
                href: `/services/category/${providerService.id}`,
              }
            : {
                id: provider.id,
                title: 'View Services',
                image: '',
                rating: provider.rating || 0,
                price: 0,
                currency: 'egp',
                href: `/services?provider=${provider.id}`,
              },
        }
      })
  }, [data?.providers, data?.offers])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading..." fullScreen={true} />
        </main>
        <Footer />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-16 text-red-600">
            Error loading services. Please try again later.
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Carousel */}
        {heroSlides.length > 0 && (
          <HeroCarousel
            slides={heroSlides}
            autoPlay={true}
            autoPlayInterval={5000}
            showBackground={false}
          />
        )}

        {/* Consistent container wrapper for all sections */}
        <div className="container-custom">
          {/* Section 2: Why Brides Trust OurBride - ProductCategoriesSection */}
          {trustCategories.length > 0 && (
            <ProductCategoriesSection
              categories={trustCategories}
              topText="Why"
              highlightText="Brides"
              bottomText="Trust"
              bottomHighlightText="OurBride"
              headerAlignment="center"
            />
          )}

          {/* Today's Offers Section */}
          {offersServiceCards.length > 0 && (
            <section className="py-8 md:py-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 md:mb-8">
                <h2 className="text-20 sm:text-24 md:text-30 font-medium text-gray-900 leading-tight sm:leading-[32px] md:leading-[40px]">
                  Today&apos;s Offers
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {offersServiceCards.map(cardData => (
                  <Card key={cardData.id} cardData={{ type: 'service', ...cardData }} />
                ))}
              </div>
            </section>
          )}

          {/* Why Brides Trust OurBride - Features Section */}
          {TRUST_FEATURES.length > 0 && (
            <section>
              <WhyBridesChooseProductsSection
                image={why_trust_ourBrideImage}
                features={TRUST_FEATURES}
                topText="Why"
                highlightText="Brides"
                bottomText="Trust"
                bottomHighlightText="OurBride"
                headerAlignment="center"
              />
            </section>
          )}

          {/* Section 4: Best Providers With Best Products */}
          {bestProviders.length > 0 && (
            <BestProvidersSection
              providers={bestProviders}
              topText="Best"
              highlightText="Providers"
              bottomText="With"
              bottomHighlightText="Best Products"
              headerAlignment="center"
              buttonText="Explore Now"
            />
          )}

          {/* Newsletter Banner */}
          <div className="py-8 md:py-12">
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
              noContainer={true}
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
          <LoadingSpinner size="lg" text="Loading..." fullScreen={true} />
        </div>
      }
    >
      <ServicesIntroPageContent />
    </Suspense>
  )
}
