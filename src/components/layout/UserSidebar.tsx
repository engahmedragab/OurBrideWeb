'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/cart'
import { useAuth } from '@/auth'
import { useMineInfo } from '@/hooks/home'
import { useI18nTranslations } from '@/i18n'
import {
  Grid3x3,
  ShoppingCart,
  Heart,
  FileCheck,
  Mail,
  Bell,
  Gift,
  Volume2,
  UserPlus,
  User,
  Settings,
  ThumbsUp,
  Star,
  Users,
  MapPin,
  Ticket,
  Calendar,
} from 'lucide-react'

export interface UserSidebarProps {
  className?: string
  userName?: string
  userImage?: string
  onLinkClick?: () => void
}

export const UserSidebar = ({
  className,
  userName: propUserName,
  userImage: propUserImage,
  onLinkClick,
}: UserSidebarProps) => {
  const pathname = usePathname()
  const { user: authUser } = useAuth()
  const { data: mineInfo } = useMineInfo()
  const t = useI18nTranslations('userSidebar')

  // Extract user data from mineInfo (fallback to authUser)
  // Handle different response structures: mineInfo.data.userProfile.user or mineInfo.userProfile.user
  const mineInfoAny = mineInfo as unknown as Record<string, unknown>
  const data: Record<string, unknown> = (mineInfoAny?.data as Record<string, unknown>) || mineInfoAny || {}
  const userProfile: Record<string, unknown> = (data?.userProfile as Record<string, unknown>) || {}
  const userData = (userProfile?.user || authUser) as Record<string, unknown> | null | undefined

  // Get user name - prioritize prop, then API data, then fallback
  const userName = useMemo(() => {
    if (propUserName) return propUserName
    if (userData) {
      const firstName = typeof userData.firstName === 'string' ? userData.firstName : undefined
      const lastName = typeof userData.lastName === 'string' ? userData.lastName : undefined
      if (firstName && lastName) {
        return `${firstName} ${lastName}`
      }
      if (typeof userData.fullName === 'string') return userData.fullName
      if (typeof userData.userName === 'string') return userData.userName
      if (typeof userData.email === 'string') return userData.email
    }
    return 'User'
  }, [propUserName, userData])

  // Get user image - prioritize prop, then API data, then fallback
  const userImage = useMemo(() => {
    if (propUserImage) return propUserImage
    if (userData && typeof userData.profileUrl === 'string') return userData.profileUrl
    return 'https://via.placeholder.com/100'
  }, [propUserImage, userData])

  // Fetch cart data
  const { data: cartData } = useCart()

  // Calculate cart count (number of unique items)
  const cartCount = useMemo(() => {
    if (!cartData) return 0
    // Count unique items (purchases array length)
    return cartData.purchases?.length || 0
  }, [cartData])

  type MenuItem = {
    label: string
    path: string
    icon: React.ComponentType<{ className?: string }>
    comingSoon?: boolean
  }

  const menuSections: Array<{ items: MenuItem[] }> = [
    {
      items: [
        {
          label: t('menuItems.events'),
          path: '/dashboard/my-events',
          icon: Grid3x3,
        },
        {
          label: t('menuItems.myCart'),
          path: '/cart',
          icon: ShoppingCart,
        },
        {
          label: t('menuItems.reservations'),
          path: '/reservations',
          icon: Calendar,
          comingSoon: true,
        },
        {
          label: t('menuItems.wishlist'),
          path: '/wishlist',
          icon: Heart,
        },
        {
          label: t('menuItems.favorites'),
          path: '/favorites',
          icon: Star,
        },
        {
          label: t('menuItems.follows'),
          path: '/follows',
          icon: Users,
        },
        {
          label: t('menuItems.ordersList'),
          path: '/orders',
          icon: FileCheck,
        },
        {
          label: t('menuItems.deliveryAddress'),
          path: '/addresses',
          icon: MapPin,
        },
      ],
    },
    {
      items: [
        {
          label: t('menuItems.messages'),
          path: '/messages',
          icon: Mail,
          comingSoon: true,
        },
        {
          label: t('menuItems.notifications'),
          path: '/notifications',
          icon: Bell,
        },
        {
          label: t('menuItems.giftCenter'),
          path: '/dashboard/gift-center',
          icon: Gift,
          comingSoon: true,
        },
        {
          label: t('menuItems.affiliateProgram'),
          path: '/affiliate',
          icon: Volume2,
          comingSoon: true,
        },
        {
          label: t('menuItems.referrals'),
          path: '/referrals',
          icon: UserPlus,
          comingSoon: true,
        },
        {
          label: t('menuItems.coupons'),
          path: '/coupons',
          icon: Ticket,
          comingSoon: true,
        },
      ],
    },
    {
      items: [
        {
          label: t('menuItems.profile'),
          path: '/profile',
          icon: User,
        },
        {
          label: t('menuItems.settings'),
          path: '/dashboard/settings',
          icon: Settings,
        },
        {
          label: t('menuItems.helpCenter'),
          path: '/dashboard/help-center',
          icon: ThumbsUp,
        },
      ],
    },
  ]

  const isActive = (path: string) => {
    if (!pathname) return false
    // Special handling for Settings - should be active for /dashboard/settings and all sub-pages
    if (path === '/dashboard/settings') {
      return pathname === '/dashboard/settings' || pathname.startsWith('/dashboard/settings/')
    }
    // Special handling for Help Center
    if (path === '/dashboard/help-center') {
      return pathname === '/dashboard/help-center' || pathname.startsWith('/dashboard/help-center/')
    }
    // Special handling for Gift Center
    if (path === '/dashboard/gift-center') {
      return pathname === '/dashboard/gift-center' || pathname.startsWith('/dashboard/gift-center/')
    }
    // Special handling for Coupons
    if (path === '/coupons') {
      return pathname === '/coupons'
    }
    // Special handling for Events - should be active for /dashboard/my-events and all sub-pages
    if (path === '/dashboard/my-events') {
      return pathname === '/dashboard/my-events' || pathname.startsWith('/dashboard/my-events/')
    }
    // Special handling for Delivery Address
    if (path === '/addresses') {
      return pathname === '/addresses' || pathname.startsWith('/addresses/')
    }
    return pathname === path
  }

  return (
    <aside
      className={cn(
        'w-full lg:w-64 flex-shrink-0 bg-gray-50 lg:bg-gray-50 py-4 lg:py-6 px-4 space-y-4',
        className
      )}
    >
      {/* User Profile Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
            {userImage && userImage !== 'https://via.placeholder.com/100' ? (
              <Image
                src={userImage}
                alt={userName}
                fill
                sizes="48px"
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}
            {(!userImage || userImage === 'https://via.placeholder.com/100') && (
              <div className="w-full h-full flex items-center justify-center bg-brand-100">
                <span className="text-14 font-semibold text-brand-600">
                  {userName.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-12 text-gray-500 font-medium">{t('welcomeBack')}</p>
            <p className="text-16 font-semibold text-gray-900 truncate">
              {userName}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu Cards */}
      {menuSections.map((section, sectionIndex) => {
        return (
          <div
            key={sectionIndex}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            {/* Menu Items */}
            <ul className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon
                const active = isActive(item.path)

                return (
                  <li key={item.path} className="relative">
                    {item.comingSoon ? (
                      <div
                        className={cn(
                          'relative flex items-center gap-2 pl-4 pr-2 py-2.5 rounded-lg text-14 font-normal cursor-not-allowed opacity-60',
                          'text-gray-500 overflow-hidden'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                        <span className="flex-1 min-w-0 truncate">{item.label}</span>
                        <span className="flex items-center justify-center rounded-full bg-gray-200 text-10 font-medium text-brand-500 px-2 h-5 whitespace-nowrap flex-shrink-0">
                          {t('comingSoon')}
                        </span>
                      </div>
                    ) : (
                      <Link
                        href={item.path}
                        onClick={onLinkClick}
                        aria-current={active ? 'page' : undefined}
                        data-active={active ? 'true' : undefined}
                        className={cn(
                          'relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-14 font-normal transition-all duration-150',
                          active
                            ? 'text-brand-500'
                            : 'text-gray-900 hover:bg-gray-50'
                        )}
                      >
                        {/* Red vertical indicator for active item - positioned on left edge */}
                        {active && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-full" />
                        )}
                        <Icon
                          className={cn(
                            'h-5 w-5 flex-shrink-0',
                            active ? 'text-brand-500' : 'text-gray-900'
                          )}
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.path === '/cart' && cartCount > 0 && (
                          <span
                            className={cn(
                              'flex min-w-[20px] h-5 items-center justify-center rounded-full bg-brand-500 text-10 font-semibold text-white px-1',
                              active && 'bg-white text-brand-500'
                            )}
                          >
                            {cartCount > 99 ? '99+' : cartCount}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </aside>
  )
}
