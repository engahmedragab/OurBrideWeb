'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/cart'
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
  userName = 'Aya Mohamed',
  userImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  onLinkClick,
}: UserSidebarProps) => {
  const pathname = usePathname()

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
          label: 'Events',
          path: '/dashboard/my-events',
          icon: Grid3x3,
        },
        {
          label: 'My Cart',
          path: '/cart',
          icon: ShoppingCart,
        },
        {
          label: 'Reservations',
          path: '/reservations',
          icon: Calendar,
        },
        {
          label: 'Wishlist',
          path: '/wishlist',
          icon: Heart,
        },
        {
          label: 'Favorites',
          path: '/favorites',
          icon: Star,
        },
        {
          label: 'Follows',
          path: '/follows',
          icon: Users,
        },
        {
          label: 'Orders List',
          path: '/orders',
          icon: FileCheck,
        },
        {
          label: 'Delivery Address',
          path: '/addresses',
          icon: MapPin,
        },
      ],
    },
    {
      items: [
        {
          label: 'Messages',
          path: '/messages',
          icon: Mail,
          comingSoon: true,
        },
        {
          label: 'Notifications',
          path: '/notifications',
          icon: Bell,
        },
        {
          label: 'Gift Center',
          path: '/dashboard/gift-center',
          icon: Gift,
          comingSoon: true,
        },
        {
          label: 'Affiliate Program',
          path: '/affiliate',
          icon: Volume2,
          comingSoon: true,
        },
        {
          label: 'Referrals',
          path: '/referrals',
          icon: UserPlus,
          comingSoon: true,
        },
        {
          label: 'Coupons',
          path: '/coupons',
          icon: Ticket,
          comingSoon: true,
        },
      ],
    },
    {
      items: [
        {
          label: 'Profile',
          path: '/profile',
          icon: User,
        },
        {
          label: 'Settings',
          path: '/dashboard/settings',
          icon: Settings,
        },
        {
          label: 'Help Center',
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
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={userImage}
              alt={userName}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-12 text-gray-500 font-medium">Welcome Back</p>
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
                    {item.comingSoon && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-gray-200 text-8 font-medium text-brand-500 px-1 h-3.5 min-w-[28px]">
                        Coming Soon
                      </span>
                    )}
                    <Link
                      href={item.path}
                      onClick={onLinkClick}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-14 font-normal transition-all duration-150',
                        active
                          ? 'bg-red-500 text-white'
                          : 'text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 flex-shrink-0',
                          active ? 'text-white' : 'text-gray-900'
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
