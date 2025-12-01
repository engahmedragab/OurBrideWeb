import { ForgotPasswordForm } from '@/Components/ui/auth/ForgotPasswordForm'
import { AuthLayout } from '@/Components/ui/auth/AuthLayout'

/**
 * Forgot Password Page - Multi-step password reset flow
 * Step 1: Enter mobile number
 * Step 2: Enter 4-digit OTP
 * Step 3: Enter new password + confirm password
 */
export default function ForgotPasswordPage() {
  return (
    <AuthLayout showWelcomeHeader={false}>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}

