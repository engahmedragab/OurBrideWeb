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
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="w-full border-b border-gray-200 bg-white">
          <div className="container-custom">
            <NavigationMenu className="max-w-none items-start w-full justify-center">
              <NavigationMenuList className="flex my-4 border border-gray-200 rounded-full justify-center gap-2 bg-white px-2 py-1.5 shadow-sm">
                {linksData.map(link => {
                  const Icon = link.icon
                  const isActive = activePath === link.href || activePath.startsWith(link.href + '/')

                  return (
                    <NavigationMenuItem key={link.href}>
                      <NavigationMenuLink
                        href={link.href}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 text-14 md:text-16 font-normal rounded-full transition-all duration-200',
                          isActive
                            ? 'bg-brand-50 text-brand-500'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-brand-500'
                        )}
                        asChild
                      >
                        <Link href={link.href} className="flex items-center gap-2">
                          <Icon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="container-custom py-6 md:py-8">{children}</div>
      </div>
      <Footer />
    </div>
  )
}
