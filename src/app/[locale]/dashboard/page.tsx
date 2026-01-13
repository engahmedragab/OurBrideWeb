'use client'

import { useRouter } from '@/i18n/navigation'
import { useEffect } from 'react'

/**
 * Dashboard page component
 * Redirects to settings by default or can be customized to show dashboard content
 */
export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to settings by default
    // You can change this to redirect to any dashboard page
    router.replace('/dashboard/settings')
  }, [router])

  return null
}

