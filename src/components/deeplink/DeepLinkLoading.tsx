'use client'

import Image from 'next/image'
import { Loader2, Heart } from 'lucide-react'
import brandLogo from '@/assets/svg/Brand-logo.svg'

export function DeepLinkLoading() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background gradient with brand colors */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(241,72,54,0.15)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(241,72,54,0.1)_0%,transparent_50%)]" />

      {/* Floating particles with brand colors */}
      <div className="absolute inset-0">
        <div className="deeplink-particle absolute right-[15%] top-[15%] h-[120px] w-[120px] rounded-full bg-gradient-to-br from-brand-500/30 to-brand-500/10" />
        <div className="deeplink-particle absolute left-[10%] top-[60%] h-[80px] w-[80px] rounded-full bg-gradient-to-br from-brand-500/30 to-brand-500/10 [animation-delay:2s]" />
        <div className="deeplink-particle absolute bottom-[20%] right-[30%] h-[100px] w-[100px] rounded-full bg-gradient-to-br from-brand-500/30 to-brand-500/10 [animation-delay:4s]" />
        <div className="deeplink-particle absolute left-[50%] top-[30%] h-[60px] w-[60px] rounded-full bg-gradient-to-br from-brand-500/30 to-brand-500/10 [animation-delay:1s]" />
        <div className="deeplink-particle absolute bottom-[30%] left-[20%] h-[90px] w-[90px] rounded-full bg-gradient-to-br from-brand-500/30 to-brand-500/10 [animation-delay:3s]" />
      </div>

      {/* Content Card - Using project's card design pattern with glassmorphism */}
      <div className="relative z-10 mx-4">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-md p-8 sm:p-10 shadow-2xl min-w-[280px] sm:min-w-[360px] border border-white/20">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <Image
              src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src}
              alt="OurBride Logo"
              width={120}
              height={96}
              className="h-16 w-auto sm:h-20"
            />
          </div>

          {/* Heart Icon with pulse animation */}
          <div className="mb-6 flex items-center justify-center">
            <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-brand-500 animate-pulse fill-brand-500/20" />
          </div>

          {/* Spinner - Using project's LoadingSpinner pattern with brand colors */}
          <div className="relative mb-6 flex h-16 w-16 items-center justify-center mx-auto">
            <Loader2 className="absolute h-full w-full animate-spin text-brand-500 [animation-duration:1.2s]" />
            <Loader2 className="absolute h-[70%] w-[70%] animate-spin text-brand-600 [animation-delay:-0.3s] [animation-duration:1.2s]" />
            <Loader2 className="absolute h-[40%] w-[40%] animate-spin text-brand-700 [animation-delay:-0.15s] [animation-duration:1.2s]" />
          </div>

          {/* Title - Using project's typography system */}
          <h2 className="mb-2 text-20 sm:text-24 font-semibold text-gray-900 text-center">
            Opening <span className="text-brand-500">OurBride</span>
          </h2>

          {/* Subtitle - Using project's typography system */}
          <p className="text-14 sm:text-16 text-gray-600 text-center font-normal">
            Please wait while we open the app...
          </p>
        </div>
      </div>
    </div>
  )
}
