'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import {
  Card,
  type ProductCardData,
  type ServiceCardData,
  type TestimonialCardData,
  type ProviderCardData,
  type MemberTestimonialCardData,
} from '@/components/ui'
import {
  useProductCardHandlers,
  useServiceCardHandlers,
  useProviderCardHandlers,
  useAddProductToCart,
} from '@/Hooks'
import {
  OfferBanner,
  CardSkeleton,
  ProviderCardSkeleton,
  TestimonialCardSkeleton,
  MemberTestimonialCardSkeleton,
} from '@/components/ui'

import { StoreBadges } from '@/components/ui/StoreBadges'
import { Pagination } from '@/components/ui/Pagination'
import {
  Users,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  CheckCircle2,
  Tag,
  Shield,
  TargetIcon,
  Quote,
} from 'lucide-react'
import heroBrideImage from '@/assets/images/Hero-Bride.png'
import heroCardBrideImage from '@/assets/images/HeroCard-Bride.png'
import heroCircularSvg from '@/assets/svg/Hero-circular.svg'
import lineS2Svg from '@/assets/svg/Line-s2.svg'
import lineS4Svg from '@/assets/svg/Line-s4.svg'
import phoneImage from '@/assets/images/phone.png'
import { useHome } from '@/hooks/home'
import { extractHomeData } from '@/utils'
import {
  TRUST_CARDS,
  JOURNEY_STEPS,
  TRUST_CARD_POSITION_CLASSES,
  PAGINATION_CONFIG,
} from '@/constants'

export default function Home() {
  // Fetch home data from API
  const { data: homeData, isLoading } = useHome()

  // Extract and map API data
  const apiData = useMemo(() => {
    if (homeData) {
      return extractHomeData(homeData)
    }
    return {}
  }, [homeData])

  // Use API data, return empty arrays if not available
  const products = useMemo(() => apiData.products || [], [apiData.products])
  const services = useMemo(() => apiData.services || [], [apiData.services])
  const testimonials = useMemo(
    () => apiData.testimonials || [],
    [apiData.testimonials]
  )
  const providers = useMemo(() => apiData.providers || [], [apiData.providers])
  const memberTestimonials = useMemo(
    () => apiData.memberTestimonials || [],
    [apiData.memberTestimonials]
  )
  const banners = useMemo(() => apiData.banners || [], [apiData.banners])

  // Products pagination state
  const [productsPage, setProductsPage] = useState(1)
  const productsTotalPages = Math.ceil(
    products.length / PAGINATION_CONFIG.PRODUCTS_PER_PAGE
  )
  const paginatedProducts = useMemo(() => {
    const startIndex = (productsPage - 1) * PAGINATION_CONFIG.PRODUCTS_PER_PAGE
    const endIndex = startIndex + PAGINATION_CONFIG.PRODUCTS_PER_PAGE
    return products.slice(startIndex, endIndex)
  }, [products, productsPage])

  // Services pagination state
  const [servicesPage, setServicesPage] = useState(1)
  const servicesTotalPages = Math.ceil(
    services.length / PAGINATION_CONFIG.SERVICES_PER_PAGE
  )
  const paginatedServices = useMemo(() => {
    const startIndex = (servicesPage - 1) * PAGINATION_CONFIG.SERVICES_PER_PAGE
    const endIndex = startIndex + PAGINATION_CONFIG.SERVICES_PER_PAGE
    return services.slice(startIndex, endIndex)
  }, [services, servicesPage])

  // Testimonials carousel state
  const [testimonialsIndex, setTestimonialsIndex] = useState(0)
  const testimonialsTotalPages = Math.ceil(
    testimonials.length / PAGINATION_CONFIG.TESTIMONIALS_PER_PAGE
  )

  const goToTestimonialsPrevious = () => {
    setTestimonialsIndex(prev =>
      prev === 0 ? testimonialsTotalPages - 1 : prev - 1
    )
  }

  const goToTestimonialsNext = () => {
    setTestimonialsIndex(prev => (prev + 1) % testimonialsTotalPages)
  }

  const goToTestimonialsPage = (index: number) => {
    setTestimonialsIndex(index)
  }

  // Member testimonials carousel state
  const [memberTestimonialsIndex, setMemberTestimonialsIndex] = useState(0)
  const memberTestimonialsTotalPages = Math.ceil(
    memberTestimonials.length / PAGINATION_CONFIG.MEMBER_TESTIMONIALS_PER_PAGE
  )

  const goToMemberTestimonialsPrevious = () => {
    setMemberTestimonialsIndex(prev =>
      prev === 0 ? memberTestimonialsTotalPages - 1 : prev - 1
    )
  }

  const goToMemberTestimonialsNext = () => {
    setMemberTestimonialsIndex(
      prev => (prev + 1) % memberTestimonialsTotalPages
    )
  }

  const goToMemberTestimonialsPage = (index: number) => {
    setMemberTestimonialsIndex(index)
  }

  const currentTestimonials = testimonials.slice(
    testimonialsIndex * PAGINATION_CONFIG.TESTIMONIALS_PER_PAGE,
    testimonialsIndex * PAGINATION_CONFIG.TESTIMONIALS_PER_PAGE +
    PAGINATION_CONFIG.TESTIMONIALS_PER_PAGE
  )

  const currentMemberTestimonials = memberTestimonials.slice(
    memberTestimonialsIndex * PAGINATION_CONFIG.MEMBER_TESTIMONIALS_PER_PAGE,
    memberTestimonialsIndex * PAGINATION_CONFIG.MEMBER_TESTIMONIALS_PER_PAGE +
    PAGINATION_CONFIG.MEMBER_TESTIMONIALS_PER_PAGE
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Section 1: Hero */}
        <section className="container-custom py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-6">
              {/* Active Users */}
              <div className="flex items-center gap-3 -mt-2">
                <span className="text-14 font-semibold text-gray-700">
                  <span className="text-gray-500 font-normal text-24">+6K</span>
                  <span className="text-gray-500 font-normal text-14">
                    Active Users
                  </span>
                </span>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center overflow-hidden"
                    >
                      <Users className="h-5 w-5 text-brand-500" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-start">
                <span className="px-4 py-1.5 rounded-full bg-brand-500 text-white text-14 font-semibold">
                  All-in-one platform for wedding.
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-24 sm:text-30 md:text-40 lg:text-48 font-semibold text-gray-900 leading-tight mt-2">
                YOUR BRIDE ALWAYS IS <br />
                <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                  OUR RESPONSIBILITY.
                </span>
              </h1>

              {/* Description */}
              <p className="text-14 sm:text-16 md:text-18 text-gray-600 leading-relaxed max-w-lg">
                OurBride is your all-in-one platform for wedding planning and
                shopping. Find everything you need to create your perfect day.
              </p>
            </div>

            {/* Center: Bride Image */}
            <div className="relative flex items-center justify-center">
              {/* Main Bride Image - Centered */}
              <div className="relative">
                {/* Circular Image Container with Gradient Border */}
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                  {/* SVG Border */}
                  <Image
                    src={
                      typeof heroCircularSvg === 'string'
                        ? heroCircularSvg
                        : heroCircularSvg.src
                    }
                    alt=""
                    fill
                    sizes="(max-width: 768px) 320px, 384px"
                    className="absolute inset-0"
                    aria-hidden="true"
                    priority
                  />
                  {/* Bride Image */}
                  <div className="absolute inset-[6.52px] rounded-full overflow-hidden z-10">
                    <Image
                      src={
                        typeof heroBrideImage === 'string'
                          ? heroBrideImage
                          : heroBrideImage.src
                      }
                      alt="Happy Bride"
                      fill
                      sizes="(max-width: 768px) 307px, 371px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content: Circular Text and Explore Products Card */}
            <div className="relative flex flex-col items-center lg:items-center gap-4 z-10">
              {/* Circular Badge Button */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
                {/* Outer Rotating Text Ring */}
                <svg
                  viewBox="0 0 120 120"
                  className="absolute inset-0 w-full h-full animate-spin-slow"
                >
                  <defs>
                    <path
                      id="circle-text"
                      d="M 60, 60 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                    />
                  </defs>
                  <text
                    fill="currentColor"
                    className="font-black text-12 uppercase tracking-wide"
                  >
                    <textPath href="#circle-text" startOffset="0%">
                      START SHOPPING NOW WITH OURBRIDE
                    </textPath>
                  </text>
                </svg>

                {/* Inner Fixed Circle and Arrow */}
                <div className="relative z-10 flex items-center justify-center">
                  {/* Inner Filled Circle */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-400 flex items-center justify-center shadow-md">
                    {/* White Arrow Icon (upward-right) */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Products Card */}
              <div className="relative w-48 md:w-56 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-[5/2] overflow-hidden relative">
                  <Image
                    src={
                      typeof heroCardBrideImage === 'string'
                        ? heroCardBrideImage
                        : heroCardBrideImage.src
                    }
                    alt="Explore Products"
                    fill
                    sizes="(max-width: 768px) 192px, 224px"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-14 font-semibold rounded-full"
                    asChild
                  >
                    <Link href="/products">Explore Products</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Offer Banner */}
        {banners.length > 0 && <OfferBanner offers={banners} />}

        {/* Section 3: Statistics */}
        <section className="container-custom pt-12 md:pt-16 pb-4 md:pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-32 md:text-40 lg:text-48 font-medium text-brand-500 mb-2">
                +1200
              </div>
              <div className="text-14 md:text-16 font-medium text-gray-600 mb-2">
                Clients
              </div>
              <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="text-32 md:text-40 lg:text-48 font-medium text-brand-500 mb-2">
                +600
              </div>
              <div className="text-14 md:text-16 font-medium text-gray-600 mb-2">
                Services Providers
              </div>
              <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="text-32 md:text-40 lg:text-48 font-medium text-brand-500 mb-2">
                +30
              </div>
              <div className="text-14 md:text-16 font-medium text-gray-600 mb-2">
                Available Services
              </div>
              <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="text-32 md:text-40 lg:text-48 font-medium text-brand-500 mb-2">
                +2500
              </div>
              <div className="text-14 md:text-16 font-medium text-gray-600 mb-2">
                Products
              </div>
              <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Section 4: Benefits */}
        <section className="container-custom pt-4 md:pt-6 pb-12 md:pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <BadgeCheck className="h-12 w-12 text-brand-500" />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                Verified Trusted Providers
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                Every service is identity-checked for a safe and reliable
                experience.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <TargetIcon className="h-12 w-12 text-brand-500" />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                All-in-One Wedding Hub
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                Plan, shop, book, and manage everything from one platform.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 relative inline-block">
                <Shield className="h-12 w-12 text-brand-500" />
                <CheckCircle2 className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-brand-500" />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                Safe transactions, transparent pricing, and guaranteed service
                delivery.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Tag className="h-12 w-12 text-brand-500" />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                Exclusive Offers & Rewards
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                Enjoy discounts, and gift options designed for your big day.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Suggested Products */}
        <section className="container-custom py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-22 sm:text-26 md:text-30 lg:text-32 font-normal text-gray-900">
              Products Suggested for You
            </h2>
            <Link
              href="/products"
              className="flex items-center gap-2 text-16 font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <CardSkeleton count={4} />
            ) : (
              paginatedProducts.map(product => {
                // Inline component to use hooks properly
                const ProductCardItem = () => {
                  const handlers = useProductCardHandlers(parseInt(product.id, 10))
                  const { handleAddToCart, isLoading: isLoadingAddToCart } = useAddProductToCart()

                  const handleAddToCartClick = (e: React.MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Convert ProductCardData to the format expected by handleAddToCart
                    handleAddToCart(
                      {
                        id: product.id,
                        price: { discounted: product.discountedPrice },
                        provider: { id: product.providerId || '' },
                      },
                      1
                    )
                  }

                  return (
                    <Card
                      cardData={{
                        type: 'product',
                        ...product,
                        providerId: product.providerId || '',
                        inStock: true,
                        onWishlistToggle: handlers.handleWishlistToggle,
                        onFavoriteToggle: handlers.handleFavoriteToggle,
                        onAddToCart: handleAddToCartClick,
                        isLoadingWishlist: handlers.isLoadingWishlist,
                        isLoadingFavorite: handlers.isLoadingFavorite,
                        isLoadingAddToCart,
                      }}
                    />
                  )
                }
                return <ProductCardItem key={product.id} />
              })
            )}
          </div >
          {/* Products Pagination */}
          {
            !isLoading && productsTotalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={productsPage}
                  totalPages={productsTotalPages}
                  onPageChange={setProductsPage}
                />
              </div>
            )
          }
        </section >

        {/* Section 6: Suggested Services */}
        < section className="container-custom py-12 md:py-16" >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-22 sm:text-26 md:text-28 lg:text-32 font-normal text-gray-900">
              Services Suggested for You
            </h2>
            <Link
              href="/services"
              className="flex items-center gap-2 text-16 font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <CardSkeleton count={4} />
            ) : (
              paginatedServices.map(service => {
                // Inline component to use hooks properly
                const ServiceCardItem = () => {
                  const handlers = useServiceCardHandlers(parseInt(service.id, 10))
                  return (
                    <Card
                      cardData={{
                        type: 'service',
                        ...service,
                        onWishlistToggle: handlers.handleWishlistToggle,
                        onFavoriteToggle: handlers.handleFavoriteToggle,
                        isLoadingWishlist: handlers.isLoadingWishlist,
                        isLoadingFavorite: handlers.isLoadingFavorite,
                      }}
                    />
                  )
                }
                return <ServiceCardItem key={service.id} />
              })
            )}
          </div >
          {/* Services Pagination */}
          {
            !isLoading && servicesTotalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={servicesPage}
                  totalPages={servicesTotalPages}
                  onPageChange={setServicesPage}
                />
              </div>
            )
          }
        </section >

        {/* Section 7: Why Trust Section */}
        < section className="relative py-16 md:py-24 overflow-hidden bg-white" >
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <Image
              src={typeof lineS2Svg === 'string' ? lineS2Svg : lineS2Svg.src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="container-custom relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-24 sm:text-28 md:text-36 lg:text-40 xl:text-48 font-black">
                <span className="font-normal text-gray-900">
                  Why{' '}
                  <span className="font-semibold text-gray-900">Brides</span>
                </span>
                <br />
                <span className="font-semibold text-gray-900">
                  Trust{' '}
                  <span className="font-normal text-gray-900">
                    Our Services
                  </span>
                </span>
              </h2>
            </div>
            <div className="relative min-h-[600px] md:min-h-[700px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 relative">
                {TRUST_CARDS.map((card, index) => {
                  const positionClass = TRUST_CARD_POSITION_CLASSES[index] || ''
                  return (
                    <div key={card.id} className={`relative ${positionClass}`}>
                      <Card
                        cardData={{
                          type: 'trust',
                          heading: card.heading,
                          description: card.description,
                          rotation: card.rotation,
                        }}
                        className="h-full"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section >

        {/* Section 8: Testimonials */}
        < section className="container-custom py-12 md:py-16" >
          {/* Centered Heading Above Section */}
          < div className="text-center mb-8 md:mb-12" >
            <h2 className="text-24 sm:text-28 md:text-36 lg:text-40 xl:text-48 font-black">
              <span className="font-normal text-gray-900">
                Read{' '}
                <span className="font-semibold text-gray-900">Reviews</span>
              </span>
              <br />
              <span className="font-semibold text-gray-900">
                Ride With{' '}
                <span className="font-normal text-gray-900">Confidence</span>
              </span>
            </h2>
          </div >

          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 mb-8 md:mb-12">
            {/* Left Side - Quote Icon and Heading */}
            <div className="flex items-start gap-4 lg:gap-6 w-full lg:w-auto lg:flex-shrink-0">
              <div className="flex-1 lg:max-w-md">
                <div className="mb-4 md:mb-6">
                  <Quote className="h-10 w-10 sm:h-12 sm:w-12 md:h-10 md:w-10 text-gray-400 mb-3" />
                  <p className="text-18 sm:text-20 md:text-24 lg:text-28 font-normal text-gray-900">
                    <span className="block">What Our</span>
                    <span className="block font-semibold text-gray-900">
                      Customers
                    </span>
                    <span className="block">Are Saying</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={goToTestimonialsPrevious}
                    aria-label="Previous testimonials"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <div className="flex-1 flex items-center gap-2">
                    {Array.from({ length: testimonialsTotalPages }).map(
                      (_, index) => (
                        <button
                          key={index}
                          onClick={() => goToTestimonialsPage(index)}
                          className={cn(
                            'flex-1 h-2 rounded-full transition-all',
                            index === testimonialsIndex
                              ? 'bg-red-500'
                              : 'bg-gray-200 hover:bg-gray-300'
                          )}
                          aria-label={`Go to page ${index + 1}`}
                        />
                      )
                    )}
                  </div>
                  <button
                    onClick={goToTestimonialsNext}
                    aria-label="Next testimonials"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full lg:w-auto">
              {isLoading ? (
                <TestimonialCardSkeleton count={3} />
              ) : (
                currentTestimonials.map((testimonial, index) => (
                  <Card
                    key={`${testimonialsIndex}-${index}`}
                    cardData={{ type: 'testimonial', ...testimonial }}
                  />
                ))
              )}
            </div>
          </div>
        </section >

        {/* Section 9: Providers */}
        < section className="container-custom py-12 md:py-16" >
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-24 sm:text-28 md:text-36 lg:text-40 xl:text-48 font-black mb-4 md:mb-6">
              <span className="font-normal text-gray-900">
                Discover{' '}
                <span className="font-semibold text-gray-900">Trusted</span>
              </span>
              <br />
              <span className="font-semibold text-gray-900">
                Wedding{' '}
                <span className="font-normal text-gray-900">Providers</span>
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <ProviderCardSkeleton count={4} />
            ) : (
              providers.map(provider => {
                // Inline component to use hooks properly
                const ProviderCardItem = () => {
                  const handlers = useProviderCardHandlers(parseInt(provider.id, 10))
                  return (
                    <Card
                      cardData={{
                        type: 'provider',
                        ...provider,
                        onFollowToggle: handlers.handleFollowToggle,
                        onFavoriteToggle: handlers.handleFavoriteToggle,
                        isLoadingFollow: handlers.isLoadingFollow,
                        isLoadingFavorite: handlers.isLoadingFavorite,
                      }}
                    />
                  )
                }
                return <ProviderCardItem key={provider.id} />
              })
            )}
          </div >
        </section >

        {/* Section 10: Wedding Journey */}
        < section className="relative py-16 md:py-24 overflow-hidden bg-white" >
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <Image
              src={typeof lineS4Svg === 'string' ? lineS4Svg : lineS4Svg.src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="container-custom relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-24 sm:text-28 md:text-36 lg:text-40 xl:text-48 font-black mb-4 md:mb-6">
                <span className="font-normal text-gray-900">
                  Your Wedding{' '}
                  <span className="font-semibold text-gray-900">Journey</span>
                </span>
                <br />
                <span className="font-semibold text-gray-900">
                  Starts <span className="font-normal text-gray-900">Here</span>
                </span>
              </h2>
            </div>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-start">
                {JOURNEY_STEPS.map((step, index) => (
                  <Card
                    key={step.stepNumber}
                    cardData={{
                      type: 'journey-step',
                      stepNumber: step.stepNumber,
                      title: step.title,
                      description: step.description,
                    }}
                    className={cn(
                      index === 0 && 'md:pt-0',
                      index === 1 && 'md:pt-20',
                      index === 2 && 'md:pt-0'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </section >

        {/* Section 11: Member Testimonials */}
        < section className="container-custom py-12 md:py-16" >
          {/* Centered Heading Above Section */}
          < div className="text-center mb-8 md:mb-12" >
            <h2 className="text-24 sm:text-28 md:text-36 lg:text-40 xl:text-48 font-black">
              <span className="font-normal text-gray-900">
                Our Bride{' '}
                <span className="font-semibold text-gray-900">Members</span>
              </span>
              <br />
              <span className="font-semibold text-gray-900">
                Are <span className="font-normal text-gray-900">Loving</span>
              </span>
            </h2>
          </div >

          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 mb-8 md:mb-12">
            {/* Left Side - Quote Icon and Heading */}
            <div className="flex items-start gap-4 lg:gap-6 w-full lg:w-auto lg:flex-shrink-0">
              <div className="flex-1 lg:max-w-md">
                <div className="mb-4 md:mb-6">
                  <Quote className="h-10 w-10 sm:h-12 sm:w-12 md:h-10 md:w-10 text-gray-400 mb-3" />
                  <p className="text-18 sm:text-20 md:text-24 lg:text-28 font-normal text-gray-900">
                    <span className="block">Discover</span>
                    <span className="block font-semibold text-gray-900">
                      What
                    </span>
                    <span className="block font-semibold text-gray-900">
                      Members
                    </span>
                    <span className="block">Are Saying</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={goToMemberTestimonialsPrevious}
                    aria-label="Previous testimonials"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <div className="flex-1 flex items-center gap-2">
                    {Array.from({ length: memberTestimonialsTotalPages }).map(
                      (_, index) => (
                        <button
                          key={index}
                          onClick={() => goToMemberTestimonialsPage(index)}
                          className={cn(
                            'flex-1 h-2 rounded-full transition-all',
                            index === memberTestimonialsIndex
                              ? 'bg-red-500'
                              : 'bg-gray-200 hover:bg-gray-300'
                          )}
                          aria-label={`Go to page ${index + 1}`}
                        />
                      )
                    )}
                  </div>
                  <button
                    onClick={goToMemberTestimonialsNext}
                    aria-label="Next testimonials"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full lg:w-auto items-stretch">
              {isLoading ? (
                <MemberTestimonialCardSkeleton count={3} />
              ) : (
                currentMemberTestimonials.map((testimonial, index) => (
                  <Card
                    key={`${memberTestimonialsIndex}-${index}`}
                    cardData={{ type: 'member-testimonial', ...testimonial }}
                  />
                ))
              )}
            </div>
          </div>
        </section >

        {/* Section: App Download */}
        < section className="relative overflow-hidden bg-white py-0" >
          <div className="container-custom">
            <div className="text-center mb-0">
              <h2 className="text-32 md:text-40 lg:text-48 font-black text-gray-900 leading-tight">
                <span className="font-normal block">
                  Make Wedding Planning Easier
                </span>
                <span className="font-semibold">With OurBride</span>
              </h2>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center mb-0">
                <StoreBadges size="2xl" />
              </div>

              <div className="relative flex items-center justify-center w-full h-auto mt-0">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-brand-400 via-brand-300 to-brand-200 rounded-full opacity-30 blur-3xl" />

                {/* Phone Image */}
                <div className="relative z-10 w-[650px] md:w-[850px] lg:w-[1000px] aspect-[26/16]">
                  <Image
                    src={
                      typeof phoneImage === 'string'
                        ? phoneImage
                        : phoneImage.src
                    }
                    alt="OurBride Mobile App"
                    fill
                    sizes="(max-width: 768px) 650px, (max-width: 1024px) 850px, 1000px"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section >
      </main >
      <Footer />
    </div >
  )
}
