'use client'

import { ReactNode } from 'react'
import { UserPageLayout } from '@/Components/layout'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return <UserPageLayout>{children}</UserPageLayout>
}

