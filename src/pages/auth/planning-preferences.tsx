import { PlanningPreferencesForm } from '@/Components/ui/auth/PlanningPreferencesForm'
import { AuthLayout } from '@/Components/ui/auth/AuthLayout'

/**
 * Planning Preferences Page - Collect user preferences after mobile verification
 * User selects services, budget, location, and provides details
 */
export default function PlanningPreferencesPage() {
  return (
    <AuthLayout showWelcomeHeader={false}>
      <PlanningPreferencesForm
        onBackClick={() => {
          // Handle back navigation
          window.history.back()
        }}
      />
    </AuthLayout>
  )
}

