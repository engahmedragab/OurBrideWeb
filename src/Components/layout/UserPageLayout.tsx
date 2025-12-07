'use client'

import { ReactNode, useState } from 'react'
import { Header, Footer, UserSidebar } from './index'
import { Menu, X } from 'lucide-react'
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
      <div className="flex-1 flex relative">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-brand-500 text-white shadow-lg flex items-center justify-center hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar Drawer */}
        <div
          className={cn(
            'fixed lg:static inset-y-0 left-0 z-50 lg:z-auto',
            'transition-transform duration-300 ease-in-out',
            'lg:translate-x-0 lg:block py-6 lg:pl-6',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          {/* Close Button (Mobile Only) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 z-10 p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
          <UserSidebar />
        </div>

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