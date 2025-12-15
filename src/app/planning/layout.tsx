'use client'

import Link from 'next/link'
import { Footer, Header } from '@/components/layout'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import {
  Home,
  ShoppingBag,
  Wallet,
  Calendar,
  Users,
  CheckSquare,
  FileHeart,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

const linksData = [
  { label: 'Items', href: '/planning/items', icon: ShoppingBag },
  { label: 'Budget', href: '/planning/budget', icon: Wallet },
  { label: 'Services', href: '/planning/services', icon: FileHeart },
  { label: 'Events', href: '/planning/events-itinerary', icon: Calendar },
  { label: 'Guests', href: '/planning/guests', icon: Users },
  { label: 'To Do', href: '/planning/todo', icon: CheckSquare },
]
export default function PlanningLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const activePath = usePathname() || '/'
  return (
    <div className="w-full min-h-screen flex flex-col bg-white overflow-x-hidden">
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <div className="w-full border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <NavigationMenu className="max-w-none items-start w-full justify-center">
              <NavigationMenuList className="flex my-3 sm:my-4 border border-gray-200 rounded-full justify-center gap-1 sm:gap-2 bg-white px-2 py-1.5 shadow-sm overflow-x-auto scrollbar-hide">
                {linksData.map(link => {
                  const Icon = link.icon
                  const isActive = activePath === link.href || activePath.startsWith(link.href + '/')

                  return (
                    <NavigationMenuItem key={link.href}>
                      <NavigationMenuLink
                        href={link.href}
                        className={cn(
                          'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-12 sm:text-14 md:text-16 font-normal rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0',
                          isActive
                            ? 'bg-brand-50 text-brand-500'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-brand-500'
                        )}
                        asChild
                      >
                        <Link href={link.href} className="flex items-center gap-1.5 sm:gap-2">
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" aria-hidden="true" />
                          <span className="whitespace-nowrap">{link.label}</span>
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="w-full">{children}</div>
      </div>
      <Footer />
    </div>
  )
}
