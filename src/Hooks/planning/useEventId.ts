/**
 * Hook to get eventId from query parameters
 */

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

/**
 * Get eventId from URL query parameters
 * @returns eventId as number or null
 */
export const useEventId = (): number | null => {
  const searchParams = useSearchParams()
  
  return useMemo(() => {
    const eventIdParam = searchParams?.get('eventId')
    if (!eventIdParam) return null
    
    const eventId = parseInt(eventIdParam, 10)
    return isNaN(eventId) ? null : eventId
  }, [searchParams])
}


