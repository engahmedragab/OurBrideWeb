'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AuthTabs,
  AuthDivider,
  LoginForm,
  WelcomeHeader,
} from '@/Components/ui/auth'
import { SocialMediaButton } from '@/Components/ui/SocialMediaButton'
import { LoadingOverlay } from '@/Components/ui/LoadingOverlay'

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
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay open={showLoading} />
    </>
  )
}

