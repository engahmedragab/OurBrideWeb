'use client'

import { UserPageLayout } from '@/components/layout'


export default function eventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <UserPageLayout  >
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="min-h-screen flex flex-col">
        <div className="w-full border-b border-gray-200 bg-white">
         
        </div>
        {children}
      </div>
    </div>
        </UserPageLayout>
  )
}
