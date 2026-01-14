'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Typography } from '@/components/ui/Typography'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import AuthHeroCard from './AuthHeroCard'
import { DownloadApp } from '@/components/common'
import authHeroImage from '@/assets/images/authHero.jpg'
import { useIsRTL } from '@/i18n'
import { cn } from '@/lib'

interface HeroSectionData {
  backToHome: string
  title: string
  description: string
  heroCard: {
    title: string
    subtitle: string
  }
}

type AuthHeroSectionProps = {
  heroSectionData: HeroSectionData
}

export default function AuthHeroSection({ heroSectionData }: AuthHeroSectionProps) {
  const isRTL = useIsRTL()
  const BackIcon = isRTL ? ChevronRight : ChevronLeft

  return (
    <div className="relative w-full h-full max-w-4xl mx-auto overflow-hidden">
      {/* Background Image */}
      <Image
        src={authHeroImage}
        alt="Wedding background"
        fill
        className="object-cover"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/40 via-black/15 to-transparent" />

      {/* Back to Home Button */}
      <Link
        href="/"
        className={cn(
          'absolute -top-1 z-30 px-4 py-3 md:py-6 bg-white text-14 sm:text-16 font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 shadow-md',
          // RTL: يمين / LTR: شمال
          isRTL ? 'right-0 rounded-bl-3xl flex-row-reverse' : 'left-0 rounded-br-3xl'
        )}
      >
        {!isRTL && (
        <BackIcon className={cn("h-4 w-4 sm:h-5 sm:w-5",  'rotate-0')} />
        )}
        <span>{heroSectionData.backToHome}</span>
        {isRTL && (
        <BackIcon className={cn("h-4 w-4 sm:h-5 sm:w-5",  'rotate-0' )} />
        )}
      </Link>

      {/* Floating Hero Card */}
      <div
        className={cn(
          'absolute top-6 z-30 w-1/4 max-w-[12.5rem] min-w-[9.375rem]',
          // RTL: شمال / LTR: يمين
          isRTL ? 'left-10 lg:left-4' : 'right-10 lg:right-4'
        )}
      >
        <AuthHeroCard title={heroSectionData.heroCard.title} subtitle={heroSectionData.heroCard.subtitle} />
      </div>

      {/* Text Section */}
      <div
        className={cn(
          'absolute bottom-1/2 translate-y-full md:bottom-1/4 md:translate-y-0 z-30 max-w-[20rem] sm:max-w-[23.75rem]',
          // RTL: يمين / LTR: شمال
          isRTL ? 'right-6 lg:right-4 text-right' : 'left-6 lg:left-4 text-left'
        )}
      >
        <Typography
          variant="h1"
          className={cn("!text-white font-bold text-20 sm:text-24 mb-2 sm:mb-3 drop-shadow-lg", isRTL ? 'text-right' : 'text-left')}
        >
          {heroSectionData.title}
        </Typography>

        <Typography className="!text-white text-12 sm:text-14 opacity-90 drop-shadow-md leading-relaxed">
          {heroSectionData.description}
        </Typography>
      </div>

      {/* Download App */}
      <div
        className={cn(
          'absolute bottom-0 z-30',
          // RTL: شمال / LTR: يمين
          isRTL ? 'left-0' : 'right-0'
        )}
      >
        <DownloadApp
          variant="secondary"
          className={cn(
            'border-white bg-white',
            // rounded يتعكس
            isRTL ? 'rounded-tr-3xl rounded-tl-none' : 'rounded-tl-3xl rounded-tr-none'
          )}
        />
      </div>
    </div>
  )
}
