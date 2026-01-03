'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    Calendar,
    MapPin,
    Clock,
    Star,
    CheckCircle2,
    MessageCircle,
    Instagram,
    Facebook,
    Globe,
    Camera,
    Package,
    Tag,
    MessageSquare,
    Share2,
    AlertCircle,
    ArrowRight,
    Phone,
    Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner, ErrorDisplay } from '@/components/ui'
import { RatingDisplay } from '@/components/ui/RatingDisplay'
import { useProviderLinkee } from '@/hooks/providers/useProviderLinkee'
import { cn } from '@/lib/utils'
import type { LinkResponse } from '@/types/responses/link-response'

interface ProviderLinksClientProps {
    providerId: string
}

interface LinkItem {
    id: string
    label: string
    icon: React.ReactNode
    href: string
    isExternal?: boolean
    variant?: 'primary' | 'secondary'
    onClick?: () => void
}

export function ProviderLinksClient({ providerId }: ProviderLinksClientProps) {
    const router = useRouter()
    const { data: linkeeData, isLoading, error } = useProviderLinkee(parseInt(providerId))

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (error || !linkeeData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <ErrorDisplay
                    title="Provider not found"
                    message="The provider you're looking for doesn't exist or has been removed."
                    actionLabel="Go Home"
                    actionHref="/"
                />
            </div>
        )
    }

    const provider = {
        id: linkeeData.providerId,
        name: linkeeData.nameEn || linkeeData.nameAr || 'Provider',
        nameAr: linkeeData.nameAr,
        nameEn: linkeeData.nameEn,
        description: linkeeData.descriptionEn || linkeeData.descriptionAr || '',
        logo: linkeeData.logoImageUrl,
        banner: linkeeData.bannerImageUrl,
        galleryImages: linkeeData.galleryImages || [],
        location: linkeeData.shortAddress || linkeeData.address?.addressEn || linkeeData.address?.addressAr || '',
        city: linkeeData.address?.cityName || '',
        rating: linkeeData.rate || 0,
        totalReviews: 0, // Not available in ProviderLinkeeResponse
        isVerified: linkeeData.isVerified,
        phoneNumber: linkeeData.phoneNumber,
        email: linkeeData.email,
        links: linkeeData.links || [],
        uniqueCode: linkeeData.uniqueCode,
        qrCodeData: linkeeData.qrCodeData,
        publicProfileSlug: linkeeData.publicProfileSlug,
        shareUrl: linkeeData.shareUrl,
        totalServices: linkeeData.totalServices || 0,
        totalProducts: linkeeData.totalProducts || 0,
        totalFollowers: linkeeData.totalFollowers || 0,
        totalViews: linkeeData.totalViews || 0,
    }

    // Format working hours - not available in ProviderLinkeeResponse
    const formatWorkingHours = () => {
        return 'Hours not available'
    }

    // Build link items
    const buildLinkItems = (): LinkItem[] => {
        const items: LinkItem[] = []

        // Primary Actions
        items.push({
            id: 'book-now',
            label: 'Book Now',
            icon: <Calendar className="h-5 w-5" />,
            href: `/provider/${providerId}/booking`,
            variant: 'primary',
        })

        items.push({
            id: 'view-services',
            label: 'View Services',
            icon: <Package className="h-5 w-5" />,
            href: `/provider/${providerId}#services`,
        })

        if (provider.totalProducts > 0) {
            items.push({
                id: 'view-store',
                label: 'View Store',
                icon: <Package className="h-5 w-5" />,
                href: `/provider/${providerId}/store`,
            })
        }

        // Contact Actions
        if (provider.phoneNumber) {
            const whatsappUrl = `https://wa.me/${provider.phoneNumber.replace(/[^0-9]/g, '')}`
            items.push({
                id: 'whatsapp',
                label: 'WhatsApp Chat',
                icon: <MessageCircle className="h-5 w-5" />,
                href: whatsappUrl,
                isExternal: true,
            })
        }

        items.push({
            id: 'contact',
            label: 'Contact Provider',
            icon: <MessageSquare className="h-5 w-5" />,
            href: `/provider/${providerId}#contact`,
        })

        // Reviews & Gallery
        items.push({
            id: 'reviews',
            label: 'Reviews & Ratings',
            icon: <Star className="h-5 w-5" />,
            href: `/provider/${providerId}#reviews`,
        })

        if (provider.galleryImages && provider.galleryImages.length > 0) {
            items.push({
                id: 'gallery',
                label: `Gallery & Portfolio (${provider.galleryImages.length})`,
                icon: <Camera className="h-5 w-5" />,
                href: `/provider/${providerId}#gallery`,
            })
        }

        // External Links from API
        provider.links
            .filter(link => link.isAccessible && link.url)
            .forEach((link: LinkResponse) => {
                const linkType = link.type?.toString().toLowerCase() || ''
                const url = link.url || ''
                const title = link.displayName || link.nameEn || link.nameAr || link.title || 'External Link'

                let icon = <Globe className="h-5 w-5" />
                let label = title

                // Detect link type and set appropriate icon
                if (url && (url.includes('instagram.com') || linkType.includes('instagram'))) {
                    icon = <Instagram className="h-5 w-5" />
                    label = 'Instagram'
                } else if (url && (url.includes('facebook.com') || linkType.includes('facebook'))) {
                    icon = <Facebook className="h-5 w-5" />
                    label = 'Facebook'
                } else if (url && (url.includes('wa.me') || url.includes('whatsapp.com') || linkType.includes('whatsapp'))) {
                    icon = <MessageCircle className="h-5 w-5" />
                    label = 'WhatsApp'
                } else if (linkType.includes('website') || linkType.includes('web')) {
                    icon = <Globe className="h-5 w-5" />
                    label = title.length > 30 ? title.substring(0, 30) + '...' : title
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

        // Location
        if (provider.location) {
            items.push({
                id: 'location',
                label: 'View Location on Map',
                icon: <MapPin className="h-5 w-5" />,
                href: `/provider/${providerId}#location`,
            })
        }

        return items
    }

    const linkItems = buildLinkItems()

    const handleLinkClick = (item: LinkItem) => {
        if (item.onClick) {
            item.onClick()
            return
        }

        if (item.isExternal) {
            window.open(item.href, '_blank', 'noopener,noreferrer')
        } else {
            router.push(item.href)
        }
    }

    const handleShare = async () => {
        const shareData = {
            title: `${provider.name} - OurBride`,
            text: `Check out ${provider.name} on OurBride`,
            url: window.location.href,
        }

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData)
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(window.location.href)
                alert('Link copied to clipboard!')
            }
        } catch (error) {
            // User cancelled or error occurred
            if (error instanceof Error && error.name !== 'AbortError') {
                // Fallback to clipboard
                try {
                    await navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                } catch (clipboardError) {
                    console.error('Failed to copy to clipboard:', clipboardError)
                }
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-md mx-auto px-4 py-6">
                    {/* Provider Logo/Image */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative w-24 h-24 mb-3">
                            {provider.logo ? (
                                <Image
                                    src={provider.logo}
                                    alt={provider.name}
                                    fill
                                    className="rounded-full object-cover border-4 border-white shadow-lg"
                                    sizes="96px"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-32 font-bold">
                                    {provider.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            {provider.isVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                                    <CheckCircle2 className="h-5 w-5 text-brand-500" />
                                </div>
                            )}
                        </div>

                        {/* Provider Name */}
                        <h1 className="text-24 font-bold text-gray-900 mb-1 text-center">{provider.name}</h1>

                        {/* Service Category & Location */}
                        <div className="flex flex-col items-center gap-1 mb-3">
                            {provider.location && (
                                <div className="flex items-center gap-1 text-14 text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>{provider.location}</span>
                                </div>
                            )}

                            {/* Rating */}
                            {provider.rating > 0 && (
                                <div className="flex items-center gap-2">
                                    <RatingDisplay
                                        rating={provider.rating}
                                        size="sm"
                                    />
                                    {provider.totalReviews > 0 && (
                                        <span className="text-12 text-gray-500">({provider.totalReviews})</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {provider.description && (
                            <p className="text-14 text-gray-600 text-center max-w-sm mb-4 line-clamp-3">
                                {provider.description}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-12 text-gray-500 mb-4">
                            {provider.totalServices > 0 && (
                                <span>{provider.totalServices} Services</span>
                            )}
                            {provider.totalProducts > 0 && (
                                <>
                                    <span>•</span>
                                    <span>{provider.totalProducts} Products</span>
                                </>
                            )}
                            {provider.totalFollowers > 0 && (
                                <>
                                    <span>•</span>
                                    <span>{provider.totalFollowers} Followers</span>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto px-4 py-6 space-y-3">
                {/* Primary Action Buttons */}
                {linkItems
                    .filter(item => item.variant === 'primary')
                    .map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleLinkClick(item)}
                            className={cn(
                                'w-full flex items-center justify-between gap-3 px-6 py-4 rounded-xl',
                                'bg-brand-500 text-white font-semibold text-16',
                                'hover:bg-brand-600 active:scale-[0.98] transition-all duration-200',
                                'shadow-lg shadow-brand-500/20'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    ))}

                {/* Secondary Links */}
                {linkItems
                    .filter(item => item.variant !== 'primary')
                    .map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleLinkClick(item)}
                            className={cn(
                                'w-full flex items-center justify-between gap-3 px-6 py-4 rounded-xl',
                                'bg-white border-2 border-gray-200 text-gray-900 font-medium text-15',
                                'hover:border-brand-300 hover:bg-brand-50 active:scale-[0.98] transition-all duration-200',
                                'shadow-sm'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-gray-600">{item.icon}</div>
                                <span className="text-left">{item.label}</span>
                            </div>
                            {item.isExternal && <ArrowRight className="h-4 w-4 text-gray-400" />}
                        </button>
                    ))}

                {/* Trust & Social Proof */}
                {(provider.totalViews > 0 || provider.totalFollowers > 0) && (
                    <div className="bg-brand-50 rounded-xl p-4 mt-6 border border-brand-100">
                        <p className="text-14 text-gray-700 text-center">
                            {provider.totalViews > 0 && (
                                <>
                                    <span className="font-semibold text-brand-600">{provider.totalViews}</span> views
                                    {provider.totalFollowers > 0 && ' • '}
                                </>
                            )}
                            {provider.totalFollowers > 0 && (
                                <>
                                    <span className="font-semibold text-brand-600">{provider.totalFollowers}</span> followers
                                </>
                            )}
                        </p>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="pt-6 space-y-3">
                    <button
                        onClick={handleShare}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-14 hover:bg-gray-200 active:scale-[0.98] transition-all duration-200"
                    >
                        <Share2 className="h-4 w-4" />
                        Share Provider Page
                    </button>

                    <button
                        onClick={() => {
                            // TODO: Implement report provider functionality
                            if (window.confirm('Are you sure you want to report this provider?')) {
                                // Handle report action
                                console.log('Report provider:', providerId)
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 font-medium text-14 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
                    >
                        <AlertCircle className="h-4 w-4" />
                        Report Provider
                    </button>
                </div>

                {/* OurBride Branding */}
                <div className="pt-8 pb-6 text-center">
                    <p className="text-12 text-gray-400 mb-2">Powered by</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-16 font-bold text-brand-500">OurBride</span>
                        <span className="text-12 text-gray-400">• Wedding & Beauty Platform</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

