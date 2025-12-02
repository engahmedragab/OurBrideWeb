'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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
} from 'lucide-react'

export interface UserSidebarProps {
  className?: string
  userName?: string
  userImage?: string
}

export const UserSidebar = ({
  className,
  userName = 'Aya Mohamed',
  userImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
}: UserSidebarProps) => {
  const pathname = usePathname()

  const menuSections = [
    {
      items: [
        {
          label: 'Events',
          path: '/events',
          icon: Grid3x3,
        },
        {
          label: 'My Cart',
          path: '/cart',
          icon: ShoppingCart,
        },
        {
          label: 'Wishlist',
          path: '/wishlist',
          icon: Heart,
        },
        {
          label: 'Orders List',
          path: '/orders',
          icon: FileCheck,
        },
      ],
    },
    {
      items: [
        {
          label: 'Messages',
          path: '/messages',
          icon: Mail,
        },
        {
          label: 'Notifications',
          path: '/notifications',
          icon: Bell,
        },
        {
          label: 'Gift Center',
          path: '/gift-center',
          icon: Gift,
        },
        {
          label: 'Affiliate Program',
          path: '/affiliate',
          icon: Volume2,
        },
        {
          label: 'Referrals',
          path: '/referrals',
          icon: UserPlus,
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
          path: '/settings',
          icon: Settings,
        },
        {
          label: 'Help Center',
          path: '/help-center',
          icon: ThumbsUp,
        },
      ],
    },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <aside
      className={cn(
        'w-64 flex-shrink-0 bg-gray-50 py-6 px-4 space-y-4 overflow-y-auto',
        className
      )}
    >
      {/* User Profile Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={userImage}
            alt={userName}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
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
                  <li key={item.path}>
                    <Link
                      href={item.path}
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
                      <span>{item.label}</span>
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

