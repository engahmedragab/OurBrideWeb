'use client'

import { ReactNode } from 'react'
import { Header, Footer, UserSidebar } from './index'

export interface UserPageLayoutProps {
  children: ReactNode
  className?: string
}

export const UserPageLayout = ({
  children,
  className,
}: UserPageLayoutProps) => {
  return (
    <>
      <Header />
      <div
        className={`container-custom min-h-screen flex flex-col bg-gray-50 ${className || ''}`}
      >
        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="hidden lg:block py-6 pl-6">
            <UserSidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container-custom py-8">{children}</div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}
