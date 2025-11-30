import { useState } from 'react'
import { Link } from 'react-router-dom'
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
} from '@/components/ui/Card'
import { StoreBadges } from '@/components/ui/StoreBadges'
import {
  ArrowRight,
  Users,
  ChevronLeft,
  ChevronRight,
  DollarSign,
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
import product from '@/assets/svg/product-1.svg'
import phoneImage from '@/assets/images/phone.png'

// Mock data - Replace with actual API data later
const mockProducts: ProductCardData[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
    title: 'Essential Wedding Cream',
    providerName: 'YUNJAC',
    verified: true,
    rating: 4.5,
    originalPrice: 6000,
    discountedPrice: 4500,
    tags: ['Makeup', 'Body Care', 'Tag', 'Tag'],
    showTopOfferBadge: true,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
    title: 'Bridal Makeup Kit',
    providerName: 'Beauty Pro',
    verified: true,
    rating: 4.5,
    originalPrice: 5000,
    discountedPrice: 4500,
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    showTopOfferBadge: true,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1583241801824-9055b66b9d29?w=400',
    title: 'Hair Care Essentials',
    providerName: 'Hair Studio',
    verified: true,
    rating: 4.5,
    originalPrice: 5500,
    discountedPrice: 4500,
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    showTopOfferBadge: true,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    title: 'Skin Care Bundle',
    providerName: 'Skincare Co',
    verified: true,
    rating: 4.5,
    originalPrice: 6000,
    discountedPrice: 4500,
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    showTopOfferBadge: true,
  },
]

const mockServices: ServiceCardData[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    title: 'Professional Makeup Service',
    providerName: 'Makeup Studio',
    verified: true,
    rating: 4.5,
    originalPrice: 6000,
    discountedPrice: 4500,
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    showTopOfferBadge: true,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    title: 'Hair Styling Service',
    providerName: 'Hair Salon',
    verified: true,
    rating: 4.5,
    originalPrice: 5000,
    discountedPrice: 4500,
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    showTopOfferBadge: true,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400',
    title: 'Bridal Photo Session',
    providerName: 'Photo Studio',
    verified: true,
    rating: 4.5,
    originalPrice: 5500,
    discountedPrice: 4500,
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    showTopOfferBadge: true,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400',
    title: 'Wedding Planning Service',
    providerName: 'Event Planner',
    verified: true,
    rating: 4.5,
    originalPrice: 6000,
    discountedPrice: 4500,
    tags: ['Tag', 'Tag', 'Tag', 'Tag'],
    showTopOfferBadge: true,
  },
]

const mockTestimonials: TestimonialCardData[] = [
  {
    quote:
      'OurBride is your all-in-one platform for wedding planning and shopping.',
    rating: 5,
    authorName: 'Sarah Mohamed',
    authorImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    timeAgo: '10 Days Ago',
  },
  {
    quote:
      'OurBride is your all-in-one platform for wedding planning and shopping.',
    rating: 5,
    authorName: 'Sarah Mohamed',
    authorImage:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    timeAgo: '10 Days Ago',
  },
  {
    quote:
      'OurBride is your all-in-one platform for wedding planning and shopping.',
    rating: 5,
    authorName: 'Sarah Mohamed',
    authorImage:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    timeAgo: '10 Days Ago',
  },
  {
    quote: 'Amazing platform! Made my wedding planning so much easier.',
    rating: 5,
    authorName: 'Fatima Ali',
    authorImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    timeAgo: '5 Days Ago',
  },
  {
    quote: 'Great service and beautiful design. Highly recommend!',
    rating: 5,
    authorName: 'Mariam Hassan',
    authorImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    timeAgo: '3 Days Ago',
  },
  {
    quote: 'Found everything I needed for my perfect wedding day.',
    rating: 5,
    authorName: 'Nour Ibrahim',
    authorImage:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100',
    timeAgo: '1 Day Ago',
  },
]

const mockProviders: ProviderCardData[] = [
  {
    id: '1',
    name: 'Hoda Mohamed',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    profession: 'Makeup Artist',
    rating: 5,
    verified: true,
  },
  {
    id: '2',
    name: 'Hoda Mohamed',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    profession: 'Makeup Artist',
    rating: 5,
    verified: true,
  },
  {
    id: '3',
    name: 'Hoda Mohamed',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    profession: 'Makeup Artist',
    rating: 5,
    verified: true,
  },
  {
    id: '4',
    name: 'Hoda Mohamed',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    profession: 'Makeup Artist',
    rating: 5,
    verified: true,
  },
]

const mockMemberTestimonials: MemberTestimonialCardData[] = [
  {
    authorName: 'Aya Mohamed',
    authorImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    reviewText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    productImages: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
    ],
    date: '18 Aug 2025 12:45 PM',
    likes: 20,
    comments: 20,
  },
  {
    authorName: 'Aya Mohamed',
    authorImage:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    reviewText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    productImages: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    ],
    date: '18 Aug 2025 12:45 PM',
    likes: 20,
    comments: 20,
  },
  {
    authorName: 'Aya Mohamed',
    authorImage:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    reviewText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    productImages: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
    ],
    date: '18 Aug 2020',
    likes: 20,
    comments: 20,
  },
  {
    authorName: 'Fatima Ali',
    authorImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    reviewText:
      'Amazing products and excellent service! The quality exceeded my expectations.',
    productImages: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
    ],
    date: '15 Aug 2025 10:30 AM',
    likes: 35,
    comments: 12,
  },
  {
    authorName: 'Mariam Hassan',
    authorImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    reviewText:
      'Great experience with OurBride! Found everything I needed for my special day.',
    productImages: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
    ],
    date: '12 Aug 2025 3:20 PM',
    likes: 28,
    comments: 8,
  },
  {
    authorName: 'Nour Ibrahim',
    authorImage:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100',
    reviewText:
      'Highly recommend! The platform made wedding planning so much easier.',
    productImages: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
    ],
    date: '10 Aug 2025 9:15 AM',
    likes: 42,
    comments: 15,
  },
]

export default function Home() {
  // Testimonials carousel state
  const [testimonialsIndex, setTestimonialsIndex] = useState(0)
  const testimonialsPerPage = 3
  const testimonialsTotalPages = Math.ceil(
    mockTestimonials.length / testimonialsPerPage
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
  const memberTestimonialsPerPage = 3
  const memberTestimonialsTotalPages = Math.ceil(
    mockMemberTestimonials.length / memberTestimonialsPerPage
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

  // Trust cards data
  const trustCards = [
    {
      id: '1',
      heading: 'Made for Local Brides',
      description:
        'Tailored for brides across Egypt — especially those outside the capital.',
      rotation: -3,
      background: 'gray',
    },
    {
      id: '2',
      heading: 'Simple & Beautiful Experience',
      description:
        'A feminine, easy-to-use design that makes planning delightful.',
      rotation: 2,
      background: 'white',
    },
    {
      id: '3',
      heading: 'Real Offers & Savings',
      description: 'Exclusive coupons and discounts designed for your budget.',
      rotation: -2,
      background: 'gray',
    },
    {
      id: '4',
      heading: 'All-in-One Platform',
      description: 'Plan, book, shop, and celebrate everything in one place.',
      rotation: 3,
      background: 'white',
    },
    {
      id: '5',
      heading: 'Verified Trusted Providers',
      description:
        'All our service providers are carefully verified and trusted.',
      rotation: -1.5,
      background: 'gray',
    },
    {
      id: '6',
      heading: 'Secure Payments',
      description:
        'Your payments are safe and secure with our trusted payment system.',
      rotation: 2.5,
      background: 'white',
    },
  ]

  // Journey steps data
  const journeySteps = [
    {
      stepNumber: 1,
      title: 'Step #1',
      description: 'Exclusive coupons and discounts designed for your budget.',
    },
    {
      stepNumber: 2,
      title: 'Step #2',
      description: 'Exclusive coupons and discounts designed for your budget.',
    },
    {
      stepNumber: 3,
      title: 'Step #3',
      description: 'Exclusive coupons and discounts designed for your budget.',
    },
  ]

  const positionClasses = [
    '',
    'lg:translate-x-[10px] lg:translate-y-[15px]',
    'lg:-translate-x-[5px] lg:-translate-y-[10px]',
    'lg:translate-x-[8px] lg:-translate-y-[5px]',
    'lg:-translate-x-[12px] lg:translate-y-[12px]',
    'lg:translate-x-[15px] lg:translate-y-[8px]',
  ]

  const currentTestimonials = mockTestimonials.slice(
    testimonialsIndex * testimonialsPerPage,
    testimonialsIndex * testimonialsPerPage + testimonialsPerPage
  )

  const currentMemberTestimonials = mockMemberTestimonials.slice(
    memberTestimonialsIndex * memberTestimonialsPerPage,
    memberTestimonialsIndex * memberTestimonialsPerPage +
      memberTestimonialsPerPage
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
              <h1 className="text-30 md:text-40 lg:text-48 font-bold text-gray-900 leading-tight mt-2">
                YOUR BRIDE ALWAYS IS <br />
                <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                  OUR RESPONSIBILITY.
                </span>
              </h1>

              {/* Description */}
              <p className="text-16 md:text-18 text-gray-600 leading-relaxed max-w-lg">
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
                  <img
                    src={heroCircularSvg}
                    alt=""
                    className="absolute inset-0 w-full h-full"
                    aria-hidden="true"
                  />
                  {/* Bride Image */}
                  <div className="absolute inset-[6.52px] rounded-full overflow-hidden z-10 flex items-center justify-center">
                    <img
                      src={heroBrideImage}
                      alt="Happy Bride"
                      className="w-full h-full object-contain"
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
                    fill="#FF5A5A"
                    className="font-black text-[12px] uppercase"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    <textPath href="#circle-text" startOffset="0%">
                      START SHOPPING NOW WITH OURBRIDE
                    </textPath>
                  </text>
                </svg>

                {/* Inner Fixed Circle and Arrow */}
                <div className="relative z-10 flex items-center justify-center">
                  {/* Inner Filled Circle */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#FF5A5A] flex items-center justify-center shadow-md">
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
                <div className="aspect-[5/2] overflow-hidden">
                  <img
                    src={heroCardBrideImage}
                    alt="Explore Products"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-14 font-semibold rounded-full"
                    asChild
                  >
                    <Link to="/products">Explore Products</Link>
                  </Button>
                </div>
              </div>
              <div className="relative w-48 md:w-56 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-[5/2] overflow-hidden">
                  <img
                    src={heroCardBrideImage}
                    alt="Explore Products"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-14 font-semibold rounded-full"
                    asChild
                  >
                    <Link to="/products">Explore Products</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Offer Banner */}
        <section className="container-custom">
          <div className="bg-brand-500 rounded-2xl px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <h2 className="text-32 md:text-40 lg:text-48 font-black text-white mb-4">
                  25% Offer On our products
                </h2>
                <p className="text-18 md:text-18 text-white/90 mb-6 max-w-lg mx-auto lg:mx-0">
                  OurBride is your all-in-one platform for wedding planning and
                  shopping. Find everything you need to create your perfect day.
                </p>
                <div className="flex justify-center lg:justify-start">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-16 font-semibold rounded-full bg-white text-brand-500 hover:bg-gray-50 border-white"
                    asChild
                  >
                    <Link to="/products">
                      Start Shopping
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              {/* Right Content - Product Images */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="flex gap-4">
                    <img
                      src={product}
                      alt=""
                      className=" md:w-100 md:h-100 object-contain"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Statistics */}
        <section className="container-custom py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-32 md:text-40 lg:text-48 font-md text-brand-500 mb-2">
                +1200
              </div>
              <div className="text-14 md:text-16 font-md text-gray-600">
                Clients
              </div>
            </div>
            <div className="text-center">
              <div className="text-32 md:text-40 lg:text-48 font-md text-brand-500 mb-2">
                +600
              </div>
              <div className="text-14 md:text-16 font-md text-gray-600">
                Services Providers
              </div>
            </div>
            <div className="text-center">
              <div className="text-32 md:text-40 lg:text-48 font-md text-brand-500 mb-2">
                +30
              </div>
              <div className="text-14 md:text-16 font-md text-gray-600">
                Available Services
              </div>
            </div>
            <div className="text-center">
              <div className="text-32 md:text-40 lg:text-48 font-md text-brand-500 mb-2">
                +2500
              </div>
              <div className="text-14 md:text-16 font-md text-gray-600">
                Products
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Benefits */}
        <section className="container-custom py-12 md:py-16 bg-gray-50 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center mb-4 relative">
                <BadgeCheck className="h-8 w-8 text-white" />
                <CheckCircle2 className="h-4 w-4 text-brand-500 absolute -bottom-0.5 -right-0.5 bg-white rounded-full border-2 border-white" />
              </div>
              <h3 className="text-16 md:text-18 font-normal text-gray-900 mb-2">
                Verified Trusted Providers
              </h3>
              <p className="text-14 text-gray-600">
                All our service providers are carefully verified and trusted.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center mb-4">
                <TargetIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-16 md:text-18 font-normal text-gray-900 mb-2">
                All-in-One Wedding Hub
              </h3>
              <p className="text-14 text-gray-600">
                Plan, book, shop, and celebrate everything in one place.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center mb-4 relative">
                <Shield className="h-8 w-8 text-white" />
                <DollarSign className="h-4 w-4 text-white absolute" />
              </div>
              <h3 className="text-16 md:text-18 font-normal text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-14 text-gray-600">
                Your payments are safe and secure with our trusted payment
                system.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center mb-4">
                <Tag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-16 md:text-18 font-normal text-gray-900 mb-2">
                Exclusive Offers & Rewards
              </h3>
              <p className="text-14 text-gray-600">
                Exclusive coupons and discounts designed for your budget.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Suggested Products */}
        <section className="container-custom py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-30 md:text-32 font-normal text-gray-900">
              Products Suggested for You
            </h2>
            <Link
              to="/products"
              className="flex items-center gap-2 text-16 font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.map(product => (
              <Card
                key={product.id}
                cardData={{ type: 'product', ...product }}
              />
            ))}
          </div>
        </section>

        {/* Section 6: Suggested Services */}
        <section className="container-custom py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-28 md:text-32 font-normal text-gray-900">
              Services Suggested for You
            </h2>
            <Link
              to="/services"
              className="flex items-center gap-2 text-16 font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockServices.map(service => (
              <Card
                key={service.id}
                cardData={{ type: 'service', ...service }}
              />
            ))}
          </div>
        </section>

        {/* Section 7: Why Trust Section */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-white">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <img
              src={lineS2Svg}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="container-custom relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-32 md:text-40 lg:text-48 font-black">
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
                {trustCards.map((card, index) => {
                  const positionClass = positionClasses[index] || ''
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
        </section>

        {/* Section 8: Testimonials */}
        <section className="container-custom py-12 md:py-16">
          {/* Centered Heading Above Section */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-32 md:text-40 lg:text-48 font-black">
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
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 mb-8 md:mb-12">
            {/* Left Side - Quote Icon and Heading */}
            <div className="flex items-start gap-4 lg:gap-6 w-full lg:w-auto lg:flex-shrink-0">
              <div className="flex-1 lg:max-w-md">
                <div className="mb-4 md:mb-6">
                  <Quote className="h-12 w-12 md:h-10 md:w-10 text-gray-400 mb-3" />
                  <p className="text-20 md:text-24 lg:text-28 font-normal text-gray-900">
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
              {currentTestimonials.map((testimonial, index) => (
                <Card
                  key={`${testimonialsIndex}-${index}`}
                  cardData={{ type: 'testimonial', ...testimonial }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section 9: Providers */}
        <section className="container-custom py-12 md:py-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-32 md:text-40 lg:text-48 font-black mb-4 md:mb-6">
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
            {mockProviders.map(provider => (
              <Card
                key={provider.id}
                cardData={{ type: 'provider', ...provider }}
              />
            ))}
          </div>
        </section>

        {/* Section 10: Wedding Journey */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-white">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <img
              src={lineS4Svg}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="container-custom relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-32 md:text-40 lg:text-48 font-black mb-4 md:mb-6">
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
                {journeySteps.map((step, index) => (
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

        {/* Section 11: Member Testimonials */}
        <section className="container-custom py-12 md:py-16">
          {/* Centered Heading Above Section */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-32 md:text-40 lg:text-48 font-black">
              <span className="font-normal text-gray-900">
                Our Bride{' '}
                <span className="font-semibold text-gray-900">Members</span>
              </span>
              <br />
              <span className="font-semibold text-gray-900">
                Are <span className="font-normal text-gray-900">Loving</span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 mb-8 md:mb-12">
            {/* Left Side - Quote Icon and Heading */}
            <div className="flex items-start gap-4 lg:gap-6 w-full lg:w-auto lg:flex-shrink-0">
              <div className="flex-1 lg:max-w-md">
                <div className="mb-4 md:mb-6">
                  <Quote className="h-12 w-12 md:h-10 md:w-10 text-gray-400 mb-3" />
                  <p className="text-20 md:text-24 lg:text-28 font-normal text-gray-900">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full lg:w-auto">
              {currentMemberTestimonials.map((testimonial, index) => (
                <Card
                  key={`${memberTestimonialsIndex}-${index}`}
                  cardData={{ type: 'member-testimonial', ...testimonial }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section 12: App Download */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-white border-t border-gray-200">
          <div className="container-custom">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-32 md:text-40 lg:text-48 font-black text-gray-900">
                <span className="font-normal">Find Your Wedding Journey</span>{' '}
                <span className="font-semibold">Starts Here</span>
              </h2>
            </div>
            <div className="flex items-center justify-center mb-12 md:mb-16">
              <StoreBadges size="lg" />
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-brand-500 rounded-full opacity-20 blur-3xl" />
              <div className="relative z-10 transform rotate-6 md:rotate-12">
                <img
                  src={phoneImage}
                  alt="OurBride Mobile App"
                  className="w-[280px] md:w-[400px] lg:w-[500px] h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500" />
        </section>
      </main>
      <Footer />
    </div>
  )
}
