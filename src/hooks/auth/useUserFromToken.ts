/**
 * Hook to extract user information from JWT token
 * Handles both AuthUser objects and login response objects with tokens
 */

import { useMemo } from 'react'
import { useAuthContext } from '@/auth/context/AuthContext'
import { getUser } from '@/auth/utils/token'
import { getUserInfoFromToken, type DecodedJWT } from '@/auth/utils/jwt'
import type { AuthUser } from '@/auth/types'
import type { UserResponse } from '@/types/responses'

export interface ExtractedUserInfo {
  id: string | null
  email: string
  name: string
  phoneNumber: string
  userType: string
  sub: string | null
  fullName?: string
  firstName?: string
  lastName?: string
  userName?: string
  decodedToken?: DecodedJWT | null
  rawUser?: AuthUser | UserResponse | null
}

/**
 * Extract user name from various user object formats
 */
const extractUserName = (
  userData: AuthUser | UserResponse | null | undefined
): string => {
  if (!userData) return ''

  const userAny = userData as any

  // Check for fullName (AuthUser)
  if (userAny.fullName && typeof userAny.fullName === 'string') {
    return userAny.fullName.trim()
  }

  // Check for firstName + lastName (UserResponse)
  if (userAny.firstName && userAny.lastName) {
    const name = `${userAny.firstName} ${userAny.lastName}`.trim()
    if (name) return name
  }

  // Fallback to userName
  if (userAny.userName && typeof userAny.userName === 'string') {
    return userAny.userName.trim()
  }

  return ''
}

/**
 * Extract phone number from various user object formats
 */
const extractUserPhone = (
  userData: AuthUser | UserResponse | null | undefined
): string => {
  if (!userData) return ''

  const userAny = userData as any

  // Check multiple possible phone number fields
  if (userAny.phoneNumber && typeof userAny.phoneNumber === 'string') {
    return userAny.phoneNumber.trim()
  }
  if (userAny.phone && typeof userAny.phone === 'string') {
    return userAny.phone.trim()
  }
  if (userAny.mobileNumber && typeof userAny.mobileNumber === 'string') {
    return userAny.mobileNumber.trim()
  }

  return ''
}

/**
 * Hook to get user information from token or user object
 * Handles login response objects that contain tokens
 */
export const useUserFromToken = (): ExtractedUserInfo => {
  const { user } = useAuthContext()

  return useMemo(() => {
    // Get user from context or localStorage
    const userFromStorage = typeof window !== 'undefined' ? getUser() : null
    const currentUser = user || userFromStorage

    // Default return value
    const defaultInfo: ExtractedUserInfo = {
      id: null,
      email: '',
      name: '',
      phoneNumber: '',
      userType: '',
      sub: null,
      rawUser: currentUser,
    }

    if (!currentUser) {
      return defaultInfo
    }

    const userAny = currentUser as any

    // If it's a login response with token, decode the token
    if (userAny.token && typeof userAny.token === 'string') {
      const tokenInfo = getUserInfoFromToken(userAny.token)

      return {
        ...tokenInfo,
        fullName: tokenInfo.name || extractUserName(currentUser),
        firstName: (currentUser as any).firstName,
        lastName: (currentUser as any).lastName,
        userName: (currentUser as any).userName,
        decodedToken: tokenInfo.decoded,
        rawUser: currentUser,
      }
    }

    // If it's a regular user object (AuthUser or UserResponse)
    const extractedName = extractUserName(currentUser)
    const extractedPhone = extractUserPhone(currentUser)

    return {
      id: (currentUser as any).id || (currentUser as any).userId || null,
      email: (currentUser as any).email || '',
      name: extractedName,
      phoneNumber: extractedPhone,
      userType:
        (currentUser as any).userType || (currentUser as any).type || '',
      sub: (currentUser as any).sub || null,
      fullName: (currentUser as any).fullName,
      firstName: (currentUser as any).firstName,
      lastName: (currentUser as any).lastName,
      userName: (currentUser as any).userName,
      rawUser: currentUser,
    }
  }, [user])
}
