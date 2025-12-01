import { useState } from 'react'
import {
  AuthLayout,
  AuthTabs,
  AuthDivider,
  LoginForm,
  TermsAndConditionsModal,
} from '@/Components/ui/auth'
import { SocialMediaButton } from '@/Components/ui/SocialMediaButton'
import { LoadingOverlay } from '@/Components/ui/LoadingOverlay'

/**
 * Login Page - UI composition only, no logic
 */
export default function LoginPage() {
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
          onForgotPasswordClick={() => console.log('Forgot password clicked')}
          onLoginClick={() => {
            setShowLoading(true)
            setTimeout(() => setShowLoading(false), 2000)
          }}
          onProviderClick={() => console.log('Provider link clicked')}
        />
      </AuthLayout>

      {/* Loading Overlay */}
      <LoadingOverlay open={showLoading} />
    </>
  )
}

