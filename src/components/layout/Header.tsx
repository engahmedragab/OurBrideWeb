'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

import brandLogo from '@/assets/svg/Brand-logo.svg'

import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/NavigationMenu'

import { Menu, X, User } from 'lucide-react'

import {
  HomeIcon,
  ProductsIcon,
  ServicesIcon,
  CommunityIcon,
  WishlistIcon,
  ShoppingCartIcon,
  ProfileIconDesktop,
  ProfileIconMobile,
} from '@/assets/icons/navbar-icons'

import { useCart } from '@/hooks/cart'
import { NotificationDropdown } from '@/components/notifications'
import { useNotifications } from '@/hooks/notifications/useNotifications'
import { ClientOnly } from '@/components/ui/ClientOnly'

export interface HeaderProps {
  className?: string
}

export const Header = ({ className }: HeaderProps) => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { data: cartData } = useCart()
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isLoading: isLoadingNotifications,
  } = useNotifications()

  const cartCount = useMemo(
    () => cartData?.purchases?.length ?? 0,
    [cartData]
  )

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)

  const navigationItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Products', path: '/products', icon: ProductsIcon },
    { label: 'Services', path: '/services', icon: ServicesIcon },
    { label: 'Community', path: '/community', icon: CommunityIcon },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  return (
    <>
      {/* ================= Header ================= */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full bg-white/80 backdrop-blur',
          className
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-8 px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src={brandLogo}
              alt="OurBride"
              width={120}
              height={48}
              className="h-11 w-auto"
            />
          </Link>

          {/* Navigation */}
          <ClientOnly>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex h-11 items-center gap-1 rounded-full border border-gray-200 bg-white px-2 shadow-sm">
                {navigationItems.map(item => {
                  const Icon = item.icon
                  const active = isActive(item.path)

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                    >
                      <Icon
                        active={active}
                        className={cn(
                          'h-5 w-5',
                          active
                            ? 'text-[#F14937]'
                            : 'text-gray-500 hover:text-[#F14937]'
                        )}
                      />
                      <span
                        className={cn(
                          active
                            ? 'text-[#F14937]'
                            : 'text-gray-700 hover:text-[#F14937]'
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </ClientOnly>

          {/* Search */}
          <div className="hidden flex-1 max-w-[360px] lg:block">
            <SearchInput
              placeholder="Search"
              size="md"
              className="h-11 rounded-full"
            />
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-4 ">
            {/* Wishlist + Cart + Notifications */}
            <div className="flex items-center gap-4 rounded-full border border-brand-500/30 px-4 py-0.5">
              <Link href="/wishlist" className={[
                'relative p-1 md:p-2 ',
                isActive('/wishlist') ? 'bg-brand-500 rounded-full' : 'bg-transparent'
              ].join(' ')}>
                <WishlistIcon
                  active={isActive('/wishlist')}
                  className={cn(
                    'h-4 w-4',
                    isActive('/wishlist')
                      ? 'text-[#F14937]'
                      : 'text-brand-500 hover:text-[#F14937]'
                  )}
                />
              </Link>

              <Link href="/cart" className={[
                'relative p-1 md:p-2',
                isActive('/cart') ? 'bg-brand-500 rounded-full' : 'bg-transparent'
              ].join(' ')}>
                <ShoppingCartIcon
                  active={isActive('/cart')}
                  className={cn(
                    'h-4 w-4',
                    isActive('/cart')
                      ? 'text-white'
                      : 'text-brand-500 hover:text-[#F14937]'
                  )}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Notifications inside same wrapper */}
              <ClientOnly>
                <NotificationDropdown
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onMarkAllAsRead={markAllAsRead}
                  isLoading={isLoadingNotifications}
                />
              </ClientOnly>
            </div>

            {/* Profile (desktop) */}
            <Button
              asChild
              size="icon"
              className="hidden md:flex h-11 w-11 rounded-full"
            >
              <Link href="/profile">
               <ProfileIconDesktop active={isActive('/profile')} />
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
            
                <Menu className="h-6 w-6 text-brand-500" />
              
            </Button>
          </div>
        </div>
      </header>

      {/* ================= Mobile Drawer ================= */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transition-transform md:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >

       
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Image src={brandLogo} alt="OurBride" width={100} height={40} />
           
            
            <Button size="icon" variant="ghost" onClick={toggleMobileMenu}>
            <X className="h-5 w-5" />
          </Button>
         
          
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {navigationItems.map(item => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold',
                  active
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon active={active} className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}

          {/* Profile inside sidebar */}
          <Link
            href="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold',
              isActive('/profile')
                ? 'bg-brand-50 text-brand-600'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            <ProfileIconMobile active={isActive('/profile')} />
            Profile
          </Link>
        </nav>
      </div>
    </>
  )
}
