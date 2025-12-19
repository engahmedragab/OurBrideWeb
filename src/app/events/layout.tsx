'use client'

import { UserPageLayout } from '@/components/layout'


export default function eventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserPageLayout>
      <div className="w-full min-h-screen flex flex-col">
        {children}
      </div>
    </UserPageLayout>
  )
}
