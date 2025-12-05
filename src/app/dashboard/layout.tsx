'use client'

import { ReactNode } from 'react'
import { UserPageLayout } from '@/components/layout'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return <UserPageLayout>{children}</UserPageLayout>
}

