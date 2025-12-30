'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ProviderProfileClientProps {
  providerId: string
}

// Mock provider data matching wedding services
const MOCK_PROVIDER = {
  id: '1',
  name: 'Elegant Bridal Studio',
  nameAr: 'استوديو العروس الأنيق',
  type: 'Bridal Salon',
  rating: 4.9,
  totalReviews: 342,
  address: 'King Fahd Road, Al Olaya District, Riyadh',
  neighborhood: 'Al Olaya, Riyadh',
  isVerified: true,
  openUntil: '10:00 PM',
  isOpen: true,
  photos: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  ],
  description:
    'Elegant Bridal Studio is a premier wedding beauty destination in Riyadh, offering comprehensive bridal makeup, hairstyling, and beauty services. Our expert team specializes in creating stunning bridal looks that make your special day unforgettable. With years of experience and a passion for perfection, we ensure every bride feels confident and beautiful.',
  services: [
    {
      id: '1',
      name: 'Bridal Makeup Package | باقة مكياج العروس',
      duration: 180,
      price: 1500,
      currency: 'SAR',
    },
    {
      id: '2',
      name: 'Bridal Hair Styling | تصفيف شعر العروس',
      duration: 120,
      price: 800,
      currency: 'SAR',
    },
    {
      id: '3',
      name: 'Pre-Wedding Facial Treatment | علاج الوجه قبل الزفاف',
      duration: 90,
      price: 600,
      currency: 'SAR',
    },
    {
      id: '4',
      name: 'Henna Design | نقش الحناء',
      duration: 120,
      price: 500,
      currency: 'SAR',
    },
    {
      id: '5',
      name: 'Engagement Makeup | مكياج الخطوبة',
      duration: 90,
      price: 700,
      currency: 'SAR',
    },
    {
      id: '6',
      name: 'Bridal Nail Art | فن الأظافر للعروس',
      duration: 60,
      price: 350,
      currency: 'SAR',
    },
    {
      id: '7',
      name: 'Complete Bridal Package | الباقة الكاملة للعروس',
      duration: 300,
      price: 2800,
      currency: 'SAR',
    },
    {
      id: '8',
      name: 'Bridesmaid Makeup | مكياج وصيفات العروس',
      duration: 60,
      price: 400,
      currency: 'SAR',
    },
  ],
  team: [
    {
      id: '1',
      name: 'Layla Al-Rashid',
      role: 'Lead Makeup Artist',
      rating: 4.9,
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    {
      id: '2',
      name: 'Fatima Hassan',
      role: 'Hair Stylist',
      rating: 4.8,
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    },
    {
      id: '3',
      name: 'Noor Abdullah',
      role: 'Bridal Specialist',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    },
    {
      id: '4',
      name: 'Sara Mohammed',
      role: 'Henna Artist',
      rating: 5.0,
      avatar:
        'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=100',
    },
    {
      id: '5',
      name: 'Aisha Ahmed',
      role: 'Makeup Artist',
      rating: 4.9,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    },
    {
      id: '6',
      name: 'Maryam Ali',
      role: 'Beauty Specialist',
      rating: 4.9,
      avatar:
        'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
    },
  ],
  openingHours: [
    { day: 'Monday', hours: '10:00 AM - 10:00 PM' },
    { day: 'Tuesday', hours: '10:00 AM - 10:00 PM' },
    { day: 'Wednesday', hours: '10:00 AM - 10:00 PM' },
    { day: 'Thursday', hours: '10:00 AM - 10:00 PM' },
    { day: 'Friday', hours: '2:00 PM - 10:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 10:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 10:00 PM' },
  ],
  amenities: [
    'Instant Confirmation',
    'Online Payment',
    'Private Bridal Suites',
    'Complimentary Consultation',
    'Professional Photography',
    'Parking Available',
    'Refreshments Provided',
    'Wheelchair Accessible',
  ],
  reviews: [
    {
      id: '1',
      userName: 'نورة العتيبي',
      date: 'Sun, Dec 28, 2025',
      rating: 5,
      text: 'تجربة رائعة! فريق محترف جداً وميك اب العروس كان خيالي. شكراً لليلى على الإبداع والاهتمام بأدق التفاصيل',
    },
    {
      id: '2',
      userName: 'Sarah Al-Qahtani',
      date: 'Fri, Dec 26, 2025',
      rating: 5,
      text: 'Best bridal studio in Riyadh! The team made me feel like a princess. Layla is an amazing makeup artist and the hair styling was perfect. Highly recommend!',
    },
    {
      id: '3',
      userName: 'مريم السعيد',
      date: 'Wed, Dec 24, 2025',
      rating: 5,
      text: 'استوديو فخم ونظيف، الخدمة ممتازة والأسعار مناسبة. نقش الحناء من سارة كان تحفة فنية. أنصح كل عروس بزيارتهم',
    },
  ],
}

export function ProviderProfileClient({
  providerId,
}: ProviderProfileClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<
    'services' | 'team' | 'reviews' | 'about'
  >('services')
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const provider = MOCK_PROVIDER

  const handleBookService = (serviceId: string) => {
    // Navigate to booking page with service pre-selected
    router.push(`/provider/${providerId}/booking?service=${serviceId}`)
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex(prev => (prev + 1) % provider.photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex(
      prev => (prev - 1 + provider.photos.length) % provider.photos.length
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Photos */}
        <div className="bg-white">
          <div className="container-custom py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-14 text-gray-600 mb-4">
              <button
                onClick={() => router.push('/')}
                className="hover:text-brand-600"
              >
                Home
              </button>
              <span>/</span>
              <button
                onClick={() => router.push('/providers')}
                className="hover:text-brand-600"
              >
                Providers
              </button>
              <span>/</span>
              <span className="text-gray-900">{provider.name}</span>
            </div>

            {/* Provider Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-28 md:text-36 font-semibold text-gray-900">
                    {provider.name}
                  </h1>
                  {provider.isVerified && (
                    <CheckCircle2 className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-14 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {provider.rating}
                    </span>
                    <span>({provider.totalReviews.toLocaleString()})</span>
                  </div>
                  <span>•</span>
                  <span
                    className={
                      provider.isOpen ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {provider.isOpen
                      ? `Open until ${provider.openUntil}`
                      : 'Closed'}
                  </span>
                  <span>•</span>
                  <span>{provider.neighborhood}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-[400px] md:h-[500px]">
              <Image
                src={provider.photos[currentPhotoIndex]}
                alt={`${provider.name} - Photo ${currentPhotoIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />

              {/* Navigation Arrows */}
              {provider.photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-900" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-900" />
                  </button>
                </>
              )}

              {/* Photo Counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-12 font-medium">
                {currentPhotoIndex + 1} / {provider.photos.length}
              </div>

              {/* Thumbnail Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {provider.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      index === currentPhotoIndex
                        ? 'bg-white w-6'
                        : 'bg-white/60'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="container-custom">
            <div className="flex items-center gap-8 overflow-x-auto">
              {(
                [
                  { id: 'services' as const, label: 'Services' },
                  { id: 'team' as const, label: 'Team' },
                  { id: 'reviews' as const, label: 'Reviews' },
                  { id: 'about' as const, label: 'About' },
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'py-4 text-16 font-medium transition-colors relative whitespace-nowrap',
                    activeTab === tab.id
                      ? 'text-brand-600'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Services Tab */}
              {activeTab === 'services' && (
                <div>
                  <h2 className="text-24 font-semibold text-gray-900 mb-6">
                    Services
                  </h2>
                  <div className="space-y-3">
                    {provider.services.map(service => (
                      <div
                        key={service.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-16 font-semibold text-gray-900 mb-1">
                              {service.name}
                            </h3>
                            <div className="flex items-center gap-3 text-14 text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {service.duration} min
                              </span>
                              <span className="font-semibold text-gray-900">
                                {service.currency} {service.price}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="brand"
                            size="md"
                            onClick={() => handleBookService(service.id)}
                            className="ml-4 !text-white"
                          >
                            Book
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Tab */}
              {activeTab === 'team' && (
                <div>
                  <h2 className="text-24 font-semibold text-gray-900 mb-6">
                    Team
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {provider.team.map(member => (
                      <div
                        key={member.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                      >
                        <div className="relative w-16 h-16 mx-auto mb-3">
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            fill
                            className="rounded-full object-cover"
                            sizes="64px"
                          />
                        </div>
                        <h3 className="text-16 font-semibold text-gray-900 mb-1">
                          {member.name}
                        </h3>
                        <p className="text-14 text-gray-600 mb-2">
                          {member.role}
                        </p>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-14 font-semibold text-gray-900">
                            {member.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-24 font-semibold text-gray-900">
                      Reviews
                    </h2>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-18 font-semibold text-gray-900">
                        {provider.rating}
                      </span>
                      <span className="text-14 text-gray-600">
                        ({provider.totalReviews})
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {provider.reviews.map(review => (
                      <div
                        key={review.id}
                        className="bg-white border border-gray-200 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-16 font-semibold text-gray-900">
                              {review.userName}
                            </h4>
                            <p className="text-12 text-gray-500">
                              {review.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-14 font-semibold text-gray-900">
                              {review.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-14 text-gray-700 leading-relaxed">
                          {review.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-6">
                    <Button variant="outline" size="md">
                      See all reviews
                    </Button>
                  </div>
                </div>
              )}

              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-24 font-semibold text-gray-900 mb-4">
                      About
                    </h2>
                    <p className="text-16 text-gray-700 leading-relaxed">
                      {provider.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-20 font-semibold text-gray-900 mb-4">
                      Opening Hours
                    </h3>
                    <div className="space-y-2">
                      {provider.openingHours.map(schedule => (
                        <div
                          key={schedule.day}
                          className="flex items-center justify-between text-14"
                        >
                          <span className="text-gray-600">{schedule.day}</span>
                          <span className="text-gray-900 font-medium">
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-20 font-semibold text-gray-900 mb-4">
                      Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {provider.amenities.map(amenity => (
                        <span
                          key={amenity}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-14 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Location Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-18 font-semibold text-gray-900 mb-4">
                    Location
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-14 text-gray-700">
                        {provider.address}
                      </p>
                    </div>
                    <Button variant="outline" size="md" className="w-full">
                      Get Directions
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-18 font-semibold text-gray-900 mb-4">
                    Contact
                  </h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
