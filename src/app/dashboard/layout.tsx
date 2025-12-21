'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { UserPageLayout } from '@/components/layout'
import { useAuth } from '@/auth'
import { isPreferenceInit } from '@/auth/utils/token'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    // Don't redirect if still loading
    if (isLoading) {
      return
    }

    // Don't redirect if already on planning preferences page
    if (pathname?.includes('/auth/planning-preferences')) {
      return
    }

    // Don't redirect if we've already redirected in this session
    if (hasRedirectedRef.current) {
      return
    }

    // Exclude help center and other informational pages from redirect
    // Allow users to access help center even if preferences aren't set
    const exemptPaths = [
      '/dashboard/help-center',
      '/dashboard/settings', // allow access to settings without planning preferences
      // Add other exempt paths here if needed
    ]
    
    const isExemptPath = exemptPaths.some(path => pathname?.startsWith(path))
    if (isExemptPath) {
      return
    }

    // Check if user is authenticated and hasn't initialized preferences
    // Only redirect once per session (after login)
    if (user && !isPreferenceInit()) {
      hasRedirectedRef.current = true
      // Redirect to planning preferences
      router.push('/auth/planning-preferences')
    }
  }, [user, isLoading, router, pathname])

  // Reset redirect flag when user logs out or preferences are completed
  useEffect(() => {
    if (user && isPreferenceInit()) {
      hasRedirectedRef.current = false
    } else if (!user) {
      // Reset when user logs out
      hasRedirectedRef.current = false
    }
  }, [user])

  return <UserPageLayout>{children}</UserPageLayout>
}

