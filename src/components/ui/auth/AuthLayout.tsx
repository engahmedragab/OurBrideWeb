'use client'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { WelcomeHeader } from './WelcomeHeader'
import { useI18nTranslations } from '@/i18n'

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
  welcomeText = 'welcomeHeader.defaultWelcome',
  showWelcomeHeader = true,
}: AuthLayoutProps) => {
  const t = useI18nTranslations('auth')
  return (
    <div
      className={cn(
        'flex min-h-screen w-full items-center justify-center bg-white p-3 sm:p-4 md:py-6 md:px-4',
        className
      )}
    >
      <div className="w-full max-w-[328px] sm:max-w-[360px] md:max-w-[380px] mx-auto space-y-3">
        {/* Welcome Header */}
        {showWelcomeHeader && <WelcomeHeader welcomeText={t(welcomeText)} />}

        {/* Auth Content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}
