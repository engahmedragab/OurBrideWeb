'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/auth/hooks'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

export default function CommunityProfilePage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      router.replace(`/community/profile?id=${user.id}&type=User`)
    } else {
      // If not authenticated, redirect to login or community home
      router.replace('/community')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <LoadingOverlay open={true} title="Loading..." />
      </div>
    </div>
  )
}
