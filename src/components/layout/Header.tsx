'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { SearchInput, LanguageSwitcher } from '@/components/ui'
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
import { HeaderSkeleton } from '../ui/Skeleton'

export interface HeaderProps {
  className?: string
}

export const Header = ({ className }: HeaderProps) => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const t = useI18nTranslations('navbar')
  const isRTL = useIsRTL()

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

  /**
   * ✅ Show full header skeleton until the "first real data load" finishes.
   * - Prevents broken/mixed skeleton layout (like your screenshot).
   * - Also prevents quick flash: initial state depends on current loading flags.
   */
  const [hasLoadedOnce, setHasLoadedOnce] = useState(() => {
    return !isLoadingCart && !isLoadingNotifications
  })

  useEffect(() => {
    if (!hasLoadedOnce && !isLoadingCart && !isLoadingNotifications) {
      setHasLoadedOnce(true)
    }
  }, [hasLoadedOnce, isLoadingCart, isLoadingNotifications])

  const showHeaderSkeleton = !hasLoadedOnce

  // Calculate cart count (number of unique items)
  const cartCount = useMemo(() => {
    if (!cartData) return 0
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

  // ✅ Render full header skeleton (NOT partial) to avoid broken look
  if (showHeaderSkeleton) {
    return <HeaderSkeleton  className={className} isRTL={isRTL} />
  }

  return (
    <>
      <header
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          'sticky top-0 z-50 w-full bg-transparent  backdrop-blur-sm',
          // 'transition-shadow duration-200',
          // 'shadow-sm hover:shadow-md',
          className
        )}
      >
        <div className={cn("w-full px-4  lg:px-4 flex h-16 items-center justify-between gap-2 sm:gap-1 " ,
          isRTL ? 'md:px-3' : 'md:px-4'
        )}>
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0  md:w-[80px] lg:w-[100px] ">
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
              className="h-14 sm:h-14 w-auto"
            />
          </Link>
          </div>

          {/* Navigation Menu */}
          <ClientOnly>
          <NavigationMenu className="hidden md:flex">
  <NavigationMenuList
    className={cn(
      'gap-0.5 rounded-full border border-gray-100 bg-white shadow-sm',
      'lg:h-12 lg:px-1 lg:py-1.5',
      isRTL ? 'md:h-9 md:px-1 md:py-1.5' : 'md:h-14 md:px-2 md:py-2'
    )}
  >
    {navigationItems.map(item => {
      const Icon = item.icon
      const active = item.hasDropdown
        ? isParentActive(item.path, item.dropdownItems || [])
        : isActive(item.path)

      if (item.hasDropdown) {
        return (
          <NavigationMenuItem key={item.path}>
            <NavigationMenuTrigger
              className={cn(
                'rounded-md font-medium antialiased whitespace-nowrap',
                'transition-all duration-200 ease-in-out',
                'hover:bg-brand-50/50 hover:text-brand-600',
                'focus:outline-none',
                active ? 'bg-brand-50/70 text-brand-600' : 'text-gray-600',
                isRTL && 'flex-row-reverse',
                'lg:gap-2 lg:px-3 lg:py-2 lg:text-16',
                isRTL
                  ? 'md:gap-1 md:px-1.5 md:py-1.5 md:text-13'
                  : 'md:gap-2 md:px-2 md:py-2 md:text-14'
              )}
            >
              <Icon
                className={cn(
                  'transition-all duration-200 ease-in-out antialiased',
                  active
                    ? 'text-brand-600'
                    : 'text-gray-400 group-hover:text-brand-600',
                  'lg:h-5 lg:w-5',
                  isRTL ? 'md:h-4 md:w-4' : 'md:h-5 md:w-5'
                )}
              />
              {item.label}
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <div
                dir={isRTL ? 'rtl' : 'ltr'}
                className={cn(
                  'bg-white rounded-lg shadow-lg border border-gray-50',
                  'lg:w-56 lg:p-3',
                  isRTL ? 'md:w-52 md:p-2' : 'md:w-56 md:p-3'
                )}
              >
                {item.dropdownItems?.map(dropdownItem => {
                  const isDropdownActive = isDropdownItemActive(
                    dropdownItem.path,
                    item.dropdownItems || []
                  )

                  return (
                    <Link
                      key={dropdownItem.path}
                      href={dropdownItem.path}
                      className={cn(
                        'group relative flex items-center rounded-md font-normal antialiased',
                        'transition-all duration-200 ease-in-out',
                        'hover:text-brand-600',
                        'focus:outline-none',
                        isDropdownActive
                          ? 'text-brand-600 font-medium'
                          : 'text-gray-600 hover:text-brand-600',
                        'lg:gap-3 lg:px-3 lg:py-2 lg:text-14',
                        isRTL
                          ? 'md:gap-2 md:px-2.5 md:py-1.5 md:text-13'
                          : 'md:gap-3 md:px-3 md:py-2 md:text-14'
                      )}
                    >
                      {isDropdownActive && (
                        <div
                          className={cn(
                            'absolute top-1/2 -translate-y-1/2 bg-brand-600',
                            isRTL
                              ? 'right-0 rounded-l-full'
                              : 'left-0 rounded-r-full',
                            'lg:w-0.5 lg:h-5',
                            isRTL ? 'md:w-0.5 md:h-4' : 'md:w-0.5 md:h-5'
                          )}
                        />
                      )}

                      <span className="flex-1">{dropdownItem.label}</span>

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
              'group relative flex items-center rounded-full font-medium antialiased whitespace-nowrap',
              'transition-all duration-200 ease-in-out',
              'hover:bg-brand-50/50 hover:text-brand-600',
              'focus:outline-none',
              active ? 'bg-brand-50/70 text-brand-600' : 'text-gray-600',
              isRTL && 'flex-row-reverse',
              'lg:gap-2 lg:px-3 lg:py-2 lg:text-16',
              isRTL
                ? 'md:gap-1.5 md:px-1.5 md:py-1.5 md:text-12'
                : 'md:gap-2 md:px-2 md:py-2 md:text-14'
            )}
          >
            <Icon
              className={cn(
                'transition-all duration-200 ease-in-out antialiased',
                active
                  ? 'text-brand-600'
                  : 'text-gray-400 group-hover:text-brand-600',
                'lg:h-5 lg:w-5',
                isRTL ? 'md:h-3.5 md:w-3.5' : 'md:h-5 md:w-5'
              )}
            />
            {item.label}

            {active && (
              <div
                className={cn(
                  'absolute bg-brand-600 rounded-full transition-all duration-200',
                  isRTL
                    ? 'right-1/2 translate-x-1/2'
                    : 'left-1/2 -translate-x-1/2',
                  'lg:bottom-0 lg:w-6 lg:h-0.5',
                  isRTL ? 'md:bottom-0 md:w-4 md:h-0.5' : 'md:bottom-0 md:w-5 md:h-0.5'
                )}
              />
            )}
          </Link>
        </NavigationMenuItem>
      )
    })}
  </NavigationMenuList>
</NavigationMenu>


</ClientOnly>



          {/* Search Bar */}
          <div
            className="hidden flex-1 max-w-md lg:block"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
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
                    <span
                      className={cn(
                        'absolute -top-1 flex min-w-[16px] h-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-semibold text-white shadow-sm px-1',
                        isRTL ? '-left-1' : '-right-1'
                      )}
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </Button>
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
                'hidden md:flex md:h-8 md:w-8 h-10 w-10 rounded-full',
                'transition-opacity duration-150',
                'hover:opacity-90',
                'focus:outline-none'
              )}
              aria-label={t('menu.myProfile')}
            >
              <Link href="/profile">
                <User className="md:h-4 md:w-4 lg:h-5 lg:w-5 text-white" />
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
          <div
            className={cn(
              'flex h-16 items-center gap-4 px-4 border-b border-gray-100',
              isRTL ? 'flex-row-reverse' : ''
            )}
          >
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
        <div
          className={cn(
            'flex h-16 items-center justify-between px-4 border-b border-gray-100 flex-shrink-0',
            // isRTL ? 'flex-row' : 'flex-row-reverse'
          )}
        >
          <Image
            src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src}
            alt="OurBride Logo"
            width={120}
            height={48}
            className="h-14 sm:h-14 w-auto"
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
        'text-gray-600 hover:bg-gray-50',
        isRTL
          ? 'flex-row justify-start gap-2'
          : 'flex-row justify-start gap-3'
      )}
    >
      <Search className="h-5 w-5 flex-shrink-0" />
      <span className={cn(isRTL ? 'flex-none text-right' : 'flex-1 text-left')}>
        {t('search.placeholder')}
      </span>
    </Button>

    {/* Home - Second Item */}
    <Link
      href="/"
      onClick={() => setIsMobileMenuOpen(false)}
      className={cn(
        'w-full flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
        'transition-all duration-200 ease-in-out',
        isActive('/')
          ? 'bg-brand-50 text-brand-600'
          : 'text-gray-600 hover:bg-gray-50',
        isRTL
          ? 'flex-row justify-start gap-2'
          : 'flex-row justify-start gap-3'
      )}
    >
      <Home className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
      <span className={cn(isRTL ? 'flex-none text-right' : 'flex-1 text-left')}>
        {t('links.home')}
      </span>
    </Link>

    {/* Main Navigation Items */}
    {navigationItems
      .filter(item => item.path !== '/')
      .map(item => {
        const Icon = item.icon
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
                    'w-full flex items-center flex-1 rounded-lg px-4 py-3 text-16 font-medium antialiased',
                    'transition-all duration-200 ease-in-out',
                    active
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-gray-600 hover:bg-gray-50',
                    isRTL
                      ? 'flex-row justify-start gap-2'
                      : 'flex-row justify-start gap-3'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className={cn(isRTL ? 'flex-none text-right' : 'flex-1 text-left')}>
                    {item.label}
                  </span>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={e => {
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
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 flex-shrink-0 transition-transform duration-200',
                      isExpanded
                        ? isRTL
                          ? '-rotate-90'
                          : 'rotate-90'
                        : isRTL
                          ? 'rotate-180'
                          : 'rotate-0'
                    )}
                  />
                </Button>
              </div>

              {isExpanded && (
                <div className={cn('space-y-1', isRTL ? 'mr-7' : 'ml-7')}>
                  {item.dropdownItems?.map(dropdownItem => {
                    const isDropdownActive = isDropdownItemActive(
                      dropdownItem.path,
                      item.dropdownItems || []
                    )

                    return (
                      <Link
                        key={dropdownItem.path}
                        href={dropdownItem.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'w-full flex items-center rounded-lg px-4 py-2 text-14 font-normal antialiased',
                          'transition-all duration-200 ease-in-out',
                          isDropdownActive
                            ? 'bg-brand-50 text-brand-600'
                            : 'text-gray-600 hover:bg-gray-50',
                          isRTL ? 'justify-start text-right' : 'justify-start text-left'
                        )}
                      >
                        <span className={cn(isRTL ? 'flex-none' : 'flex-1')}>
                          {dropdownItem.label}
                        </span>
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
              'w-full flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
              'transition-all duration-200 ease-in-out',
              active
                ? 'bg-brand-50 text-brand-600'
                : 'text-gray-600 hover:bg-gray-50',
              isRTL
                ? 'flex-row justify-start gap-2'
                : 'flex-row justify-start gap-3'
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
            <span className={cn(isRTL ? 'flex-none text-right' : 'flex-1 text-left')}>
              {item.label}
            </span>
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
        'w-full flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
        'transition-all duration-200 ease-in-out',
        isActive('/wishlist')
          ? 'bg-brand-50 text-brand-600'
          : 'text-gray-600 hover:bg-gray-50',
        isRTL
            ? 'flex-row justify-start gap-2'
          : 'flex-row justify-start gap-3'
      )}
    >
      <Heart className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
      <span className={cn(isRTL ? 'flex-none text-right' : 'flex-1 text-left')}>
        {t('menu.wishlist')}
      </span>
    </Link>

    <Link
      href="/favorites"
      onClick={() => setIsMobileMenuOpen(false)}
      className={cn(
        'w-full flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
        'transition-all duration-200 ease-in-out',
        isActive('/favorites')
          ? 'bg-brand-50 text-brand-600'
          : 'text-gray-600 hover:bg-gray-50',
        isRTL
            ? 'flex-row justify-start gap-2'
          : 'flex-row justify-start gap-3'
      )}
    >
      <Star className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
      <span className={cn(isRTL ? 'flex-none text-right' : 'flex-1 text-left')}>
        {t('menu.favorites')}
      </span>
    </Link>

    <Link
      href="/follows"
      onClick={() => setIsMobileMenuOpen(false)}
      className={cn(
        'w-full flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
        'transition-all duration-200 ease-in-out',
        isActive('/follows')
          ? 'bg-brand-50 text-brand-600'
          : 'text-gray-600 hover:bg-gray-50',
        isRTL
            ? 'flex-row justify-start gap-2'
          : 'flex-row justify-start gap-3'
      )}
    >
      <UserPlus className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
      <span className={cn(isRTL ? 'flex-none text-right' : 'flex-1 text-left')}>
        {t('menu.follows')}
      </span>
    </Link>

    <Link
      href="/cart"
      onClick={() => setIsMobileMenuOpen(false)}
      className={cn(
        'w-full flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
        'transition-all duration-200 ease-in-out',
        isActive('/cart')
          ? 'bg-brand-50 text-brand-600'
          : 'text-gray-600 hover:bg-gray-50',
        isRTL
            ? 'flex-row justify-start gap-2'
          : 'flex-row justify-start gap-3'
      )}
    >
      <ShoppingCart className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
      <span className={cn(isRTL ? 'flex-none text-right' : 'flex-1 text-left')}>
        {t('menu.myCart')}
      </span>

      {cartCount > 0 && (
        <span
          className={cn(
            'flex min-w-[20px] h-5 items-center justify-center rounded-full bg-brand-500 text-10 font-semibold text-white px-1',
           
            isRTL ? 'mr-2' : 'ml-2'
          )}
        >
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>

    <Link
      href="/notifications"
      onClick={() => setIsMobileMenuOpen(false)}
      className={cn(
        'w-full flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
        'transition-all duration-200 ease-in-out',
        isActive('/notifications')
          ? 'bg-brand-50 text-brand-600'
          : 'text-gray-600 hover:bg-gray-50',
        isRTL
            ? 'flex-row justify-start gap-2'
          : 'flex-row justify-start gap-3'
      )}
    >
      <Bell className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
      <span className={cn(isRTL ? 'flex-none text-right' : 'flex-1 text-left')}>
        {t('icons.notifications')}
      </span>
    </Link>

    <Link
      href="/profile"
      onClick={() => setIsMobileMenuOpen(false)}
      className={cn(
        'w-full flex items-center rounded-lg px-4 py-3 text-16 font-medium antialiased',
        'transition-all duration-200 ease-in-out',
        isActive('/profile')
          ? 'bg-brand-50 text-brand-600'
          : 'text-gray-600 hover:bg-gray-50',
        isRTL
              ? 'flex-row justify-start gap-2'
          : 'flex-row justify-start gap-3'
      )}
    >
      <User className="h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out antialiased" />
      <span className={cn(isRTL ? 'flex-none text-right' : 'flex-1 text-left')}>
        {t('menu.myProfile')}
      </span>
    </Link>

    <ClientOnly>
      <div className="pt-4 border-t border-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="px-0 py-2">
          <label
            className={cn(
              'block text-14 font-normal text-gray-600 mb-2',
              isRTL ? 'text-right' : 'text-left'
            )}
          >
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
