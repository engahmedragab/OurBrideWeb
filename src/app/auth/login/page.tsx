'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AuthTabs,
  AuthDivider,
  LoginForm,
  WelcomeHeader,
} from '@/components/ui/auth/index'
import { SocialMediaButton } from '@/components/ui/SocialMediaButton'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { DownloadApp } from '@/components/common'

/**
 * Login Page - UI composition only, no logic
 */
export default function LoginPage() {
  const router = useRouter()
  const [showLoading, setShowLoading] = useState(false)

  return (
    <>
      <div className="w-full max-w-[328px] sm:max-w-[360px] md:max-w-[380px] mx-auto space-y-2.5">
        {/* Welcome Header */}
        <WelcomeHeader welcomeText="Welcome To OurBride" />

        {/* Tabs */}
        <AuthTabs />

        {/* Social Login */}
        <div className="flex items-center justify-center gap-2">
          <SocialMediaButton
            provider="google"
            onClick={() => console.log('Google login clicked')}
          />
          <SocialMediaButton
            provider="facebook"
            onClick={() => console.log('Facebook login clicked')}
          />
          <SocialMediaButton
            provider="apple"
            onClick={() => console.log('Apple login clicked')}
          />
        </div>

        {/* Divider */}
        <AuthDivider />

        {/* Login Form */}
        <LoginForm
          onForgotPasswordClick={() => router.push('/auth/forgot-password')}
          onLoginClick={() => {
            setShowLoading(true)
            setTimeout(() => setShowLoading(false), 2000)
          }}
          onProviderClick={() => console.log('Provider link clicked')}
        />

        {/* Download App Section - Mobile Only */}
        <div className="lg:hidden w-full pt-4">
          <DownloadApp variant="default" />
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay open={showLoading} />
    </>
  )
}
