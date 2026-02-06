'use client'

import { useState, useMemo, useCallback, useRef, memo } from 'react'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useTranslations, useIsRTL, useI18nLocale } from '@/i18n/hooks'
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
} from '@/hooks'
import {
  OfferBanner,
  OfferBannerSkeleton,
  CardSkeleton,
  ProviderCardSkeleton,
  TestimonialCardSkeleton,
  MemberTestimonialCardSkeleton,
} from '@/components/ui'

import { StoreBadges } from '@/components/ui/StoreBadges'
import { Users, ChevronLeft, ChevronRight, Quote, Calendar, DollarSign, UserPlus, Clock } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { SwiperRef } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import heroBrideImage from '@/assets/images/Hero-Bride.png'
import heroCardBrideImage from '@/assets/images/HeroCard-Bride.png'
import heroCircularSvg from '@/assets/svg/Hero-circular.svg'
import lineS2Svg from '@/assets/svg/Line-s2.svg'
import lineS4Svg from '@/assets/svg/Line-s4.svg'
import communityBannerSvg from '@/assets/svg/community-banner.svg'
import eventsHomeSvg from '@/assets/svg/events-home.svg'
import phoneImage from '@/assets/images/phone.png'
import verifiedIcon from '@/assets/svg/verified.svg'
import allInIcon from '@/assets/svg/all-in.svg'
import securePaymentsIcon from '@/assets/svg/secure-payments.svg'
import exclusiveIcon from '@/assets/svg/exclusive.svg'
import { useHome } from '@/hooks/home'
import { extractHomeData } from '@/utils'
import { usePosts } from '@/hooks/community/useCommunityContent'
import type { PostResponse } from '@/types/responses/community'
import {
  TRUST_CARDS,
  JOURNEY_STEPS,
  TRUST_CARD_POSITION_CLASSES,
  PAGINATION_CONFIG,
} from '@/constants'

// Memoized Product Card Component
const ProductCardItem = memo(({ product }: { product: ProductCardData }) => {
  const handlers = useProductCardHandlers(parseInt(product.id, 10))
  const { handleAddToCart, isLoading: isLoadingAddToCart } =
    useAddProductToCart()

  const handleAddToCartClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleAddToCart(
        {
          id: product.id,
          price: { discounted: product.discountedPrice },
          provider: { id: product.providerId || '' },
        },
        1
      )
    },
    [product.id, product.discountedPrice, product.providerId, handleAddToCart]
  )

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
})
ProductCardItem.displayName = 'ProductCardItem'

// Memoized Service Card Component
const ServiceCardItem = memo(({ service }: { service: ServiceCardData }) => {
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
})
ServiceCardItem.displayName = 'ServiceCardItem'

// Memoized Provider Card Component
const ProviderCardItem = memo(
  ({ provider }: { provider: ProviderCardData }) => {
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
)
ProviderCardItem.displayName = 'ProviderCardItem'

export default function Home() {
  const locale = useI18nLocale()
  // Translations
  const t = useTranslations('home')
  const tsideBar= useTranslations('userSidebar') 
  const tMember = useTranslations('home.sections.memberTestimonials')
  const isRTL = useIsRTL()

  // Fetch home data from API
  const { data: homeData, isLoading } = useHome()

  // Extract and map API data
  const apiData = useMemo(() => {
    if (homeData) {
      return extractHomeData(homeData, locale)
    }
    return {}
  }, [homeData, locale])

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
  const statistics = useMemo(() => apiData.statistics, [apiData.statistics])

  // Testimonials carousel state
  const [testimonialsIndex, setTestimonialsIndex] = useState(0)
  const [testimonialsMobileIndex, setTestimonialsMobileIndex] = useState(0)
  const testimonialsSwiperRef = useRef<SwiperRef | null>(null)
  const testimonialsTotalPages = Math.ceil(
    testimonials.length / PAGINATION_CONFIG.TESTIMONIALS_PER_PAGE
  )
  const testimonialsMobileTotal = testimonials.length

  // Fetch community posts for member testimonials section
  const { data: communityPosts, isLoading: isLoadingPosts } = usePosts({
    page: 1,
    pageSize: 9, // Fetch 9 posts to show 3 per page
    enabled: true,
  })

  // Map community posts to member testimonial format
  const communityPostsAsTestimonials = useMemo(() => {
    if (!communityPosts || communityPosts.length === 0) return []
    
    return communityPosts
      .filter((post: PostResponse) => post.isPublished !== false)
      .slice(0, 9)
      .map((post: PostResponse): MemberTestimonialCardData => {
        // Extract images from medias array
        type PostWithMedias = PostResponse & { medias?: Array<{ url?: string }> }
        const postWithMedias = post as PostWithMedias
        const images: string[] = postWithMedias.medias
          ?.filter((media: { url?: string }) => media?.url)
          .map((media: { url?: string }) => media.url)
          .filter((url): url is string => typeof url === 'string') || []

        // Get user display name
        const getUserDisplayName = (user: PostResponse['user']): string => {
          if (!user) return 'OurBride'
          const firstName = (user.firstName && user.firstName !== 'null') ? user.firstName : ''
          const lastName = (user.lastName && user.lastName !== 'null') ? user.lastName : ''
          const fullName = `${firstName} ${lastName}`.trim()
          if (fullName) return fullName
          if (user.userName && user.userName.toLowerCase() === 'admin@our-bride.com') {
            return 'OurBride'
          }
          return user.userName || 'OurBride'
        }

        // Get user avatar
        const getUserAvatar = (user: PostResponse['user']): string => {
          if (!user || !user.profileUrl) return ''
          return user.profileUrl
        }

        // Format date
        const formatDate = (dateString: string | null): string => {
          if (!dateString) return ''
          const date = new Date(dateString)
          return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        }

        return {
          authorName: getUserDisplayName(post.user),
          authorImage: getUserAvatar(post.user),
          reviewText: post.content || post.summary || post.title || '',
          productImages: images,
          date: formatDate(post.publishedAt || post.creationDate),
          likes: post.likeCount || 0,
          comments: post.commentCount || 0,
          shares: post.shareCount || 0,
        }
      })
  }, [communityPosts])

  // Member testimonials carousel state
  const [memberTestimonialsIndex, setMemberTestimonialsIndex] = useState(0)
  const memberTestimonialsTotalPages = Math.ceil(
    communityPostsAsTestimonials.length / PAGINATION_CONFIG.MEMBER_TESTIMONIALS_PER_PAGE
  )

  const currentMemberTestimonials = useMemo(
    () =>
      communityPostsAsTestimonials.slice(
        memberTestimonialsIndex * PAGINATION_CONFIG.MEMBER_TESTIMONIALS_PER_PAGE,
        memberTestimonialsIndex * PAGINATION_CONFIG.MEMBER_TESTIMONIALS_PER_PAGE +
          PAGINATION_CONFIG.MEMBER_TESTIMONIALS_PER_PAGE
      ),
    [communityPostsAsTestimonials, memberTestimonialsIndex]
  )

  const goToMemberTestimonialsPrevious = useCallback(() => {
    setMemberTestimonialsIndex(prev =>
      prev === 0 ? memberTestimonialsTotalPages - 1 : prev - 1
    )
  }, [memberTestimonialsTotalPages])

  const goToMemberTestimonialsNext = useCallback(() => {
    setMemberTestimonialsIndex(prev => (prev + 1) % memberTestimonialsTotalPages)
  }, [memberTestimonialsTotalPages])

  const goToMemberTestimonialsPage = useCallback((index: number) => {
    setMemberTestimonialsIndex(index)
  }, [])

  const currentTestimonials = useMemo(
    () =>
      testimonials.slice(
        testimonialsIndex * PAGINATION_CONFIG.TESTIMONIALS_PER_PAGE,
        testimonialsIndex * PAGINATION_CONFIG.TESTIMONIALS_PER_PAGE +
          PAGINATION_CONFIG.TESTIMONIALS_PER_PAGE
      ),
    [testimonials, testimonialsIndex]
  )

  // Memoize carousel navigation handlers
  const goToTestimonialsPrevious = useCallback(() => {
    setTestimonialsIndex(prev =>
      prev === 0 ? testimonialsTotalPages - 1 : prev - 1
    )
  }, [testimonialsTotalPages])

  const goToTestimonialsNext = useCallback(() => {
    setTestimonialsIndex(prev => (prev + 1) % testimonialsTotalPages)
  }, [testimonialsTotalPages])

  const goToTestimonialsPage = useCallback((index: number) => {
    setTestimonialsIndex(index)
  }, [])

  const goToTestimonialsMobilePrevious = useCallback(() => {
    testimonialsSwiperRef.current?.swiper.slidePrev()
  }, [])

  const goToTestimonialsMobileNext = useCallback(() => {
    testimonialsSwiperRef.current?.swiper.slideNext()
  }, [])

  const goToTestimonialsMobilePage = useCallback((index: number) => {
    const swiper = testimonialsSwiperRef.current?.swiper
    if (!swiper) return
    if (swiper.params.loop) {
      swiper.slideToLoop(index)
      return
    }
    swiper.slideTo(index)
  }, [])

  // Get translated trust cards
  const translatedTrustCards = useMemo(() => {
    return TRUST_CARDS.map((card) => {
      let heading: string = card.heading
      let description: string = card.description

      switch (card.id) {
        case '1':
          heading = t('trustCards.madeForLocalBrides.heading')
          description = t('trustCards.madeForLocalBrides.description')
          break
        case '2':
          heading = t('trustCards.simpleBeautifulExperience.heading')
          description = t('trustCards.simpleBeautifulExperience.description')
          break
        case '3':
          heading = t('trustCards.realOffersSavings.heading')
          description = t('trustCards.realOffersSavings.description')
          break
        case '4':
          heading = t('trustCards.allInOnePlatform.heading')
          description = t('trustCards.allInOnePlatform.description')
          break
        case '5':
          heading = t('trustCards.verifiedTrustedProviders.heading')
          description = t('trustCards.verifiedTrustedProviders.description')
          break
        case '6':
          heading = t('trustCards.securePayments.heading')
          description = t('trustCards.securePayments.description')
          break
      }

      return {
        ...card,
        heading: heading as typeof card.heading,
        description: description as typeof card.description,
      }
    })
  }, [t])

  // Get translated journey steps
  const translatedJourneySteps = useMemo(() => {
    return JOURNEY_STEPS.map((step) => {
      let title: string = step.title
      let description: string = step.description

      switch (step.stepNumber) {
        case 1:
          title = t('journeySteps.step1.title')
          description = t('journeySteps.step1.description')
          break
        case 2:
          title = t('journeySteps.step2.title')
          description = t('journeySteps.step2.description')
          break
        case 3:
          title = t('journeySteps.step3.title')
          description = t('journeySteps.step3.description')
          break
      }

      return {
        ...step,
        title: title as typeof step.title,
        description: description as typeof step.description,
      }
    })
  }, [t])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Section 1: Hero */}
        <section className="container-custom py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
            {/* Left Content */}
            <div
              className={cn(
                "flex flex-col gap-4 items-center text-center order-2 lg:order-1 lg:items-start lg:text-left",
                isRTL && "lg:items-start lg:text-right"
              )}
            >
              {/* Active Users */}
              <div
                className={cn(
                  "flex items-center gap-2 -mt-2 justify-center flex-nowrap lg:gap-3 lg:justify-start",
                  isRTL && "flex-row-reverse lg:justify-end"
                )}
              >
                <span  className="text-8 md:text-14 font-semibold text-gray-700 whitespace-nowrap">
                  <span className="text-gray-500 font-normal text-24">
                    {statistics?.activeUsers || '+0'}
                  </span>
                  <span className="text-gray-500 font-normal text-14">
                    {t('hero.activeUsers')}
                  </span>
                </span>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
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
              <div
                className={cn(
                  "inline-flex items-center gap-2 self-center lg:self-start",
                  isRTL && "lg:self-start"
                )}
              >
                <span className=" rounded-full text-brand-500 text-18 font-semibold">
                  {t('hero.badge')}
                </span>
              </div>

              {/* Headline */}
              <div className="text-24 sm:text-24 md:text-28 lg:text-36 xl:text-40 2xl:text-48 font-semibold text-gray-900 leading-tight mt-2">
                {t('hero.headline.line1')} <br />
                <span className="text-24 sm:text-24 md:text-28 lg:text-36 xl:text-40 2xl:text-48 font-semibold text-gray-900 leading-tight mt-2  ">
                  {t('hero.headline.line2')} <br />
                </span>
                <span className="text-24 sm:text-24 md:text-28 lg:text-36 xl:text-40 2xl:text-48 font-semibold text-gray-900 leading-tight mt-2  ">
                  {t('hero.headline.line3')}
                </span>
              </div>

              {/* Description */}
              <p className="text-16 sm:text-18 md:text-20 lg:text-22 text-gray-500 leading-relaxed max-w-lg mx-auto ">
                {t('hero.description')}
              </p>
            </div>

            {/* Center: Bride Image */}
            <div
              className={cn(
                "relative flex items-start justify-center lg:justify-start lg:pt-0 order-1 lg:order-2",
                isRTL ? "lg:-ml-24" : "lg:-mr-24"
              )}
            >
              {/* Main Bride Image - Centered */}
              <div className="relative">
                {/* Circular Image Container with Gradient Border */}
                <div className="relative w-80 h-80 sm:w-88 sm:h-88 md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px]">
                  {/* SVG Border */}
                  <Image
                    src={
                      typeof heroCircularSvg === 'string'
                        ? heroCircularSvg
                        : heroCircularSvg.src
                    }
                    alt=""
                    fill
                    sizes="(max-width: 768px) 384px, (max-width: 1024px) 450px, 500px"
                    className="absolute inset-0"
                    aria-hidden="true"
                    priority
                  />
                  {/* Bride Image */}
                  <div className="absolute inset-[9px] rounded-full overflow-hidden z-10">
                    <Image
                      src={
                        typeof heroBrideImage === 'string'
                          ? heroBrideImage
                          : heroBrideImage.src
                      }
                      alt="Happy Bride"
                      fill
                      sizes="(max-width: 768px) 371px, (max-width: 1024px) 437px, 487px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content: Circular Text and Explore Products Card */}
            <div
              className={cn(
                "relative flex flex-col items-center gap-4 z-10 w-full order-3 lg:order-3 lg:justify-start lg:pb-4 md:pb-6",
                isRTL ? "lg:items-end" : "lg:items-start"
              )}
            >
              {/* Circular Badge Button - Positioned higher, centered above cards */}
              <div className={cn(
                "relative w-[100px] h-[100px] items-center justify-center hidden lg:flex",
                isRTL 
                  ? "lg:mr-auto lg:ml-0 lg:translate-x-[62px]" 
                  : "lg:ml-auto lg:mr-0 lg:-translate-x-[62px]"
              )}>
                {/* Outer Rotating Text Ring */}
                <svg
                  viewBox="0 0 120 120"
                  className={cn(
                    "absolute inset-0 w-full h-full",
                    isRTL ? "animate-spin-slow-reverse" : "animate-spin-slow"
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Path for circular text - same for both directions */}
                    <path
                      id="circle-text"
                      d="M 60, 60 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                    />
                  </defs>
                  <text
                    fill="#F14836"
                    className="font-black text-12 uppercase tracking-wide"
                    style={{ 
                      direction: isRTL ? 'rtl' : 'ltr',
                      textAnchor: 'start'
                    }}
                  >
                    <textPath 
                      href="#circle-text" 
                      startOffset={isRTL ? "50%" : "0%"}
                      method="align"
                    >
                      {t('hero.circularText')}
                    </textPath>
                  </text>
                </svg>

                {/* Inner Fixed Circle and Arrow */}
                <div className="relative z-10 flex items-center justify-center">
                  {/* Inner Filled Circle */}
                  <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center">
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
              <div
                className={cn(
                  "flex justify-between items-start gap-4 w-full max-w-md",
                  "lg:flex-col lg:items-start lg:max-w-none",
                  isRTL && "lg:items-end"
                )}
              >
                {/* Products Card */}
              <div className={cn(
                "relative w-48 md:w-56 rounded-xl shadow-lg overflow-hidden border border-gray-100",
                isRTL ? "lg:mr-auto lg:ml-0" : "lg:ml-auto lg:mr-0"
              )}>
                <div className="relative h-48 sm:h-40 md:h-48 lg:h-auto lg:aspect-[5/2] overflow-hidden">
            
                  <Image
                    src={
                      typeof heroCardBrideImage === 'string'
                        ? heroCardBrideImage
                        : heroCardBrideImage.src
                    }
                    alt="Explore Products"
                    fill
                    sizes="(max-width: 768px) 192px, 224px"
                    style={{ objectPosition: 'center 16%' }}
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <Button
                    variant="outlineBrand"
                    size="sm"
                    className="w-full !text-8 md:!text-12 lg:!text-13 font-semibold text-brand-500 rounded-full"
                    asChild
                  >
                    <Link href="/products">{t('hero.exploreProducts')}</Link>
                  </Button>
                </div>
              </div>

              {/* Services Card */}
              <div className={cn(
                "relative w-48 md:w-56 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 opacity-70",
                isRTL ? "lg:mr-auto lg:ml-0" : "lg:ml-auto lg:mr-0"
              )}>
                <div className="relative h-48 sm:h-40 md:h-48 lg:h-auto lg:aspect-[5/2] overflow-hidden">
                      <div className="absolute top-2 inset-x-2 z-10 flex items-center justify-between">
                  
                    <span className="rounded-full border border-brand-500/70 bg-white/90 px-2.5 py-1 text-12 font-semibold tracking-wider text-brand-600 shadow-[0_0_12px_rgba(241,72,54,0.35)] animate-pulse">
                      {tsideBar('comingSoon')}
                    </span>
                  </div>
                  <Image
                    src={
                      typeof heroCardBrideImage === 'string'
                        ? heroCardBrideImage
                        : heroCardBrideImage.src
                    }
                    alt="Explore Services"
                    fill
                    sizes="(max-width: 768px) 192px, 224px"
                    className="object-cover"
                    style={{ objectPosition: 'center 16%' }}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <Button
                    variant="outlineBrand"
                    size="sm"
                    disabled
                    aria-disabled="true"
                    className="w-full !text-8 md:!text-12 lg:!text-13 text-brand-500 font-semibold rounded-full cursor-not-allowed opacity-70"
                  >
                    {t('hero.exploreServices')}
                  </Button>
                </div>
              </div></div>
            </div>
          </div>
        </section>

        {/* Section 2: Offer Banner */}
        {isLoading ? (
          <OfferBannerSkeleton />
        ) : (
          banners.length > 0 && <OfferBanner offers={banners} />
        )}

        {/* Section 3: Statistics */}
        <section className="container-custom py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-28 md:text-36 lg:text-40 xl:text-48 font-medium text-brand-500 mb-2">
                {statistics?.clients || '+0'}
              </div>
              <div className="text-16 md:text-18 lg:text-20 font-medium text-gray-600 mb-2">
                {t('statistics.clients')}
              </div>
              <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="text-28 md:text-36 lg:text-40 xl:text-48 font-medium text-brand-500 mb-2">
                {statistics?.serviceProviders || '+0'}
              </div>
              <div className="text-16 md:text-18 lg:text-20 font-medium text-gray-600 mb-2">
                {t('statistics.serviceProviders')}
              </div>
              <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="text-28 md:text-36 lg:text-40 xl:text-48 font-medium text-brand-500 mb-2">
                {statistics?.availableServices || '+0'}
              </div>
              <div className="text-16 md:text-18 lg:text-20 font-medium text-gray-600 mb-2">
                {t('statistics.availableServices')}
              </div>
              <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="text-28 md:text-36 lg:text-40 xl:text-48 font-medium text-brand-500 mb-2">
                {statistics?.products || '+0'}
              </div>
              <div className="text-16 md:text-18 lg:text-20 font-medium text-gray-600 mb-2">
                {t('statistics.products')}
              </div>
              <div className="w-28 h-0.5 bg-gray-300 mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Section 4: Benefits */}
        <section className="container-custom py-8 md:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src={
                    typeof verifiedIcon === 'string'
                      ? verifiedIcon
                      : verifiedIcon.src
                  }
                  alt="Verified"
                  width={67}
                  height={67}
                  className="h-12 w-12 md:h-16 md:w-16"
                />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                {t('benefits.verifiedTrustedProviders.title')}
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                {t('benefits.verifiedTrustedProviders.description')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src={
                    typeof allInIcon === 'string' ? allInIcon : allInIcon.src
                  }
                  alt="All-in-One"
                  width={67}
                  height={67}
                  className="h-12 w-12 md:h-16 md:w-16"
                />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                {t('benefits.allInOneWeddingHub.title')}
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                {t('benefits.allInOneWeddingHub.description')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src={
                    typeof securePaymentsIcon === 'string'
                      ? securePaymentsIcon
                      : securePaymentsIcon.src
                  }
                  alt="Secure Payments"
                  width={67}
                  height={67}
                  className="h-12 w-12 md:h-16 md:w-16"
                />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                {t('benefits.securePayments.title')}
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                {t('benefits.securePayments.description')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src={
                    typeof exclusiveIcon === 'string'
                      ? exclusiveIcon
                      : exclusiveIcon.src
                  }
                  alt="Exclusive Offers"
                  width={80}
                  height={80}
                  className="h-12 w-12 md:h-16 md:w-16"
                />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                {t('benefits.exclusiveOffers.title')}
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                {t('benefits.exclusiveOffers.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Suggested Products */}
        {products.length > 0 && (
          <section className="container-custom py-8 md:py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-22 sm:text-26 md:text-30 lg:text-32 font-normal text-gray-900">
                {t('sections.productsSuggested')}
              </h2>
              <Link
                href="/products"
                className="flex items-center gap-2 text-16 font-semibold text-brand-500 hover:text-brand-600 transition-colors"
              >
                {t('sections.viewAll')}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                <CardSkeleton count={4} />
              ) : (
                products
                  .slice(0, 4)
                  .map(product => (
                    <ProductCardItem key={product.id} product={product} />
                  ))
              )}
            </div>
          </section>
        )}

        {/* Section 6: Suggested Services */}
        {services.length > 0 && (
          <section className="container-custom py-8 md:py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-22 sm:text-26 md:text-28 lg:text-32 font-normal text-gray-900">
                {t('sections.servicesSuggested')}
              </h2>
              <Link
                href="/services"
                className="flex items-center gap-2 text-16 font-semibold text-brand-500 hover:text-brand-600 transition-colors"
              >
                {t('sections.viewAll')}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                <CardSkeleton count={4} />
              ) : (
                services
                  .slice(0, 4)
                  .map(service => (
                    <ServiceCardItem key={service.id} service={service} />
                  ))
              )}
            </div>
          </section>
        )}

        {/* Section 7: Why Trust Section */}
        <section className="relative py-8 md:py-12 overflow-hidden bg-white">
          <div className="absolute inset-0 bottom-1/4 pointer-events-none">
            <Image
              src={typeof lineS2Svg === 'string' ? lineS2Svg : lineS2Svg.src}
              alt=""
              fill
              sizes="70vw"
              className="object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="container-custom relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2 className={cn(
                "text-24 sm:text-28 md:text-36 lg:text-40 xl:text-48 font-black",
                isRTL && "leading-relaxed"
              )}>
                <span className="font-normal text-gray-900 block">
                  {t('sections.whyTrust.title')}{' '}
                  <span className="font-semibold text-gray-900">
                    {t('sections.whyTrust.brides')}
                  </span>
                </span>
                <span className={cn(
                  "font-semibold text-gray-900 block",
                  isRTL ? "mt-3 md:mt-4" : "mt-0"
                )}>
                  {t('sections.whyTrust.trust')}{' '}
                  <span className="font-normal text-gray-900">
                    {t('sections.whyTrust.ourServices')}
                  </span>
                </span>
              </h2>
            </div>
            <div className="relative min-h-[480px] md:min-h-[560px]">
              {/* Mobile: Swiper */}
              <div className="md:hidden -mx-4 px-4">
                <Swiper
                  dir={isRTL ? 'rtl' : 'ltr'}
                  spaceBetween={16}
                  slidesPerView={1.1}
                  centeredSlides={false}
                  modules={[Autoplay]}
                  autoplay={{ delay: 2000, disableOnInteraction: false }}
                  speed={3000}
                >
                  {translatedTrustCards.map((card) => (
                    <SwiperSlide key={card.id} className="!h-auto">
                      <Card
                        cardData={{
                          type: 'trust',
                          heading: card.heading,
                          description: card.description,
                          rotation: 0,
                          background: card.background,
                        }}
                        className="h-full"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Desktop: Grid */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 relative">
                {translatedTrustCards.map((card, index) => {
                  const positionClass = TRUST_CARD_POSITION_CLASSES[index] || ''
                  return (
                    <div key={card.id} className={`relative ${positionClass}`}>
                      <Card
                        cardData={{
                          type: 'trust',
                          heading: card.heading,
                          description: card.description,
                          rotation: card.rotation,
                          background: card.background,
                        }}
                        className="h-full"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Testimonials */}
        {testimonials.length > 0 && (
          <section className="container-custom py-8 md:py-12">
            {/* Centered Heading Above Section */}
              <div className="text-center mb-8 md:mb-12">
              <h2 className={cn(
                "text-24 sm:text-28 md:text-36 lg:text-40 xl:text-48 font-black",
                isRTL && "leading-relaxed"
              )}>
                <span className="font-normal text-gray-900 block">
                  {t('sections.testimonials.title')}{' '}
                  <span className="font-semibold text-gray-900">
                    {t('sections.testimonials.reviews')}
                  </span>
                </span>
                <span className={cn(
                  "font-semibold text-gray-900 block",
                  isRTL ? "mt-3 md:mt-4" : "mt-0"
                )}>
                  {t('sections.testimonials.rideWith')}{' '}
                  <span className="font-normal text-gray-900">
                    {t('sections.testimonials.confidence')}
                  </span>
                </span>
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 mb-8 md:mb-12">
              {/* Left Side - Quote Icon and Heading */}
              <div className="flex items-center lg:items-start gap-4 lg:gap-6 w-full lg:w-auto lg:flex-shrink-0">
                <div className="flex-1 lg:max-w-md text-center lg:text-left">
                  <div className="mb-4 md:mb-6">
                    <Quote className="mx-auto lg:mx-0 h-10 w-10 sm:h-12 sm:w-12 md:h-10 md:w-10 text-gray-400 mb-3" />
                    <p className={cn(
                      "text-18 sm:text-20 md:text-24 lg:text-28 font-normal text-gray-900",
                      isRTL && "lg:text-right"
                    )}>
                      <span className="inline lg:block">
                        {t('sections.testimonials.whatOurCustomers')}
                      </span>{' '}
                      <span className="inline lg:block font-semibold text-gray-900">
                        {t('sections.testimonials.customers')}
                      </span>
                      {t('sections.testimonials.areSaying') && (
                        <span className="inline lg:block">
                          {' '}
                          {t('sections.testimonials.areSaying')}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 md:hidden">
                    <button
                      onClick={goToTestimonialsMobilePrevious}
                      aria-label={t('sections.testimonials.previous')}
                    >
                      <ChevronLeft className={cn("h-5 w-5 text-gray-700", isRTL && "rotate-180")} />
                    </button>
                    <div className="flex-1 flex items-center gap-2">
                      {Array.from({ length: testimonialsMobileTotal }).map(
                        (_, index) => (
                          <button
                            key={index}
                            onClick={() => goToTestimonialsMobilePage(index)}
                            className={cn(
                              'flex-1 h-2 rounded-full transition-all',
                              index === testimonialsMobileIndex
                                ? 'bg-red-500'
                                : 'bg-gray-200 hover:bg-gray-300'
                            )}
                            aria-label={`${t('sections.testimonials.goToPage')} ${index + 1}`}
                          />
                        )
                      )}
                    </div>
                    <button
                      onClick={goToTestimonialsMobileNext}
                      aria-label={t('sections.testimonials.next')}
                    >
                      <ChevronRight className={cn("h-5 w-5 text-gray-700", isRTL && "rotate-180")} />
                    </button>
                  </div>
                  <div className="hidden md:flex items-center gap-3 md:gap-4">
                    <button
                      onClick={goToTestimonialsPrevious}
                      aria-label={t('sections.testimonials.previous')}
                    >
                      <ChevronLeft className={cn("h-5 w-5 text-gray-700", isRTL && "rotate-180")} />
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
                            aria-label={`${t('sections.testimonials.goToPage')} ${index + 1}`}
                          />
                        )
                      )}
                    </div>
                    <button
                      onClick={goToTestimonialsNext}
                      aria-label={t('sections.testimonials.next')}
                    >
                      <ChevronRight className={cn("h-5 w-5 text-gray-700", isRTL && "rotate-180")} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Testimonial Cards */}
              <div className="flex-1 w-full lg:w-auto items-stretch">
                <div className="md:hidden -mx-4 px-4">
                  {isLoading ? (
                    <TestimonialCardSkeleton count={1} />
                  ) : (
                    <Swiper
                      ref={testimonialsSwiperRef}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      spaceBetween={16}
                      slidesPerView={1}
                      centeredSlides={false}
                      loop={testimonialsMobileTotal > 1}
                      onSlideChange={(swiper) => {
                        setTestimonialsMobileIndex(swiper.realIndex)
                      }}
                    >
                      {testimonials.map((testimonial, index) => (
                        <SwiperSlide
                          key={`${'testimonial'}-${index}`}
                          className="!h-auto"
                        >
                          <Card
                            cardData={{ type: 'testimonial', ...testimonial }}
                            className="h-full "
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                  {isLoading ? (
                    <TestimonialCardSkeleton count={3} />
                  ) : (
                    currentTestimonials.map((testimonial, index) => (
                      <Card
                        key={`${testimonialsIndex}-${index}`}
                        cardData={{ type: 'testimonial', ...testimonial }}
                        className="h-full "
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 9: Providers */}
        {providers.length > 0 && (
          <section className="container-custom py-8 md:py-12">
            <div className="text-center mb-8 md:mb-12">
              <h2 className={cn(
                "text-24 sm:text-28 md:text-36 lg:text-40 xl:text-48 font-black mb-4 md:mb-6",
                isRTL && "leading-relaxed"
              )}>
                <span className="font-normal text-gray-900 block">
                  {t('sections.providers.title')}{' '}
                  <span className="font-semibold text-gray-900">
                    {t('sections.providers.trusted')}
                  </span>
                </span>
                <span className={cn(
                  "font-semibold text-gray-900 block",
                  isRTL ? "mt-3 md:mt-4" : "mt-0"
                )}>
                  {t('sections.providers.wedding')}{' '}
                  <span className="font-normal text-gray-900">
                    {t('sections.providers.providers')}
                  </span>
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                <ProviderCardSkeleton count={4} />
              ) : (
                providers.map(provider => (
                  <ProviderCardItem key={provider.id} provider={provider} />
                ))
              )}
            </div>
          </section>
        )}

        {/* Section 10: Wedding Journey */}
        <section className="relative py-8 md:py-12 overflow-hidden min-h-[700px] md:min-h-[800px] lg:min-h-[900px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full pointer-events-none">
            <Image
              src={typeof lineS4Svg === 'string' ? lineS4Svg : lineS4Svg.src}
              alt=""
              fill
              sizes="100vw"
              className="object-contain object-top"
              aria-hidden="true"
            />
          </div>
          <div className="container-custom relative z-10 pt-10 md:pt-14">
            <div className="text-center mb-12 md:mb-16">
              <h2 className={cn(
                "text-24 sm:text-28 md:text-36 lg:text-40 xl:text-48 font-black mb-4 md:mb-6",
                isRTL && "leading-relaxed"
              )}>
                <span className="font-normal text-gray-900 block">
                  {t('sections.journey.title')}{' '}
                  <span className="font-semibold text-gray-900">
                    {t('sections.journey.journey')}
                  </span>
                </span>
                <span className={cn(
                  "font-semibold text-gray-900 block",
                  isRTL ? "mt-3 md:mt-4" : "mt-0"
                )}>
                  {t('sections.journey.starts')}{' '}
                  <span className="font-normal text-gray-900">
                    {t('sections.journey.here')}
                  </span>
                </span>
              </h2>
            </div>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-start">
                {translatedJourneySteps.map((step, index) => (
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
        </section>

        {/* Section 11: Community Posts (Member Testimonials Design) */}
        {communityPostsAsTestimonials.length > 0 && (
          <section className="container-custom py-8 md:py-12">
            {/* Centered Heading Above Section */}
            <div className="text-center mb-8 md:mb-12">
              <h2 className={cn(
                "text-24 sm:text-28 md:text-36 lg:text-40 xl:text-48 font-black",
                isRTL && "leading-relaxed"
              )}>
                {tMember('titleFull') ? (
                  <span className="font-normal text-gray-900 block">
                    {tMember('titleFull')}
                  </span>
                ) : (
                  <>
                    <span className="font-normal text-gray-900 block">
                      {tMember('title')}{' '}
                      <span className="font-semibold text-gray-900">
                        {tMember('members')}
                      </span>
                    </span>
                    <span className={cn(
                      "font-semibold text-gray-900 block",
                      isRTL ? "mt-3 md:mt-4" : "mt-0"
                    )}>
                      {tMember('are')}{' '}
                      <span className="font-normal text-gray-900">
                        {tMember('loving')}
                      </span>
                    </span>
                  </>
                )}
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 mb-8 md:mb-12">
              {/* Left Side - Quote Icon and Heading */}
              <div className="flex items-center lg:items-start gap-4 lg:gap-6 w-full lg:w-auto lg:flex-shrink-0">
                <div className={cn(
                  "flex-1 lg:max-w-md text-center lg:text-left",
                  isRTL && "lg:text-right"
                )}>
                  <div className="mb-4 md:mb-6">
                    <Quote className="mx-auto lg:mx-0 h-10 w-10 sm:h-12 sm:w-12 md:h-10 md:w-10 text-gray-400 mb-3" />
                    <p className="text-18 sm:text-20 md:text-24 lg:text-28 font-normal text-gray-900">
                      {tMember('fullPhrase') ? (
                        <span className="inline lg:block">
                          {tMember('fullPhrase')}
                        </span>
                      ) : (
                        <>
                          <span className="inline lg:block">
                            {tMember('discover')}
                          </span>{' '}
                          <span className="inline lg:block font-semibold text-gray-900">
                            {tMember('what')}
                          </span>{' '}
                          <span className="inline lg:block font-semibold text-gray-900">
                            {tMember('membersLabel')}
                          </span>
                          {tMember('areSaying') && (
                            <span className="inline lg:block">
                              {' '}
                              {tMember('areSaying')}
                            </span>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <button
                      onClick={goToMemberTestimonialsPrevious}
                      aria-label={tMember('previous')}
                    >
                      <ChevronLeft className={cn("h-5 w-5 text-gray-700", isRTL && "rotate-180")} />
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
                            aria-label={`${tMember('goToPage')} ${index + 1}`}
                          />
                        )
                      )}
                    </div>
                    <button
                      onClick={goToMemberTestimonialsNext}
                      aria-label={tMember('next')}
                    >
                      <ChevronRight className={cn("h-5 w-5 text-gray-700", isRTL && "rotate-180")} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Testimonial Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full lg:w-auto items-stretch">
                {isLoadingPosts ? (
                  <MemberTestimonialCardSkeleton count={3} />
                ) : (
                  currentMemberTestimonials.map((testimonial, index) => (
                    <Card
                      key={`${memberTestimonialsIndex}-${index}`}
                      cardData={{ type: 'member-testimonial', ...testimonial }}
                      className="h-full"
                    />
                  ))
                )}
              </div>
            </div>

            {/* Community Join Banner */}
            <div className={cn(
              "mt-8 md:mt-12 bg-gray-50 rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-12",
              isRTL && "md:flex-row-reverse"
            )}>
              {/* Left: Illustration */}
              <div className={cn(
                "flex-shrink-0 w-full md:w-auto flex justify-center",
                isRTL ? "md:justify-end" : "md:justify-start"
              )}>
                <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                  <Image
                    src={typeof communityBannerSvg === 'string' ? communityBannerSvg : communityBannerSvg.src}
                    alt="Community illustration"
                    fill
                    sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Right: Text Content */}
              <div className={cn("flex-1 flex flex-col gap-4 md:gap-6", isRTL ? "text-center md:text-right" : "text-center md:text-left")}>
                <h3 className="text-24 md:text-28 lg:text-32 font-bold text-gray-900">
                  {tMember('joinCommunity.title')}
                </h3>
                <p className="text-16 md:text-18 text-gray-600 leading-relaxed max-w-2xl">
                  {tMember('joinCommunity.description')}
                </p>
                <div className={cn("flex mt-2", isRTL ? "justify-center md:justify-end" : "justify-center md:justify-start")}>
                  <Button
                    asChild
                    variant="brand"
                    size="lg"
                    className={cn(
                      "rounded-full px-6 md:px-8 py-3 md:py-4 text-16 md:text-18 font-semibold",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    <Link href="/community" dir={isRTL ? 'rtl' : 'ltr'}>
                      {tMember('joinCommunity.button')}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 12: Events Flow */}
        <section className="container-custom py-8 md:py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-8 md:mb-12">
            {/* Left: SVG Illustration */}
            <div className={cn(
              "flex-shrink-0 w-full lg:w-auto flex justify-center",
              isRTL ? "lg:order-2" : "lg:order-1"
            )}>
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <Image
                  src={typeof eventsHomeSvg === 'string' ? eventsHomeSvg : eventsHomeSvg.src}
                  alt="Events planning illustration"
                  fill
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right: Text Content */}
            <div className={cn(
              "flex-1 flex flex-col gap-4 md:gap-6 text-center lg:text-left",
              isRTL && "lg:text-right lg:order-1"
            )}>
              <h2 className={cn(
                "text-24 sm:text-28 md:text-36 lg:text-40 xl:text-48 font-black",
                isRTL && "leading-relaxed"
              )}>
                <span className="font-normal text-gray-900 block">
                  {t('sections.events.title')}{' '}
                  <span className="font-semibold text-gray-900">
                    {t('sections.events.wedding')}
                  </span>
                </span>
                <span className={cn(
                  "font-semibold text-gray-900 block",
                  isRTL ? "mt-3 md:mt-4" : "mt-0"
                )}>
                  {t('sections.events.events')}{' '}
                  <span className="font-normal text-gray-900">
                    {t('sections.events.withEase')}
                  </span>
                </span>
              </h2>
              <p className="text-16 md:text-18 lg:text-20 text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('sections.events.description')}
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-2 md:gap-8 mb-8 md:mb-12">
            {/* Feature 1: Event Management */}
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all">
              <div className="mb-4 p-6 rounded-full bg-brand-100">
                <Calendar className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                {t('sections.events.features.eventManagement.title')}
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                {t('sections.events.features.eventManagement.description')}
              </p>
            </div>

            {/* Feature 2: Budget Planning */}
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all">
              <div className="mb-4 p-6 rounded-full bg-brand-100">
                <DollarSign className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                {t('sections.events.features.budgetPlanning.title')}
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                {t('sections.events.features.budgetPlanning.description')}
              </p>
            </div>

            {/* Feature 3: Guest Lists */}
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all">
              <div className="mb-4 p-6 rounded-full bg-brand-100">
                <UserPlus className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                {t('sections.events.features.guestLists.title')}
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                {t('sections.events.features.guestLists.description')}
              </p>
            </div>

            {/* Feature 4: Timeline */}
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all">
              <div className="mb-4 p-6 rounded-full bg-brand-100">
                <Clock className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="text-18 md:text-20 font-semibold text-gray-900 mb-2">
                {t('sections.events.features.timeline.title')}
              </h3>
              <p className="text-14 text-gray-600 leading-relaxed">
                {t('sections.events.features.timeline.description')}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button
              asChild
              variant="brand"
              size="lg"
              className="rounded-full px-8 md:px-10 py-3 md:py-4 text-16 md:text-18 font-semibold"
            >
              <Link href="/dashboard/my-events">
                {t('sections.events.cta')}
              </Link>
            </Button>
          </div>
        </section>

        {/* Section: App Download */}
        <section className="relative overflow-hidden bg-white py-8 md:py-12">
          <div className="container-custom">
            <div className="text-center mb-0">
              <h2 className="text-32 md:text-40 lg:text-48 font-black text-gray-900 leading-tight">
                <span className="font-normal block">
                  {t('sections.appDownload.title')}
                </span>
                <span className="font-semibold">{t('sections.appDownload.subtitle')}</span>
              </h2>
            </div>

            <div className="flex flex-col items-center ">
               <div className="flex items-center justify-center relative z-20">
                <StoreBadges size="5xl" className=" hidden md:flex gap-4" />
              </div>             
               <div className="relative flex items-center justify-center w-full h-auto -mt-6 md:-mt-10 lg:-mt-12">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-brand-400 via-brand-300 to-brand-200 rounded-full opacity-30 blur-3xl" />

                {/* Phone Image */}
                <div className="relative z-10 w-[750px] md:w-[950px] lg:w-[900px] aspect-[26/16]">
                  <Image
                    src={
                      typeof phoneImage === 'string'
                        ? phoneImage
                        : phoneImage.src
                    }
                    alt="OurBride Mobile App"
                    fill
                    sizes="(max-width: 768px) 750px, (max-width: 1024px) 950px, 1200px"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center relative z-20">
                <StoreBadges size="4xl" className="gap-4 md:hidden" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
