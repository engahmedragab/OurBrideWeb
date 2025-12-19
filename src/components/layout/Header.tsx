'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SearchInput } from '@/components/ui/SearchInput'
import brandLogo from '@/assets/svg/Brand-logo.svg'
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
  Menu,
  X,
  Search,
  ChevronRight,
} from 'lucide-react'

export interface HeaderProps {
  className?: string
}

export const Header = ({ className }: HeaderProps) => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  const navigationItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
    },
    {
      label: 'Products',
      path: '/products/intro',
      icon: Store,
      hasDropdown: true,
      dropdownItems: [
        { label: 'All Products', path: '/products' },
        { label: 'Category', path: '/products/category' },
      ],
    },
    {
      label: 'Services',
      path: '/services',
      icon: FileHeart,
      hasDropdown: true,
      dropdownItems: [
        { label: 'All Services', path: '/services' },
        { label: 'Category', path: '/services/category' },
      ],
    },
    {
      label: 'Community',
      path: '/community',
      icon: Globe,
    },
  ]

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm',
          'transition-shadow duration-200',
          'shadow-sm hover:shadow-md',
          className
        )}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'flex items-center gap-2 transition-opacity duration-150',
              'hover:opacity-80',
              'focus:outline-none rounded-md'
            )}
          >
            <Image
              src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src}
              alt="OurBride Logo"
              width={120}
              height={48}
              className="h-10 sm:h-12 w-auto"
            />
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
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'relative rounded-md border border-gray-200 md:hidden',
              'transition-colors duration-150',
              'hover:border-brand-300 hover:bg-brand-50/50',
              'focus:outline-none'
            )}
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-brand-500" />
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'relative rounded-md border border-gray-200 md:hidden',
              'transition-colors duration-150',
              'hover:border-brand-300 hover:bg-brand-50/50',
              'focus:outline-none'
            )}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-brand-500" />
          </Button>
          {/* Wishlist */}
          <Button
            asChild
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
            <Link href="/wishlist">
              <Heart className="h-5 w-5 text-brand-500" />
            </Link>
          </Button>

          {/* Cart */}
          <Button
            asChild
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
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-brand-500" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-10 font-semibold text-white shadow-sm">
                0
              </span>
            </Link>
          </Button>

          {/* User Profile */}
          <Button
            asChild
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
            <Link href="/profile">
              <User className="h-5 w-5 text-white" />
            </Link>
          </Button>
        </div>
      </div>
    </header>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white md:hidden">
          <div className="flex h-16 items-center gap-4 px-4 border-b border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </Button>
            <SearchInput
              placeholder="Search..."
              variant="default"
              size="md"
              className="flex-1 h-12 rounded-full"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-[70] w-80 bg-white shadow-xl md:hidden',
          'transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <Image
            src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src}
            alt="OurBride Logo"
            width={120}
            height={48}
            className="h-10 w-auto"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Drawer Navigation */}
        <nav className="flex flex-col p-4 space-y-2 overflow-y-auto flex-1">
          {/* Main Navigation Items */}
          {navigationItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.path)

            if (item.hasDropdown) {
              return (
                <div key={item.path} className="space-y-1">
                  <Link
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-4 py-3 text-16 font-semibold',
                      'transition-colors duration-150',
                      active
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Link>
                  <div className="ml-7 space-y-1">
                    {item.dropdownItems?.map(dropdownItem => {
                      const isDropdownActive = isActive(dropdownItem.path)
                      return (
                        <Link
                          key={dropdownItem.path}
                          href={dropdownItem.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-2 rounded-lg px-4 py-2 text-14 font-medium',
                            'transition-colors duration-150',
                            isDropdownActive
                              ? 'bg-brand-50 text-brand-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          )}
                        >
                          {dropdownItem.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-16 font-semibold',
                  'transition-colors duration-150',
                  active
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}

          {/* User Menu Section */}
          <div className="mt-auto pt-4 border-t border-gray-200 space-y-1">
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-16 font-semibold',
                'transition-colors duration-150',
                isActive('/wishlist')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <Heart className="h-5 w-5" />
              Wishlist
            </Link>

            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-16 font-semibold',
                'transition-colors duration-150',
                isActive('/cart')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="flex-1">My Cart</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-10 font-semibold text-white">
                0
              </span>
            </Link>

            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-16 font-semibold',
                'transition-colors duration-150',
                isActive('/profile')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <User className="h-5 w-5" />
              My Profile
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
