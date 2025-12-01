import { useState } from 'react'
import {
  AuthLayout,
  AuthTabs,
  AuthDivider,
  SignupForm,
  TermsAndConditionsModal,
} from '@/Components/ui/auth'
import { SocialMediaButton } from '@/Components/ui/SocialMediaButton'
import { LoadingOverlay } from '@/Components/ui/LoadingOverlay'

/**
 * Signup Page - UI composition only, no logic
 */
export default function SignupPage() {
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  return (
    <>
      <AuthLayout>
        {/* Tabs */}
        <AuthTabs />

        {/* Social Login */}
        <div className="flex items-center justify-center gap-4">
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
          onSignupClick={() => {
            setShowLoading(true)
            setTimeout(() => setShowLoading(false), 2000)
          }}
          onProviderClick={() => console.log('Provider link clicked')}
        />
      </AuthLayout>

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

