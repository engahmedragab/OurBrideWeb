'use client'

import { useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * ClientOnly Component
 * Only renders children on the client side to avoid hydration mismatches
 */
export const ClientOnly = ({ children, fallback = null }: ClientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}



