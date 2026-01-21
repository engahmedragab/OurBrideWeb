'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from '@/i18n/navigation'
import {
  ArrowRight,
  CheckCircle2,
    MapPin,
    Star,
  Calendar,
  Package,
    MessageCircle,
  MessageSquare,
  Camera,
  Globe,
    Instagram,
    Facebook,
  Link2,
  Sparkles,
  Palette,
  Layout,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import {
  Button,
  Typography,
  SearchInput,
  LoadingSpinner,
  ErrorDisplay,
  RatingDisplay,
} from '@/components/ui'
import { useProviderLinkee } from '@/hooks/providers/useProviderLinkee'
import { cn } from '@/lib/utils'
import type { LinkResponse } from '@/types/responses/link-response'
import type { MediaResponse } from '@/types/responses/media-response'

interface ProviderLinksClientProps {
    providerId: string
}

interface Template {
    id: string
  name: string
  description: string
  category: string
  previewImage?: string
    icon: React.ReactNode
  gradient: string
  bgColor: string
  textColor: string
  tags: string[]
}

interface ProviderData {
    id: string
    name: string
    nameAr?: string | null
    nameEn?: string | null
    description: string
    logo?: string | null
    banner?: string | null
    galleryImages: string[]
    location: string
    city: string
    rating: number
    totalReviews: number
    isVerified: boolean
    phoneNumber?: string | null
    email?: string | null
    links: LinkResponse[]
    totalServices: number
    totalProducts: number
    totalFollowers: number
    totalViews: number
}

interface LinkItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  isExternal?: boolean
  variant?: 'primary' | 'secondary'
}

const templates: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'A clean and minimal template perfect for any provider. Simple, elegant, and professional.',
    category: 'All',
    gradient: 'from-gray-50 to-white',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    tags: ['Minimal', 'Professional', 'Clean'],
    icon: null,
  },
  {
    id: 'modern',
    name: 'Glamour',
    description: 'A vibrant and glamorous design perfect for beauty salons, makeup artists, and beauty services.',
    category: 'Beauty Services',
    gradient: 'from-pink-50 via-rose-50 to-purple-50',
    bgColor: 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50',
    textColor: 'text-gray-900',
    tags: ['Glamorous', 'Beauty', 'Elegant'],
    icon: null,
  },
  {
    id: 'elegant',
    name: 'Romantic',
    description: 'Sophisticated and romantic design with elegant styling. Perfect for wedding planners and luxury wedding services.',
    category: 'Wedding Services',
    gradient: 'from-rose-50 via-pink-50 to-rose-100',
    bgColor: 'bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100',
    textColor: 'text-gray-900',
    tags: ['Romantic', 'Wedding', 'Elegant'],
    icon: null,
  },
  {
    id: 'bold',
    name: 'Style',
    description: 'Trendy and fashion-forward design. Perfect for bridal boutiques, fashion designers, and style consultants.',
    category: 'Fashion & Attire',
    gradient: 'from-purple-50 via-pink-50 to-fuchsia-50',
    bgColor: 'bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50',
    textColor: 'text-gray-900',
    tags: ['Fashion', 'Trendy', 'Style'],
    icon: null,
  },
  {
    id: 'professional',
    name: 'Sophisticated',
    description: 'Professional and refined design. Ideal for wedding venues, event planners, and premium wedding services.',
    category: 'Wedding Services',
    gradient: 'from-gray-50 via-white to-gray-50',
    bgColor: 'bg-gradient-to-br from-gray-50 via-white to-gray-50',
    textColor: 'text-gray-900',
    tags: ['Professional', 'Refined', 'Premium'],
    icon: null,
  },
  {
    id: 'music',
    name: 'Party',
    description: 'Energetic and vibrant design perfect for DJs, bands, and entertainment services. Showcase your music and events.',
    category: 'Music & Entertainment',
    gradient: 'from-indigo-900 via-purple-900 to-pink-900',
    bgColor: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
    textColor: 'text-white',
    tags: ['Energetic', 'Party', 'Entertainment'],
    icon: null,
  },
  {
    id: 'photography',
    name: 'Portfolio',
    description: 'Clean and artistic design to showcase your photography portfolio. Perfect for wedding photographers and videographers.',
    category: 'Photography & Videography',
    gradient: 'from-gray-100 via-white to-gray-100',
    bgColor: 'bg-gradient-to-br from-gray-100 via-white to-gray-100',
    textColor: 'text-gray-900',
    tags: ['Artistic', 'Portfolio', 'Visual'],
    icon: null,
  },
  {
    id: 'cafe',
    name: 'Delicious',
    description: 'Warm and appetizing design for catering services, bakeries, and food providers. Perfect for wedding catering.',
    category: 'Catering & Food',
    gradient: 'from-amber-50 via-orange-50 to-amber-100',
    bgColor: 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100',
    textColor: 'text-gray-900',
    tags: ['Warm', 'Appetizing', 'Food'],
    icon: null,
  },
  {
    id: 'fashion',
    name: 'Bridal',
    description: 'Elegant and sophisticated design specifically for bridal wear, wedding dresses, and bridal accessories.',
    category: 'Fashion & Attire',
    gradient: 'from-rose-100 via-pink-100 to-rose-200',
    bgColor: 'bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200',
    textColor: 'text-gray-900',
    tags: ['Bridal', 'Elegant', 'Wedding'],
    icon: null,
  },
]

// Categories matching OurBride project (Wedding & Beauty Platform)
const categories = [
  'All',
  'Wedding Services',
  'Beauty Services',
  'Photography & Videography',
  'Catering & Food',
  'Fashion & Attire',
  'Music & Entertainment',
  'Decor & Design',
  'Venues',
]

// Template Preview Component
const TemplatePreview = ({
  template,
  provider,
  linkItems,
}: {
  template: Template
  provider: ProviderData
  linkItems: LinkItem[]
}) => {
  const getTemplateStyles = (templateId: string) => {
    switch (templateId) {
      case 'classic':
        return {
          bg: 'bg-white',
          headerBg: 'bg-transparent',
          textColor: 'text-gray-900',
          secondaryText: 'text-gray-600',
          primaryButton: 'bg-brand-500 text-white rounded-lg',
          secondaryButton: 'bg-white border-2 border-gray-200 text-gray-900 rounded-lg',
          avatarBorder: 'border-2 border-gray-200',
          socialBg: 'bg-gray-100',
          socialIcon: 'text-gray-600',
        }
      case 'modern': // Glamour - Beauty Services
        return {
          bg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50',
          headerBg: 'bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 rounded-3xl p-6 mb-4 shadow-xl',
          textColor: 'text-white',
          secondaryText: 'text-white/95',
          primaryButton: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl shadow-lg font-normal',
          secondaryButton: 'bg-white/90 backdrop-blur-sm border border-pink-200 text-gray-900 rounded-2xl',
          avatarBorder: 'border-4 border-white shadow-lg',
          socialBg: 'bg-white/90 backdrop-blur-sm shadow-md',
          socialIcon: 'text-pink-600',
        }
      case 'elegant':
        return {
          bg: 'bg-gradient-to-b from-gray-100 to-white',
          headerBg: 'bg-white rounded-2xl p-6 mb-4 shadow-md',
          textColor: 'text-gray-900',
          secondaryText: 'text-gray-600',
          primaryButton: 'bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-md',
          secondaryButton: 'bg-white border border-gray-200 text-gray-900 rounded-xl shadow-sm',
          avatarBorder: 'border-4 border-gray-100',
          socialBg: 'bg-gray-100',
          socialIcon: 'text-gray-600',
        }
      case 'bold': // Style - Fashion & Attire
        return {
          bg: 'bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50',
          headerBg: 'bg-gradient-to-br from-purple-300 via-pink-300 to-fuchsia-300 rounded-3xl p-6 mb-4 shadow-xl',
          textColor: 'text-gray-900',
          secondaryText: 'text-gray-700',
          primaryButton: 'bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 text-white rounded-2xl shadow-lg font-normal',
          secondaryButton: 'bg-white/90 backdrop-blur-sm border-2 border-purple-200 text-gray-900 rounded-2xl',
          avatarBorder: 'border-4 border-purple-200 shadow-lg',
          socialBg: 'bg-white/60 backdrop-blur-sm',
          socialIcon: 'text-purple-600',
        }
      case 'professional':
        return {
          bg: 'bg-gray-50',
          headerBg: 'bg-white rounded-lg p-5 mb-4 border-l-4 border-brand-500',
          textColor: 'text-gray-900',
          secondaryText: 'text-gray-600',
          primaryButton: 'bg-brand-500 text-white rounded-lg shadow-md',
          secondaryButton: 'bg-white border border-gray-300 text-gray-900 rounded-lg',
          avatarBorder: 'border-2 border-gray-200',
          socialBg: 'bg-gray-100',
          socialIcon: 'text-gray-600',
        }
      case 'music': // Party - Music & Entertainment
        return {
          bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
          headerBg: 'bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-800 rounded-3xl p-6 mb-4 shadow-2xl',
          textColor: 'text-white',
          secondaryText: 'text-white/90',
          primaryButton: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl font-normal shadow-xl',
          secondaryButton: 'bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl',
          avatarBorder: 'border-4 border-white/30 shadow-lg',
          socialBg: 'bg-white/20 backdrop-blur-sm',
          socialIcon: 'text-white',
        }
      case 'photography':
        return {
          bg: 'bg-white',
          headerBg: 'bg-transparent',
          textColor: 'text-gray-900',
          secondaryText: 'text-gray-600',
          primaryButton: 'bg-black text-white rounded-lg shadow-lg',
          secondaryButton: 'bg-gray-100 border border-gray-200 text-gray-900 rounded-lg',
          avatarBorder: 'border-2 border-gray-300',
          socialBg: 'bg-gray-200',
          socialIcon: 'text-gray-700',
        }
      case 'cafe':
        return {
          bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100',
          headerBg: 'bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-4',
          textColor: 'text-gray-900',
          secondaryText: 'text-gray-700',
          primaryButton: 'bg-orange-500 text-white rounded-xl shadow-lg',
          secondaryButton: 'bg-white border-2 border-orange-200 text-gray-900 rounded-xl',
          avatarBorder: 'border-3 border-orange-200',
          socialBg: 'bg-white/80',
          socialIcon: 'text-orange-600',
        }
      case 'fashion':
        return {
          bg: 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50',
          headerBg: 'bg-white/60 backdrop-blur-sm rounded-3xl p-6 mb-4',
          textColor: 'text-gray-900',
          secondaryText: 'text-gray-700',
          primaryButton: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl shadow-lg',
          secondaryButton: 'bg-white/80 backdrop-blur-sm border border-pink-200 text-gray-900 rounded-2xl',
          avatarBorder: 'border-3 border-pink-300',
          socialBg: 'bg-white/80',
          socialIcon: 'text-pink-600',
        }
      default:
        return {
          bg: 'bg-white',
          headerBg: 'bg-transparent',
          textColor: 'text-gray-900',
          secondaryText: 'text-gray-600',
          primaryButton: 'bg-brand-500 text-white rounded-lg',
          secondaryButton: 'bg-white border border-gray-200 text-gray-900 rounded-lg',
          avatarBorder: 'border-2 border-gray-200',
          socialBg: 'bg-gray-100',
          socialIcon: 'text-gray-600',
        }
    }
  }

  const styles = getTemplateStyles(template.id)
  const hasHeaderBg = template.id !== 'classic' && template.id !== 'photography'

    return (
    <div className={cn('w-full h-full flex flex-col relative', styles.bg)}>
      {/* Background Pattern for music/party template */}
      {template.id === 'music' && (
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}
          />
                                    </div>
                                )}

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative z-10">
        {/* Header */}
        <div className={cn('flex flex-col items-center mb-6 w-full pt-4', hasHeaderBg && styles.headerBg)}>
                        {provider.logo ? (
            <div className={cn('relative w-24 h-24 mb-4', styles.avatarBorder)}>
                                <Image
                                    src={provider.logo}
                                    alt={provider.name}
                                    fill
                className="rounded-full object-cover shadow-lg"
                sizes="96px"
                                />
                                {provider.isVerified && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-500" />
                                    </div>
                                )}
                            </div>
                        ) : (
            <div
              className={cn(
                'w-24 h-24 rounded-full flex items-center justify-center text-32 font-normal mb-4 shadow-lg',
                template.id === 'music'
                  ? 'bg-white/20 backdrop-blur-sm text-white border-4 border-white/30'
                  : template.id === 'modern' || template.id === 'elegant' || template.id === 'bold' || template.id === 'fashion'
                    ? 'bg-white/90 backdrop-blur-sm text-gray-900 border-4 border-white shadow-xl'
                    : 'bg-brand-500 text-white'
              )}
            >
                                {provider.name.charAt(0).toUpperCase()}
                            </div>
                        )}
          <h2 className={cn('text-18 font-normal mb-1 text-center', styles.textColor)}>
            {provider.name}
          </h2>
                        {provider.location && (
            <div className={cn('flex items-center gap-1 text-12 mb-2', styles.secondaryText)}>
              <MapPin className="h-3 w-3" />
                                <span>{provider.location}</span>
                            </div>
                        )}
                        {provider.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <RatingDisplay
                rating={provider.rating}
                size="xs"
                starColor={template.id === 'music' || template.id === 'bold' ? 'yellow' : 'brand'}
              />
                            </div>
                        )}
                        {provider.description && (
            <p className={cn('text-12 text-center max-w-xs mb-4 line-clamp-2', styles.secondaryText)}>
                                {provider.description}
                            </p>
                        )}
                </div>

        {/* Links */}
        <div className="w-full space-y-2.5 flex-1 flex flex-col justify-center">
          {linkItems.slice(0, 4).map((item, index) => {
            // Special styling for bold/style template - colorful buttons
            if (template.id === 'bold' && !item.variant) {
              const colors = [
                'bg-purple-500',
                'bg-pink-500',
                'bg-fuchsia-500',
                'bg-purple-400',
              ]
              const colorClass = colors[index % colors.length]
              return (
                <Button
                            key={item.id}
                  variant="default"
                  size="md"
                            className={cn(
                    'w-full justify-between rounded-xl shadow-lg',
                    colorClass,
                    '!text-white hover:opacity-90'
                                )}
                            >
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 [&>svg]:text-white [&>svg]:stroke-white">
                                            {item.icon}
                                        </div>
                    <span className="text-left truncate">{item.label}</span>
                                    </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-white" />
                </Button>
              )
            }

            // Determine button variant and styling based on template and item variant
            const getButtonVariant = () => {
              if (item.variant === 'primary') {
                return 'brand'
              }
              if (template.id === 'music' || template.id === 'bold') {
                return 'outlineBrand'
              }
              return 'outline'
            }

            const getButtonClassName = () => {
              if (item.variant === 'primary') {
                return cn(
                  'w-full justify-between rounded-xl shadow-lg',
                  styles.primaryButton,
                  '!text-white'
                )
              }
              return cn(
                'w-full justify-between rounded-xl',
                styles.secondaryButton
              )
            }

            const getIconColor = () => {
              if (item.variant === 'primary') {
                return '[&>svg]:text-white [&>svg]:stroke-white'
              }
              if (template.id === 'music' || template.id === 'bold') {
                return '[&>svg]:text-white [&>svg]:stroke-white'
              }
              return '[&>svg]:text-gray-600 [&>svg]:stroke-gray-600'
            }

            const getArrowColor = () => {
              if (item.variant === 'primary') {
                return 'text-white'
              }
              if (template.id === 'music' || template.id === 'bold') {
                return 'text-white/80'
              }
              return 'text-gray-400'
            }

                        return (
              <Button
                                key={item.id}
                variant={getButtonVariant()}
                size="md"
                className={getButtonClassName()}
                            >
                <div className="flex items-center gap-2">
                  <div className={cn('flex-shrink-0', getIconColor())}>
                                            {item.icon}
                                        </div>
                  <span className="text-left truncate">{item.label}</span>
                                    </div>
                <ArrowRight
                  className={cn('h-4 w-4 flex-shrink-0', getArrowColor())}
                />
              </Button>
                        )
                    })}
                </div>

        {/* Social Icons */}
        <div className={cn('flex items-center justify-center gap-3 mt-4 pt-4 border-t', template.id === 'music' || template.id === 'bold' ? 'border-white/20' : 'border-gray-200')}>
          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', styles.socialBg)}>
            <Instagram className={cn('h-3.5 w-3.5', styles.socialIcon)} />
                                </div>
          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', styles.socialBg)}>
            <Facebook className={cn('h-3.5 w-3.5', styles.socialIcon)} />
                                </div>
          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', styles.socialBg)}>
            <Globe className={cn('h-3.5 w-3.5', styles.socialIcon)} />
                        </div>
                    </div>
            </div>
        </div>
    )
}

// Phone Mockup Component
const PhoneMockup = ({
  template,
  provider,
  linkItems,
  onClick,
}: {
  template: Template
  provider: ProviderData
  linkItems: LinkItem[]
  onClick: () => void
}) => {
    return (
    <div
      className="group cursor-pointer flex flex-col items-center"
      onClick={onClick}
    >
      <div className="relative w-[320px] mx-auto">
        {/* Phone Frame */}
        <div className="relative bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl">
          <div className="w-full bg-white rounded-[2rem] overflow-hidden relative">
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20" />

            {/* Screen Content - Full Height */}
            <div className="w-full h-[650px] relative">
              <TemplatePreview template={template} provider={provider} linkItems={linkItems} />
                                    </div>
                            </div>
                    </div>
                </div>

      {/* Template Name Button - Centered and Styled */}
      <Button
        variant="outlineBrand"
        size="sm"
        className="mt-4 w-full max-w-[280px] justify-center font-normal group-hover:translate-x-1 transition-all"
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        {template.name}
        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
        </div>
    )
}

export function ProviderLinksClient({ providerId }: ProviderLinksClientProps) {
    const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const { data: linkeeData, isLoading, error } = useProviderLinkee(providerId)

    if (isLoading) {
        return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading templates..." fullScreen={true} />
        </main>
        <Footer />
            </div>
        )
    }

    if (error || !linkeeData) {
        return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-12">
                <ErrorDisplay
                    title="Provider not found"
                    message="The provider you're looking for doesn't exist or has been removed."
                    actionLabel="Go Home"
                    actionHref="/"
                />
        </div>
        <Footer />
            </div>
        )
    }

    // Extract gallery images URLs
    const galleryImageUrls = (linkeeData.galleryImages || []).map((img: MediaResponse) => {
        return img.url || ''
    }).filter((url: string) => url)

    const provider: ProviderData = {
        id: String(linkeeData.providerId),
        name: linkeeData.nameEn || linkeeData.nameAr || 'Provider',
        nameAr: linkeeData.nameAr || null,
        nameEn: linkeeData.nameEn || null,
        description: linkeeData.descriptionEn || linkeeData.descriptionAr || '',
        logo: linkeeData.logoImageUrl || null,
        banner: linkeeData.bannerImageUrl || null,
        galleryImages: galleryImageUrls,
        location: linkeeData.shortAddress || linkeeData.address?.addressEn || linkeeData.address?.addressAr || '',
        city: linkeeData.address?.cityName || '',
        rating: linkeeData.rate || 0,
        totalReviews: 0,
        isVerified: linkeeData.isVerified,
        phoneNumber: linkeeData.phoneNumber || null,
        email: linkeeData.email || null,
        links: linkeeData.links || [],
        totalServices: linkeeData.totalServices || 0,
        totalProducts: linkeeData.totalProducts || 0,
        totalFollowers: linkeeData.totalFollowers || 0,
        totalViews: linkeeData.totalViews || 0,
    }

    // Build link items
    const buildLinkItems = (): LinkItem[] => {
        const items: LinkItem[] = []

        items.push({
            id: 'book-now',
            label: 'Book Now',
      icon: <Calendar className="h-4 w-4" />,
            href: `/provider/${providerId}/booking`,
            variant: 'primary',
        })

        items.push({
            id: 'view-services',
            label: 'View Services',
      icon: <Package className="h-4 w-4" />,
            href: `/provider/${providerId}#services`,
        })

        if (provider.totalProducts > 0) {
            items.push({
                id: 'view-store',
                label: 'View Store',
        icon: <Package className="h-4 w-4" />,
                href: `/provider/${providerId}/store`,
            })
        }

        if (provider.phoneNumber) {
            const whatsappUrl = `https://wa.me/${provider.phoneNumber.replace(/[^0-9]/g, '')}`
            items.push({
                id: 'whatsapp',
                label: 'WhatsApp Chat',
        icon: <MessageCircle className="h-4 w-4" />,
                href: whatsappUrl,
                isExternal: true,
            })
        }

        items.push({
            id: 'contact',
            label: 'Contact Provider',
      icon: <MessageSquare className="h-4 w-4" />,
            href: `/provider/${providerId}#contact`,
        })

        items.push({
            id: 'reviews',
            label: 'Reviews & Ratings',
      icon: <Star className="h-4 w-4" />,
            href: `/provider/${providerId}#reviews`,
        })

        if (provider.galleryImages && provider.galleryImages.length > 0) {
            items.push({
                id: 'gallery',
        label: `Gallery (${provider.galleryImages.length})`,
        icon: <Camera className="h-4 w-4" />,
                href: `/provider/${providerId}#gallery`,
            })
        }

        provider.links
            .filter(link => link.isAccessible && link.url)
            .forEach((link: LinkResponse) => {
                const linkType = link.type?.toString().toLowerCase() || ''
                const url = link.url || ''
                const title = link.displayName || link.nameEn || link.nameAr || link.title || 'External Link'

        let icon = <Globe className="h-4 w-4" />
                let label = title

                if (url && (url.includes('instagram.com') || linkType.includes('instagram'))) {
          icon = <Instagram className="h-4 w-4" />
                    label = 'Instagram'
                } else if (url && (url.includes('facebook.com') || linkType.includes('facebook'))) {
          icon = <Facebook className="h-4 w-4" />
                    label = 'Facebook'
                }

                if (url) {
                    items.push({
                        id: `link-${link.id}`,
                        label,
                        icon,
                        href: url,
                        isExternal: link.isExternal !== false,
                    })
                }
            })

        return items
    }

    const linkItems = buildLinkItems()

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    const matchesSearch =
      searchQuery.trim() === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleTemplateSelect = (templateId: string) => {
    router.push(`/provider/${providerId}/links/build?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <div className="relative bg-brand-600 border-b border-brand-700 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            />
          </div>

          <div className="container-custom py-12 md:py-16 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6 border-2 border-white/30">
                    <Link2 className="h-12 w-12 text-white" strokeWidth={2} />
                  </div>
                </div>
              </div>

              <Typography variant="h1" className="font-normal mb-4 text-white text-center">
                A Linktree template to suit every brand and creator
              </Typography>
              <Typography variant="body" className="text-lg mb-8 text-white/90 text-center">
                Different templates and visual styles can help you create a Linktree that looks and feels like you and your brand. Explore our library of custom templates to grow and connect with your audience even more easily!
              </Typography>

              {/* Feature Icons */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-white/80">
                  <Palette className="h-5 w-5" />
                  <span className="text-14 font-medium">Customizable</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Layout className="h-5 w-5" />
                  <span className="text-14 font-medium">Multiple Templates</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-14 font-medium">Easy to Use</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
          <div className="container-custom py-4">
            <div className="max-w-2xl mx-auto">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Main Content - Sidebar + Templates */}
        <div className="container-custom py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Categories */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <Typography variant="h6" className="font-normal mb-4">
                  Browse by
                </Typography>
                <div className="space-y-2">
                  {categories.map((category) => (
                            <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                                className={cn(
                        'w-full text-left px-4 py-2.5 rounded-lg text-14 font-medium transition-all',
                        selectedCategory === category
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {category}
                            </button>
                        ))}
                </div>
                </div>
            </div>

            {/* Right Side - Template Previews */}
            <div className="flex-1">
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {filteredTemplates.map((template) => (
                    <PhoneMockup
                      key={template.id}
                      template={template}
                      provider={provider}
                      linkItems={linkItems}
                      onClick={() => handleTemplateSelect(template.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Typography variant="h5" className="mb-2">
                    No templates found
                  </Typography>
                  <Typography variant="bodySmall" textColor="secondary">
                    Try adjusting your search or filter criteria.
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-brand-50 border-t border-gray-200">
          <div className="container-custom py-12">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
            <div className="relative">
                    <div className="absolute inset-0 bg-brand-100 rounded-full blur-xl"></div>
                    <div className="relative bg-white rounded-full p-4 border-2 border-brand-200 shadow-lg">
                      <Sparkles className="h-8 w-8 text-brand-500" strokeWidth={2} />
                    </div>
                  </div>
            </div>

                {/* Content */}
                <div className="flex-1">
                  <Typography variant="h3" className="font-normal mb-4">
                    Get inspired by the best brands and creators
                  </Typography>
                  <Typography variant="body" textColor="secondary" className="mb-6">
                    Join thousands of providers using OurBride Linktree to grow and connect with their audience.
                  </Typography>
                  <div className="flex justify-start">
                    <Button
                      variant="brand"
                      size="md"
                      onClick={() => router.push(`/provider/${providerId}/links/build?template=classic`)}
                    >
                      Get Started
                      <ArrowRight className="h-5 w-5 ml-2" />
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
