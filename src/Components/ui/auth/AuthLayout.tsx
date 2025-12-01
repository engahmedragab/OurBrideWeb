import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { WelcomeHeader } from './WelcomeHeader'

export interface AuthLayoutProps {
  children: ReactNode
  className?: string
  welcomeText?: string
  showWelcomeHeader?: boolean
}

/**
 * AuthLayout - Wrapper layout component for authentication pages
 * Displays welcome header and auth content
 */
export const AuthLayout = ({
  children,
  className,
  welcomeText = 'Welcome To OurBride',
  showWelcomeHeader = true,
}: AuthLayoutProps) => {
  return (
    <div
      className={cn(
        'flex min-h-screen w-full items-center justify-center bg-white p-3 sm:p-4 md:py-6 md:px-4',
        className
      )}
    >
      <div className="w-full max-w-[340px] sm:max-w-[360px] md:max-w-[380px] mx-auto space-y-1.5">
        {/* Welcome Header */}
        {showWelcomeHeader && <WelcomeHeader welcomeText={welcomeText} />}

        {/* Auth Content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}

