'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { SearchInput, LanguageSwitcher, Skeleton } from '@/components/ui'
import { useCart } from '@/hooks/cart'
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
  ChevronRight,
  Star,
  UserPlus,
  Building2,
  Bell,
  Search,
} from 'lucide-react'
import { NotificationDropdown } from '@/components/notifications'
import { useNotifications } from '@/hooks/notifications/useNotifications'
import { ClientOnly } from '@/components/ui/ClientOnly'
import { useI18nTranslations, useIsRTL } from '@/i18n'

export interface HeaderProps {
  className?: string
}

export const Header = ({ className }: HeaderProps) => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const t = useI18nTranslations('navbar')
  const isRTL = useIsRTL()

  // Track initial load completion
  useEffect(() => {
    setIsInitialLoad(false)
  }, [])

  // Fetch cart data
  const { data: cartData, isLoading: isLoadingCart } = useCart()

  // Fetch notifications
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isLoading: isLoadingNotifications,
  } = useNotifications()

  // Calculate cart count (number of unique items)
  const cartCount = useMemo(() => {
    if (!cartData) return 0
    // Count unique items (purchases array length)
    return cartData.purchases?.length || 0
  }, [cartData])

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  // More specific active check for dropdown items to avoid conflicts
  // This ensures only the most specific matching path is highlighted
  const isDropdownItemActive = (path: string, allDropdownPaths: Array<{ path: string }>) => {
    if (pathname === path) {
      return true
    }
    
    // Check if pathname starts with this dropdown item's path
    if (pathname.startsWith(path + '/')) {
      // Find if there's a more specific dropdown path that matches
      const moreSpecificMatch = allDropdownPaths.find(otherPath => {
        if (otherPath.path === path) return false // Skip self
        if (otherPath.path.length <= path.length) return false // Must be longer/more specific
        // Check if the other path starts with this path and the pathname matches that other path
        return otherPath.path.startsWith(path + '/') && 
               (pathname === otherPath.path || pathname.startsWith(otherPath.path + '/'))
      })
      
      // Only return true if there's no more specific match
      return !moreSpecificMatch
    }
    return false
  }

  // Check if parent menu item should be active (only if dropdown item is active)
  const isParentActive = (itemPath: string, dropdownItems: Array<{ path: string }>) => {
    // Check if any dropdown item is active
    return dropdownItems.some(dropdownItem => 
      isDropdownItemActive(dropdownItem.path, dropdownItems)
    )
  }

  const navigationItems = useMemo(() => {
    const items = [
    {
        label: t('links.home'),
      path: '/',
      icon: Home,
    },
    {
        label: t('links.products'),
      path: '/products/intro',
      icon: Store,
      hasDropdown: true,
      dropdownItems: [
          { label: t('links.allProducts'), path: '/products' },
          { label: t('links.category'), path: '/products/category' },
      ],
    },
    {
        label: t('links.services'),
      path: '/services',
      icon: FileHeart,
      hasDropdown: true,
      dropdownItems: [
          { label: t('links.allServices'), path: '/services' },
          { label: t('links.category'), path: '/services/category' },
      ],
    },
    {
        label: t('links.providers'),
      path: '/providers',
      icon: Building2,
    },
    {
        label: t('links.community'),
      path: '/community',
      icon: Globe,
    },
  ]

    // Reverse the array in RTL mode to maintain the same visual order
    return isRTL ? [...items].reverse() : items
  }, [t, isRTL])

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  return (
    <>
      <header
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          'sticky top-0 z-50 w-full bg-transparent backdrop-blur backdrop-blur-sm',
          // 'transition-shadow duration-200',
          // 'shadow-sm hover:shadow-md',
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
              className="h-14 sm:h-12 w-auto"
            />
          </Link>

          {/* Navigation Menu */}
          <ClientOnly>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-0.5 rounded-full border border-gray-100 bg-white px-2 py-1.5 shadow-sm h-12">
              {isInitialLoad ? (
                // Skeleton for navigation items during initial load
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-full px-3 py-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                ))
              ) : (
                navigationItems.map(item => {
                const Icon = item.icon
                // For dropdown items, check if any dropdown item is active instead of the parent path
                const active = item.hasDropdown 
                  ? isParentActive(item.path, item.dropdownItems || [])
                  : isActive(item.path)

                if (item.hasDropdown) {
                  return (
                    <NavigationMenuItem key={item.path}>
                      <NavigationMenuTrigger
                        className={cn(
                          'gap-2 rounded-md px-3 py-2 text-16 font-medium antialiased',
                          'transition-all duration-200 ease-in-out',
                          'hover:bg-brand-50/50 hover:text-brand-600',
                          'focus:outline-none',
                          active
                            ? 'bg-brand-50/70 text-brand-600'
                            : 'text-gray-600',
                          isRTL && 'flex-row-reverse'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-5 w-5 transition-all duration-200 ease-in-out',
                            'antialiased',
                            active
                              ? 'text-brand-600'
                              : 'text-gray-400 group-hover:text-brand-600'
                          )}
                        />
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div 
                          dir={isRTL ? 'rtl' : 'ltr'}
                          className="w-56 p-1.5 bg-white rounded-lg shadow-lg border border-gray-50"
                        >
                          {item.dropdownItems?.map(dropdownItem => {
                            const isDropdownActive = isDropdownItemActive(dropdownItem.path, item.dropdownItems || [])
                            return (
                              <Link
                                key={dropdownItem.path}
                                href={dropdownItem.path}
                                className={cn(
                                  'group relative flex items-center gap-3 rounded-md px-3 py-2 text-14 font-normal antialiased',
                                  'transition-all duration-200 ease-in-out',
                                  'hover:text-brand-600',
                                  'focus:outline-none',
                                  isDropdownActive
                                    ? 'text-brand-600 font-medium'
                                    : 'text-gray-600 hover:text-brand-600'
                                )}
                              >
                                {isDropdownActive && (
                                  <div className={cn(
                                    "absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-600",
                                    isRTL ? "right-0 rounded-l-full" : "left-0 rounded-r-full"
                                  )} />
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
                        'group relative flex items-center gap-2 rounded-full px-3 py-2 text-16 font-medium antialiased',
                        'transition-all duration-200 ease-in-out',
                        'hover:bg-brand-50/50 hover:text-brand-600',
                        'focus:outline-none',
                        active ? 'bg-brand-50/70 text-brand-600' : 'text-gray-600',
                        isRTL && 'flex-row-reverse'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 transition-all duration-200 ease-in-out',
                          'antialiased',
                          active
                            ? 'text-brand-600'
                            : 'text-gray-400 group-hover:text-brand-600'
                        )}
                      />
                      {item.label}
                      {active && (
                        <div className={cn(
                          "absolute bottom-0 w-6 h-0.5 bg-brand-600 rounded-full transition-all duration-200",
                          isRTL ? "right-1/2 translate-x-1/2" : "left-1/2 -translate-x-1/2"
                        )} />
                      )}
                    </Link>
                  </NavigationMenuItem>
                )
              }))}
              </NavigationMenuList>
            </NavigationMenu>
          </ClientOnly>

          {/* Search Bar */}
          <div className="hidden flex-1 max-w-md lg:block" dir={isRTL ? 'rtl' : 'ltr'}>
            {isInitialLoad ? (
              <Skeleton className="w-full h-12 rounded-full" />
            ) : (
              <SearchInput
                placeholder={t('search.placeholder')}
                variant="default"
                size="md"
                className={cn(
                  'w-full h-12 rounded-full transition-all duration-200',
                  'focus:border-brand-500',
                  'hover:border-gray-200'
                )}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'relative rounded-md border-0 md:hidden',
                'transition-all duration-200 ease-in-out',
                'hover:bg-brand-50/50',
                'focus:outline-none'
              )}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label={t('menu.openMenu')}
            >
              <Menu className="h-7 w-7 text-brand-500 transition-all duration-200 ease-in-out antialiased" />
            </Button>


            {/* Wishlist, Notifications, and Cart Group */}
            <div className="hidden md:flex items-center rounded-full border border-brand-500 bg-transparent px-1">
              {/* Wishlist */}
              <Button
                asChild
                variant="ghost"
                size="icon"
                className={cn(
                  'relative rounded-full border-0 bg-transparent',
                  'transition-all duration-200 ease-in-out',
                  'hover:bg-brand-50/50',
                  'focus:outline-none'
                )}
                aria-label="Wishlist"
              >
                <Link href="/wishlist">
                  <Heart className="h-5 w-5 text-brand-500 transition-all duration-200 ease-in-out antialiased" />
                </Link>
              </Button>

              {/* Notifications */}
              <ClientOnly>
                <NotificationDropdown
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onMarkAllAsRead={markAllAsRead}
                  isLoading={isLoadingNotifications}
                />
              </ClientOnly>

              {/* Cart */}
              {isLoadingCart ? (
                <div className="relative rounded-full border-0 bg-transparent h-10 w-10 flex items-center justify-center">
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'relative rounded-full border-0 bg-transparent',
                    'transition-all duration-200 ease-in-out',
                    'hover:bg-brand-50/50',
                    'focus:outline-none'
                  )}
                  aria-label={t('icons.cart')}
                >
                  <Link href="/cart" className="relative">
                    <ShoppingCart className="h-5 w-5 text-brand-500 transition-all duration-200 ease-in-out antialiased" />
                    {cartCount > 0 && (
                      <span className={cn(
                        "absolute -top-1 flex min-w-[16px] h-4 items-center justify-center rounded-full bg-brand-500 text-10 font-semibold text-white shadow-sm px-1",
                        isRTL ? "-left-1" : "-right-1"
                      )}>
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
              )}
            </div>

            {/* Language Switcher */}
            <ClientOnly>
              <div className="hidden md:flex items-center">
                <LanguageSwitcher variant="icon" />
              </div>
            </ClientOnly>

            {/* User Profile */}
            <Button
              asChild
              variant="brand"
              size="icon"
              className={cn(
                'hidden md:flex h-10 w-10 rounded-full',
                'transition-opacity duration-150',
                'hover:opacity-90',
                'focus:outline-none'
              )}
              aria-label={t('menu.myProfile')}
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
        <div 
          dir={isRTL ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-[60] bg-white md:hidden"
        >
          <div className={cn(
            "flex h-16 items-center gap-4 px-4 border-b border-gray-100",
            isRTL ? "flex-row-reverse" : ""
          )}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(false)}
              aria-label={t('menu.closeSearch')}
            >
              <X className="h-5 w-5 text-brand-500" />
            </Button>
            <div className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>
            <SearchInput
                placeholder={t('search.placeholder')}
              variant="default"
              size="md"
                className="w-full h-12 rounded-full"
              autoFocus
            />
            </div>
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
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          'fixed inset-y-0 z-[70] w-80 bg-white shadow-xl md:hidden flex flex-col',
          'transition-transform duration-300 ease-in-out',
          isRTL
            ? isMobileMenuOpen
              ? 'translate-x-0 right-0'
              : 'translate-x-full'
            : isMobileMenuOpen
              ? 'translate-x-0 left-0'
              : '-translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className={cn(
          "flex h-16 items-center justify-between px-4 border-b border-gray-100 flex-shrink-0",
          isRTL ? "flex-row-reverse" : ""
        )}>
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
            aria-label={t('menu.closeMenu')}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Drawer Navigation - Scrollable */}
        <nav className="flex flex-col flex-1 overflow-y-auto min-h-0">
          <div className="p-4 space-y-2">
            {/* Search Button - First Item */}
            <Button
              variant="ghost"
              onClick={() => {
                setIsMobileMenuOpen(false)
                setIsSearchOpen(true)
              }}
              className={cn(
                'w-full flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
                'transition-all duration-200 ease-in-out',
                'gap-3 justify-start',
                'text-gray-600 hover:bg-gray-50',
                isRTL && 'flex-row-reverse'
              )}
            >
              <Search className="h-5 w-5 flex-shrink-0" />
              <span className={cn('flex-1', isRTL ? 'text-right' : 'text-left')}>{t('search.placeholder')}</span>
            </Button>

            {/* Home - Second Item */}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
                'transition-all duration-200 ease-in-out',
                'gap-3',
                isActive('/')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50',
                isRTL && 'flex-row-reverse'
              )}
            >
              <Home className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
              <span className="flex-1">{t('links.home')}</span>
            </Link>

            {/* Main Navigation Items - Products, Services, Providers, Community */}
            {navigationItems.filter(item => item.path !== '/').map(item => {
            const Icon = item.icon
            // For dropdown items, check if any dropdown item is active instead of the parent path
            const active = item.hasDropdown 
              ? isParentActive(item.path, item.dropdownItems || [])
              : isActive(item.path)
              const isExpanded = expandedItems.has(item.path)

            if (item.hasDropdown) {
              return (
                <div key={item.path} className="space-y-1">
                    <div className="flex items-center">
                  <Link
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                          'flex items-center flex-1 rounded-lg px-4 py-3 text-16 font-medium antialiased',
                      'transition-all duration-200 ease-in-out',
                          'gap-3',
                      active
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-gray-600 hover:bg-gray-50',
                      isRTL && 'flex-row-reverse'
                    )}
                  >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1">{item.label}</span>
                  </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleExpanded(item.path)
                        }}
                        className={cn(
                          'h-10 w-10 rounded-lg',
                          'transition-all duration-200 ease-in-out',
                          'hover:bg-gray-100'
                        )}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <ChevronRight className={cn(
                          'h-4 w-4 flex-shrink-0 transition-transform duration-200',
                          isExpanded 
                            ? (isRTL ? '-rotate-90' : 'rotate-90')
                            : (isRTL ? 'rotate-180' : 'rotate-0')
                        )} />
                      </Button>
                    </div>
                    {isExpanded && (
                      <div className={cn('space-y-1', isRTL ? 'mr-7' : 'ml-7')}>
                    {item.dropdownItems?.map(dropdownItem => {
                      const isDropdownActive = isDropdownItemActive(dropdownItem.path, item.dropdownItems || [])
                      return (
                        <Link
                          key={dropdownItem.path}
                          href={dropdownItem.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                'flex items-center rounded-lg px-4 py-2 text-14 font-normal antialiased',
                            'transition-all duration-200 ease-in-out',
                                'gap-2',
                            isDropdownActive
                              ? 'bg-brand-50 text-brand-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          )}
                        >
                              <span className="flex-1">{dropdownItem.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                    )}
                </div>
              )
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                    'flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
                      'transition-all duration-200 ease-in-out',
                    'gap-3',
                      active
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-gray-600 hover:bg-gray-50',
                    isRTL && 'flex-row-reverse'
                    )}
                  >
                  <Icon className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
                  <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}

          </div>

          {/* User Menu Section */}
          <div className="mt-auto pt-4 border-t border-gray-100 space-y-1 px-4 pb-4">

            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                'flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
                  'transition-all duration-200 ease-in-out',
                'gap-3',
                isActive('/wishlist')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50'
                )}
              >
              <Heart className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
              <span className="flex-1">{t('menu.wishlist')}</span>
            </Link>

            <Link
              href="/favorites"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
                'transition-all duration-200 ease-in-out',
                'gap-3',
                isActive('/favorites')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Star className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
              <span className="flex-1">{t('menu.favorites')}</span>
            </Link>

            <Link
              href="/follows"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
                'transition-all duration-200 ease-in-out',
                'gap-3',
                isActive('/follows')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <UserPlus className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
              <span className="flex-1">{t('menu.follows')}</span>
            </Link>

            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
                'transition-all duration-200 ease-in-out',
                'gap-3',
                isActive('/cart')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <ShoppingCart className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
              <span className="flex-1">{t('menu.myCart')}</span>
              {cartCount > 0 && (
                <span className="flex min-w-[20px] h-5 items-center justify-center rounded-full bg-brand-500 text-10 font-semibold text-white px-1 ml-2">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Notifications in Mobile Menu */}
            <Link
              href="/notifications"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
                'transition-all duration-200 ease-in-out',
                'gap-3',
                isActive('/notifications')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Bell className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
              <span className="flex-1">{t('icons.notifications')}</span>
            </Link>

            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
                'transition-all duration-200 ease-in-out',
                'gap-3',
                isActive('/profile')
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <User className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
              <span className="flex-1">{t('menu.myProfile')}</span>
            </Link>

            {/* Language Switcher in Mobile Menu */}
            <ClientOnly>
              <div className="pt-4 border-t border-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="px-0 py-2">
                  <label className={cn(
                    "block text-14 font-normal text-gray-600 mb-2",
                    isRTL ? "text-right" : "text-left"
                  )}>
                    {t('icons.language')}
                  </label>
                  <LanguageSwitcher variant="dropdown" />
                </div>
              </div>
            </ClientOnly>
          </div>
        </nav>
      </div>
    </>
  )
}
