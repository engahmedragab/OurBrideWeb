'use client'

import { ReactNode } from 'react'
import { ProviderHeader } from './ProviderHeader'
import { Footer } from './Footer'

export interface ProviderPageLayoutProps {
  children: ReactNode
  className?: string
}

/**
 * ProviderPageLayout Component
 * Layout wrapper for provider profile pages with simplified header and no sidebar
 */
export const ProviderPageLayout = ({
  children,
  className,
}: ProviderPageLayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className || ''}`}>
      <ProviderHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container-custom py-8">{children}</div>
      </main>

      <Footer />
    </div>
  )
}
