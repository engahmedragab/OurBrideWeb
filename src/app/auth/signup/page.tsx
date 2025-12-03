'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AuthTabs,
  AuthDivider,
  SignupForm,
  TermsAndConditionsModal,
  WelcomeHeader,
} from '@/components/ui/auth/index'
import { SocialMediaButton } from '@/components/ui/SocialMediaButton'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { DownloadApp } from '@/components/common'

/**
 * Signup Page - UI composition only, no logic
 */
export default function SignupPage() {
  const router = useRouter()
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  const handleSignupSuccess = () => {
    setShowLoading(true)
    setTimeout(() => {
      setShowLoading(false)
      router.push('/auth/mobile-verification')
    }, 2000)
  }

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
            onClick={() => console.log('Google signup clicked')}
          />
          <SocialMediaButton
            provider="facebook"
            onClick={() => console.log('Facebook signup clicked')}
          />
          <SocialMediaButton
            provider="apple"
            onClick={() => console.log('Apple signup clicked')}
          />
        </div>

        {/* Divider */}
        <AuthDivider />

        {/* Signup Form */}
        <SignupForm
          onTermsClick={() => setShowTermsModal(true)}
          onSignupClick={handleSignupSuccess}
          onProviderClick={() => console.log('Provider link clicked')}
        />

        {/* Download App Section - Mobile Only */}
        <div className="lg:hidden w-full pt-4">
          <DownloadApp variant="default" />
        </div>
      </div>

      {/* Terms Modal */}
      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => console.log('Terms accepted')}
      />

      {/* Loading Overlay */}
      <LoadingOverlay open={showLoading} />
    </>
  )
}

