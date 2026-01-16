'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

import brandLogo from '@/assets/svg/Brand-logo.svg'
import { Typography } from '@/components/ui/Typography'
import { useI18nTranslations } from '@/i18n'

export interface WelcomeHeaderProps {
  welcomeText?: string
  className?: string
}

/**
 * WelcomeHeader - Reusable component for welcome message with logo
 * Displays logo, welcome text, and underline
 */
export const WelcomeHeader = ({
  welcomeText ,
  className,
}: WelcomeHeaderProps) => {
  const t = useI18nTranslations('auth')
  return (
    <div className={cn('flex flex-col items-center space-y-1.5', className)}>
      {/* Logo */}
      <div className="flex items-center justify-center">
        <Image
          src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src}
          alt="OurBride Logo"
          width={120}
          height={48}
          className="h-10 w-auto sm:h-12"
        />
      </div>

      {/* Welcome Text */}
      <div className="flex flex-col items-center space-y-1">
        <Typography
          variant="h6"
          weight="semibold"
          textColor="default"
          align="center"
          className="text-gray-900 text-16 font-semibold"
        >
          {welcomeText}
        </Typography>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-28 bg-brand-500 rounded-full" />
          <div className="h-0.5 w-4 bg-brand-500 rounded-full" />
        </div>
      </div>
    </div>
  )
}
