'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    Calendar,
    MapPin,
    Star,
    CheckCircle2,
    MessageCircle,
    Instagram,
    Facebook,
    Globe,
    Camera,
    Package,
    MessageSquare,
    Share2,
    ArrowRight,
    Users,
    Eye,
} from 'lucide-react'
import { LoadingSpinner, ErrorDisplay } from '@/components/ui'
import { RatingDisplay } from '@/components/ui/RatingDisplay'
import { useProviderLinkee } from '@/hooks/providers/useProviderLinkee'
import { cn } from '@/lib/utils'
import type { LinkResponse } from '@/types/responses/link-response'
import type { MediaResponse } from '@/types/responses/media-response'

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

type TemplateType = 'classic' | 'modern' | 'elegant' | 'bold' | 'professional'

// Template 1: Classic/Minimal
const ClassicTemplate = ({ provider, linkItems, handleLinkClick }: { provider: ProviderData; linkItems: LinkItem[]; handleLinkClick: (item: LinkItem) => void }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-md mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    {provider.logo ? (
                        <div className="relative w-28 h-28 mb-4">
                            <Image
                                src={provider.logo}
                                alt={provider.name}
                                fill
                                className="rounded-full object-cover border-4 border-white shadow-lg"
                                sizes="112px"
                            />
                            {provider.isVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                                    <CheckCircle2 className="h-5 w-5 text-brand-500" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center !text-white text-36 font-normal mb-4 shadow-lg">
                            {provider.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <h1 className="text-28 font-normal text-gray-900 mb-2 text-center">{provider.name}</h1>
                    {provider.location && (
                        <div className="flex items-center gap-1 text-14 text-gray-600 mb-3">
                            <MapPin className="h-4 w-4" />
                            <span>{provider.location}</span>
                        </div>
                    )}
                    {provider.rating > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                            <RatingDisplay rating={provider.rating} size="sm" />
                        </div>
                    )}
                    {provider.description && (
                        <p className="text-14 text-gray-600 text-center max-w-sm mb-6">
                            {provider.description}
                        </p>
                    )}
                </div>

                {/* Links */}
                <div className="space-y-3">
                    {linkItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleLinkClick(item)}
                            className={cn(
                                'w-full flex items-center justify-between gap-3 px-6 py-4 rounded-xl',
                                item.variant === 'primary'
                                    ? 'bg-brand-500 !text-white font-seminormal text-16 hover:bg-brand-600 shadow-lg shadow-brand-500/20'
                                    : 'bg-white border-2 border-gray-200 text-gray-900 font-medium text-15 hover:border-brand-300 hover:bg-brand-50',
                                'active:scale-[0.98] transition-all duration-200 shadow-sm'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={item.variant === 'primary' ? '!text-white' : 'text-gray-600'}>
                                    {item.icon}
                                </div>
                                <span className="text-left">{item.label}</span>
                            </div>
                            <ArrowRight className={cn('h-5 w-5', item.variant === 'primary' ? '!text-white' : 'text-gray-400')} />
                        </button>
                    ))}
                </div>

                {/* Stats */}
                {(provider.totalViews > 0 || provider.totalFollowers > 0) && (
                    <div className="bg-white rounded-xl p-4 mt-6 border border-gray-200">
                        <div className="flex items-center justify-center gap-6 text-14 text-gray-600">
                            {provider.totalViews > 0 && (
                                <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span className="font-seminormal text-gray-900">{provider.totalViews}</span>
                                </div>
                            )}
                            {provider.totalFollowers > 0 && (
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span className="font-seminormal text-gray-900">{provider.totalFollowers}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Template 2: Modern/Gradient
const ModernTemplate = ({ provider, linkItems, handleLinkClick }: { provider: ProviderData; linkItems: LinkItem[]; handleLinkClick: (item: LinkItem) => void }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50">
            <div className="max-w-md mx-auto px-4 py-8">
                {/* Header with Gradient */}
                <div className="relative bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl p-8 mb-8 shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                    <div className="relative flex flex-col items-center">
                        {provider.logo ? (
                            <div className="relative w-32 h-32 mb-4">
                                <Image
                                    src={provider.logo}
                                    alt={provider.name}
                                    fill
                                    className="rounded-full object-cover border-4 border-white shadow-2xl"
                                    sizes="128px"
                                />
                                {provider.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-lg">
                                        <CheckCircle2 className="h-6 w-6 text-brand-500" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center !text-white text-40 font-normal mb-4 border-4 border-white shadow-2xl">
                                {provider.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h1 className="text-32 font-normal !text-white mb-2 text-center drop-shadow-lg">{provider.name}</h1>
                        {provider.location && (
                            <div className="flex items-center gap-1 text-16 !text-white/90 mb-3">
                                <MapPin className="h-4 w-4" />
                                <span>{provider.location}</span>
                            </div>
                        )}
                        {provider.rating > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <RatingDisplay rating={provider.rating} size="sm" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                {provider.description && (
                    <p className="text-15 text-gray-700 text-center mb-6 px-4">
                        {provider.description}
                    </p>
                )}

                {/* Links with Gradient Effects */}
                <div className="space-y-3">
                    {linkItems.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => handleLinkClick(item)}
                            className={cn(
                                'w-full flex items-center justify-between gap-3 px-6 py-4 rounded-2xl',
                                item.variant === 'primary'
                                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 !text-white font-seminormal text-16 shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40'
                                    : 'bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 text-gray-900 font-medium text-15 hover:border-brand-300 hover:bg-white hover:shadow-md',
                                'active:scale-[0.97] transition-all duration-200'
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    'p-2 rounded-xl',
                                    item.variant === 'primary' ? 'bg-white/20' : 'bg-brand-50'
                                )}>
                                    <div className={item.variant === 'primary' ? '!text-white' : 'text-brand-500'}>
                                        {item.icon}
                                    </div>
                                </div>
                                <span className="text-left">{item.label}</span>
                            </div>
                            <ArrowRight className={cn('h-5 w-5', item.variant === 'primary' ? '!text-white' : 'text-gray-400')} />
                        </button>
                    ))}
                </div>

                {/* Stats with Gradient */}
                {(provider.totalViews > 0 || provider.totalFollowers > 0) && (
                    <div className="bg-gradient-to-r from-brand-100 to-brand-50 rounded-2xl p-6 mt-8 border border-brand-200">
                        <div className="flex items-center justify-center gap-8 text-14 text-gray-700">
                            {provider.totalViews > 0 && (
                                <div className="flex flex-col items-center gap-1">
                                    <Eye className="h-5 w-5 text-brand-500" />
                                    <span className="font-normal text-18 text-gray-900">{provider.totalViews}</span>
                                    <span className="text-12 text-gray-600">Views</span>
                                </div>
                            )}
                            {provider.totalFollowers > 0 && (
                                <div className="flex flex-col items-center gap-1">
                                    <Users className="h-5 w-5 text-brand-500" />
                                    <span className="font-normal text-18 text-gray-900">{provider.totalFollowers}</span>
                                    <span className="text-12 text-gray-600">Followers</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Template 3: Elegant/Card
const ElegantTemplate = ({ provider, linkItems, handleLinkClick }: { provider: ProviderData; linkItems: LinkItem[]; handleLinkClick: (item: LinkItem) => void }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
            <div className="max-w-md mx-auto px-4 py-8">
                {/* Elegant Header Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100">
                    <div className="flex flex-col items-center">
                        {provider.logo ? (
                            <div className="relative w-28 h-28 mb-5">
                                <Image
                                    src={provider.logo}
                                    alt={provider.name}
                                    fill
                                    className="rounded-full object-cover border-4 border-gray-100 shadow-lg"
                                    sizes="112px"
                                />
                                {provider.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md">
                                        <CheckCircle2 className="h-5 w-5 text-brand-500" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-700 text-36 font-normal mb-5 shadow-lg">
                                {provider.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h1 className="text-28 font-normal text-gray-900 mb-2 text-center">{provider.name}</h1>
                        {provider.location && (
                            <div className="flex items-center gap-1 text-14 text-gray-600 mb-3">
                                <MapPin className="h-4 w-4" />
                                <span>{provider.location}</span>
                            </div>
                        )}
                        {provider.rating > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <RatingDisplay rating={provider.rating} size="sm" />
                            </div>
                        )}
                        {provider.description && (
                            <p className="text-14 text-gray-600 text-center max-w-sm leading-relaxed">
                                {provider.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Links as Cards */}
                <div className="space-y-3">
                    {linkItems.map(item => (
                        <div
                            key={item.id}
                            className={cn(
                                'bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border',
                                item.variant === 'primary' ? 'border-brand-200' : 'border-gray-100'
                            )}
                        >
                            <button
                                onClick={() => handleLinkClick(item)}
                                className={cn(
                                    'w-full flex items-center justify-between gap-3 px-6 py-5 rounded-2xl',
                                    item.variant === 'primary'
                                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 !text-white font-seminormal text-16'
                                        : 'text-gray-900 font-medium text-15 hover:bg-gray-50',
                                    'active:scale-[0.98] transition-all duration-200'
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        'p-2.5 rounded-xl',
                                        item.variant === 'primary' ? 'bg-white/20' : 'bg-gray-100'
                                    )}>
                                        <div className={item.variant === 'primary' ? '!text-white' : 'text-gray-700'}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <span className="text-left">{item.label}</span>
                                </div>
                                <ArrowRight className={cn('h-5 w-5', item.variant === 'primary' ? '!text-white' : 'text-gray-400')} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Stats Card */}
                {(provider.totalViews > 0 || provider.totalFollowers > 0) && (
                    <div className="bg-white rounded-2xl shadow-md p-6 mt-6 border border-gray-100">
                        <div className="flex items-center justify-center gap-8 text-14 text-gray-600">
                            {provider.totalViews > 0 && (
                                <div className="flex flex-col items-center gap-1">
                                    <Eye className="h-5 w-5 text-brand-500" />
                                    <span className="font-normal text-20 text-gray-900">{provider.totalViews}</span>
                                    <span className="text-12">Views</span>
                                </div>
                            )}
                            {provider.totalFollowers > 0 && (
                                <div className="flex flex-col items-center gap-1">
                                    <Users className="h-5 w-5 text-brand-500" />
                                    <span className="font-normal text-20 text-gray-900">{provider.totalFollowers}</span>
                                    <span className="text-12">Followers</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Template 4: Bold/Colorful
const BoldTemplate = ({ provider, linkItems, handleLinkClick }: { provider: ProviderData; linkItems: LinkItem[]; handleLinkClick: (item: LinkItem) => void }) => {
    const colors = [
        'from-brand-500 to-brand-600',
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-pink-500 to-pink-600',
        'from-orange-500 to-orange-600',
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-100 via-blue-50 to-purple-50">
            <div className="max-w-md mx-auto px-4 py-8">
                {/* Bold Header */}
                <div className="relative bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 rounded-3xl p-8 mb-8 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                    <div className="relative flex flex-col items-center">
                        {provider.logo ? (
                            <div className="relative w-32 h-32 mb-4">
                                <Image
                                    src={provider.logo}
                                    alt={provider.name}
                                    fill
                                    className="rounded-full object-cover border-4 border-white shadow-2xl"
                                    sizes="128px"
                                />
                                {provider.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1.5 shadow-lg">
                                        <CheckCircle2 className="h-6 w-6 !text-white" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center !text-white text-40 font-black mb-4 border-4 border-white shadow-2xl">
                                {provider.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h1 className="text-32 font-black !text-white mb-2 text-center drop-shadow-lg">{provider.name}</h1>
                        {provider.location && (
                            <div className="flex items-center gap-1 text-16 !text-white/95 mb-3 font-medium">
                                <MapPin className="h-4 w-4" />
                                <span>{provider.location}</span>
                            </div>
                        )}
                        {provider.rating > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <RatingDisplay rating={provider.rating} size="sm" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                {provider.description && (
                    <p className="text-15 text-gray-800 text-center mb-6 px-4 font-medium">
                        {provider.description}
                    </p>
                )}

                {/* Colorful Links */}
                <div className="space-y-3">
                    {linkItems.map((item, index) => {
                        const colorClass = item.variant === 'primary' 
                            ? 'from-brand-500 to-brand-600' 
                            : colors[index % colors.length]
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleLinkClick(item)}
                                className={cn(
                                    'w-full flex items-center justify-between gap-3 px-6 py-5 rounded-2xl',
                                    `bg-gradient-to-r ${colorClass} !text-white font-normal text-16`,
                                    'shadow-lg hover:shadow-2xl active:scale-[0.97] transition-all duration-200',
                                    'transform hover:scale-[1.02]'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/20">
                                        <div className="!text-white">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <span className="text-left">{item.label}</span>
                                </div>
                                <ArrowRight className="h-5 w-5 !text-white" />
                            </button>
                        )
                    })}
                </div>

                {/* Stats with Colorful Design */}
                {(provider.totalViews > 0 || provider.totalFollowers > 0) && (
                    <div className="bg-gradient-to-r from-brand-500 to-blue-500 rounded-2xl p-6 mt-8 shadow-xl">
                        <div className="flex items-center justify-center gap-8 !text-white">
                            {provider.totalViews > 0 && (
                                <div className="flex flex-col items-center gap-1">
                                    <Eye className="h-6 w-6" />
                                    <span className="font-black text-24">{provider.totalViews}</span>
                                    <span className="text-13 font-medium">Views</span>
                                </div>
                            )}
                            {provider.totalFollowers > 0 && (
                                <div className="flex flex-col items-center gap-1">
                                    <Users className="h-6 w-6" />
                                    <span className="font-black text-24">{provider.totalFollowers}</span>
                                    <span className="text-13 font-medium">Followers</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Template 5: Professional/Business
const ProfessionalTemplate = ({ provider, linkItems, handleLinkClick }: { provider: ProviderData; linkItems: LinkItem[]; handleLinkClick: (item: LinkItem) => void }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-md mx-auto px-4 py-8">
                {/* Professional Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-l-4 border-brand-500">
                    <div className="flex flex-col items-center">
                        {provider.logo ? (
                            <div className="relative w-24 h-24 mb-4">
                                <Image
                                    src={provider.logo}
                                    alt={provider.name}
                                    fill
                                    className="rounded-lg object-cover border-2 border-gray-200 shadow-md"
                                    sizes="96px"
                                />
                                {provider.isVerified && (
                                    <div className="absolute -top-1 -right-1 bg-brand-500 rounded-full p-1 shadow-md">
                                        <CheckCircle2 className="h-4 w-4 !text-white" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-700 text-32 font-normal mb-4 border-2 border-gray-300">
                                {provider.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h1 className="text-26 font-normal text-gray-900 mb-2 text-center">{provider.name}</h1>
                        {provider.location && (
                            <div className="flex items-center gap-1 text-13 text-gray-600 mb-3">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{provider.location}</span>
                            </div>
                        )}
                        {provider.rating > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <RatingDisplay rating={provider.rating} size="sm" />
                            </div>
                        )}
                        {provider.description && (
                            <p className="text-13 text-gray-600 text-center max-w-sm leading-relaxed">
                                {provider.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Professional Links */}
                <div className="space-y-2">
                    {linkItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleLinkClick(item)}
                            className={cn(
                                'w-full flex items-center justify-between gap-3 px-5 py-4 rounded-lg',
                                item.variant === 'primary'
                                    ? 'bg-brand-500 !text-white font-seminormal text-15 shadow-md hover:bg-brand-600'
                                    : 'bg-white border border-gray-300 text-gray-900 font-medium text-14 hover:border-brand-400 hover:bg-gray-50',
                                'active:scale-[0.99] transition-all duration-200 shadow-sm'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    'p-1.5 rounded',
                                    item.variant === 'primary' ? 'bg-white/20' : 'bg-gray-100'
                                )}>
                                    <div className={cn(
                                        item.variant === 'primary' ? '!text-white' : 'text-gray-700',
                                        'h-4 w-4'
                                    )}>
                                        {item.icon}
                                    </div>
                                </div>
                                <span className="text-left">{item.label}</span>
                            </div>
                            <ArrowRight className={cn('h-4 w-4', item.variant === 'primary' ? '!text-white' : 'text-gray-400')} />
                        </button>
                    ))}
                </div>

                {/* Professional Stats */}
                {(provider.totalViews > 0 || provider.totalFollowers > 0) && (
                    <div className="bg-white rounded-lg shadow-md p-5 mt-6 border border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            {provider.totalViews > 0 && (
                                <div className="border-r border-gray-200 pr-4">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Eye className="h-4 w-4 text-brand-500" />
                                        <span className="font-normal text-18 text-gray-900">{provider.totalViews}</span>
                                    </div>
                                    <span className="text-12 text-gray-600">Total Views</span>
                                </div>
                            )}
                            {provider.totalFollowers > 0 && (
                                <div className="pl-4">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Users className="h-4 w-4 text-brand-500" />
                                        <span className="font-normal text-18 text-gray-900">{provider.totalFollowers}</span>
                                    </div>
                                    <span className="text-12 text-gray-600">Followers</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export function ProviderLinksClient({ providerId }: ProviderLinksClientProps) {
    const router = useRouter()
    const [activeTemplate, setActiveTemplate] = useState<TemplateType>('classic')
    const { data: linkeeData, isLoading, error } = useProviderLinkee(providerId)

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
                await navigator.clipboard.writeText(window.location.href)
                alert('Link copied to clipboard!')
            }
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                } catch (clipboardError) {
                    console.error('Failed to copy to clipboard:', clipboardError)
                }
            }
        }
    }

    const templates = [
        { id: 'classic' as TemplateType, name: 'Classic' },
        { id: 'modern' as TemplateType, name: 'Modern' },
        { id: 'elegant' as TemplateType, name: 'Elegant' },
        { id: 'bold' as TemplateType, name: 'Bold' },
        { id: 'professional' as TemplateType, name: 'Professional' },
    ]

    const renderTemplate = () => {
        switch (activeTemplate) {
            case 'classic':
                return <ClassicTemplate provider={provider} linkItems={linkItems} handleLinkClick={handleLinkClick} />
            case 'modern':
                return <ModernTemplate provider={provider} linkItems={linkItems} handleLinkClick={handleLinkClick} />
            case 'elegant':
                return <ElegantTemplate provider={provider} linkItems={linkItems} handleLinkClick={handleLinkClick} />
            case 'bold':
                return <BoldTemplate provider={provider} linkItems={linkItems} handleLinkClick={handleLinkClick} />
            case 'professional':
                return <ProfessionalTemplate provider={provider} linkItems={linkItems} handleLinkClick={handleLinkClick} />
            default:
                return <ClassicTemplate provider={provider} linkItems={linkItems} handleLinkClick={handleLinkClick} />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Template Tabs */}
            <div className="pt-4 sm:pt-6 -mx-4 sm:mx-0">
                <div className="border-b border-gray-200">
                    <nav className="flex w-full">
                        {templates.map(template => (
                            <button
                                key={template.id}
                                onClick={() => setActiveTemplate(template.id)}
                                className={cn(
                                    'flex-1 pb-3 sm:pb-4 px-1 text-13 sm:text-14 font-medium transition-colors relative whitespace-nowrap',
                                    activeTemplate === template.id
                                        ? 'text-gray-900'
                                        : 'text-gray-500'
                                )}
                            >
                                {template.name}
                                {activeTemplate === template.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Template Content */}
            <div className="relative">
                {renderTemplate()}
            </div>

            {/* Footer Actions */}
            <div className="max-w-md mx-auto px-4 py-6 space-y-3">
                <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-14 hover:bg-gray-200 active:scale-[0.98] transition-all duration-200"
                >
                    <Share2 className="h-4 w-4" />
                    Share Provider Page
                </button>

                <div className="pt-4 text-center">
                    <p className="text-12 text-gray-400 mb-1">Powered by</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-16 font-normal text-brand-500">OurBride</span>
                        <span className="text-12 text-gray-400">• Wedding & Beauty Platform</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
