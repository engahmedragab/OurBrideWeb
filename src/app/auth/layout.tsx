import AuthHeroCard from '@/auth/components/AuthHeroCard'
import AuthHeroSection from '@/auth/components/AuthHeroSection'
import HeroSection from '@/auth/components/HeroSection'
import { DownloadApp } from '@/Components/common'
import { cn } from '@/lib/utils'

/**
 * AuthLayout component for authentication pages
 * Provides a two-column layout with HeroSection on the left and form content on the right
 * @param children - Child routes to render (Login, Register, etc.)
 * @returns {JSX.Element} Auth layout component
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex h-screen w-screen flex-col lg:flex-row justify-between py-6')}>
      {/* Left Section - HeroSection */}
      <div
        className={cn(
          'w-full h-full  lg:w-[45%] px-4',
          'order-1 lg:order-1'
        )}
      >
      <AuthHeroSection/>
      </div>

      {/* Right Section - Form Content */}
      <div
        className={cn(
          'w-full lg:w-[50%]',
          'flex flex-col',
          'bg-white',
          'order-2 lg:order-2'
        )}
      >
        {children}
      </div>
    </div>
  )
}
