'use client'

import { ReactNode, useState } from 'react'
import { Header, Footer, UserSidebar } from './index'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface UserPageLayoutProps {
  children: ReactNode
  className?: string
}

export const UserPageLayout = ({
  children,
  className,
}: UserPageLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className || ''}`}>
      <Header />
      
      {/* Mobile Sidebar Toggle Button - Sticky below header */}
      <div className="lg:hidden  w-full top-16 z-30 bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
         <span className="flex ltr:justify-start ">Menu</span>
        <Button
          variant="ghost"
          onClick={() => setIsSidebarOpen(true)}
          className="w-fit gap-3 px-3 text-16 font-semibold text-gray-700 hover:bg-gray-50 flex-row"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-brand-500" />
         
        </Button>
      </div>

      <div className="flex-1 flex relative lg:gap-6">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-[60] transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <div
          className={cn(
            'lg:hidden fixed inset-y-0 z-[70] w-80 bg-white shadow-xl',
            'ltr:left-0 rtl:right-0',
            'transition-transform duration-300 ease-in-out',
            isSidebarOpen
              ? 'translate-x-0'
              : 'ltr:-translate-x-full rtl:translate-x-full'
          )}
        >
          {/* Drawer Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 bg-white ">
            <span className="text-18 font-semibold text-gray-900">Menu</span>
            <Button
              variant="ghost"
              size="icon"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Drawer Content */}
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            <UserSidebar onLinkClick={() => setIsSidebarOpen(false)} />
          </div>
        </div>

        {/* Desktop Sidebar */}

        <aside className="hidden lg:block lg:static lg:w-64 lg:flex-shrink-0 py-6 lg:ltr:pl-6 lg:rtl:pr-6">

        

          <UserSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container-custom py-4 sm:py-6 md:py-8 px-4 sm:px-6">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}