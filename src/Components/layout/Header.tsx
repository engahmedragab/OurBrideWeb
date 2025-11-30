'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SearchInput } from '@/components/ui/SearchInput'
import logoImage from '@/assets/Logo.png'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/NavigationMenu'
import { Button } from '@/components/ui/Button'
import {
  Home,
  Store,
  FileHeart,
  Globe,
  Heart,
  ShoppingCart,
  User,
} from 'lucide-react'

export interface HeaderProps {
  className?: string
}

export const Header = ({ className }: HeaderProps) => {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  const navigationItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
    },
    {
      label: 'Products',
      path: '/products',
      icon: Store,
      hasDropdown: true,
      dropdownItems: [
        { label: 'All Products', path: '/products' },
        { label: 'Wedding Dresses', path: '/products/dresses' },
        { label: 'Accessories', path: '/products/accessories' },
      ],
    },
    {
      label: 'Services',
      path: '/services',
      icon: FileHeart,
      hasDropdown: true,
      dropdownItems: [
        { label: 'All Services', path: '/services' },
        { label: 'Planning', path: '/services/planning' },
        { label: 'Venues', path: '/services/venues' },
      ],
    },
    {
      label: 'Community',
      path: '/community',
      icon: Globe,
    },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm',
        'transition-shadow duration-200',
        'shadow-sm hover:shadow-md',
        className
      )}
    >
      <div className="container-custom flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2 transition-opacity duration-150',
            'hover:opacity-80',
            'focus:outline-none rounded-md'
          )}
        >
          <img src={typeof logoImage === 'string' ? logoImage : logoImage.src} alt="OurBride Logo" className="h-10 w-auto" />
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-0.5 rounded-full border border-gray-200 bg-white px-2 py-1.5 shadow-sm h-12">
            {navigationItems.map(item => {
              const Icon = item.icon
              const active = isActive(item.path)

              if (item.hasDropdown) {
                return (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuTrigger
                      className={cn(
                        'gap-2 rounded-md px-3 py-2 text-16 font-semibold transition-colors duration-150',
                        'hover:bg-brand-50/50 hover:text-brand-600',
                        'focus:outline-none',
                        active
                          ? 'bg-brand-50/70 text-brand-600'
                          : 'text-gray-700'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 transition-colors duration-150',
                          active
                            ? 'text-brand-600'
                            : 'text-gray-500 group-hover:text-brand-600'
                        )}
                      />
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-56 p-1.5 bg-white rounded-lg shadow-lg border border-gray-100">
                        {item.dropdownItems?.map(dropdownItem => {
                          const isDropdownActive = isActive(dropdownItem.path)
                          return (
                            <Link
                              key={dropdownItem.path}
                              href={dropdownItem.path}
                              className={cn(
                                'group relative flex items-center gap-3 rounded-md px-3 py-2 text-14 font-medium',
                                'transition-colors duration-150',
                                'hover:text-brand-600',
                                'focus:outline-none',
                                isDropdownActive
                                  ? 'text-brand-600 font-semibold'
                                  : 'text-gray-700 hover:text-brand-600'
                              )}
                            >
                              {isDropdownActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-600 rounded-r-full" />
                              )}
                              <span className="flex-1">
                                {dropdownItem.label}
                              </span>
                              {isDropdownActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              }

              return (
                <NavigationMenuItem key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      'group relative flex items-center gap-2 rounded-full px-3 py-2 text-16 font-semibold',
                      'transition-colors duration-150',
                      'hover:bg-brand-50/50 hover:text-brand-600',
                      'focus:outline-none',
                      active ? 'bg-brand-50/70 text-brand-600' : 'text-gray-700'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors duration-150',
                        active
                          ? 'text-brand-600'
                          : 'text-gray-500 group-hover:text-brand-600'
                      )}
                    />
                    {item.label}
                    {active && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand-600 rounded-full" />
                    )}
                  </Link>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar */}
        <div className="hidden flex-1 max-w-md lg:block">
          <SearchInput
            placeholder="Search..."
            variant="default"
            size="md"
            className={cn(
              'w-full h-12 rounded-full transition-all duration-200',
              'focus:border-brand-500',
              'hover:border-gray-300'
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'relative rounded-md border border-gray-200',
              'transition-colors duration-150',
              'hover:border-brand-300 hover:bg-brand-50/50',
              'focus:outline-none'
            )}
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5 text-brand-500" />
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'relative rounded-md border border-gray-200',
              'transition-colors duration-150',
              'hover:border-brand-300 hover:bg-brand-50/50',
              'focus:outline-none'
            )}
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5 text-brand-500" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-10 font-semibold text-white shadow-sm">
              0
            </span>
          </Button>

          {/* User Profile */}
          <Button
            variant="brand"
            size="icon"
            className={cn(
              'h-10 w-10 rounded-full',
              'transition-opacity duration-150',
              'hover:opacity-90',
              'focus:outline-none'
            )}
            aria-label="User Profile"
          >
            <User className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </header>
  )
}
