/**
 * JWT Token Decoding Utilities
 * Matches Flutter implementation claim names
 */

// JWT Claim names (matching Flutter implementation)
export const JWT_CLAIMS = {
  TYPE: 'type',
  LANG: 'lang',
  REGISTER: 'register',
  CONFIRM: 'confirm',
  USER_INIT: 'init',
  JTI: 'jti',
  SUB: 'sub',
  EMAIL: 'email',
  EMAIL_CLAIM:
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  ISS: 'iss',
  AUD: 'aud',
  USER_ID: 'nameid',
  NAME_IDENTIFIER:
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  NAME: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  SID: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid',
  MOBILE_PHONE:
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone',
  ROLE: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  PERMISSION: 'permission',
} as const

export interface DecodedJWT {
  [key: string]: unknown
  // Common claims
  nameid?: string
  sub?: string
  email?: string
  type?: string
  lang?: string
  register?: string
  confirm?: string | boolean
  init?: string | boolean
  jti?: string
  iss?: string
  aud?: string
  // Extended claims
  [JWT_CLAIMS.NAME]?: string
  [JWT_CLAIMS.MOBILE_PHONE]?: string
  [JWT_CLAIMS.SID]?: string
  [JWT_CLAIMS.EMAIL_CLAIM]?: string
}

/**
 * Decode JWT token
 */
export const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4)
    const decoded = atob(paddedPayload)
    return JSON.parse(decoded) as DecodedJWT
  } catch {
    return null
  }
}

/**
 * Extract user ID from JWT token
 */
export const getUserIdFromToken = (token: string): string | null => {
  const decoded = decodeJWT(token)
  if (!decoded) return null

  return (
    (decoded[JWT_CLAIMS.USER_ID] as string) ||
    (decoded[JWT_CLAIMS.SID] as string) ||
    (decoded[JWT_CLAIMS.SUB] as string) ||
    null
  )
}

/**
 * Extract user name from JWT token
 */
export const getUserNameFromToken = (token: string): string => {
  const decoded = decodeJWT(token)
  if (!decoded) return ''

  const name = decoded[JWT_CLAIMS.NAME] as string
  if (name && typeof name === 'string') {
    return name.trim()
  }

  return ''
}

/**
 * Extract phone number from JWT token
 */
export const getPhoneFromToken = (token: string): string => {
  const decoded = decodeJWT(token)
  if (!decoded) return ''

  const phone = decoded[JWT_CLAIMS.MOBILE_PHONE] as string
  if (phone && typeof phone === 'string') {
    return phone.trim()
  }

  return ''
}

/**
 * Extract email from JWT token
 */
export const getEmailFromToken = (token: string): string => {
  const decoded = decodeJWT(token)
  if (!decoded) return ''

  const email = (decoded[JWT_CLAIMS.EMAIL] ||
    decoded[JWT_CLAIMS.EMAIL_CLAIM]) as string
  if (email && typeof email === 'string') {
    return email.trim()
  }

  return ''
}

/**
 * Extract user type from JWT token
 */
export const getUserTypeFromToken = (token: string): string => {
  const decoded = decodeJWT(token)
  if (!decoded) return ''

  const type = decoded[JWT_CLAIMS.TYPE] as string
  if (type && typeof type === 'string') {
    return type.toLowerCase()
  }

  return ''
}

/**
 * Check if JWT token is expired
 */
export const isJWTTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.exp) return true

    const exp = decoded.exp as number
    const currentTime = Math.floor(Date.now() / 1000)

    return exp < currentTime
  } catch {
    return true
  }
}

/**
 * Get expiration date from token
 */
export const getTokenExpirationDate = (token: string): Date | null => {
  try {
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.exp) return null

    const exp = decoded.exp as number
    return new Date(exp * 1000)
  } catch {
    return null
  }
}

/**
 * Extract all user information from JWT token
 */
export const getUserInfoFromToken = (
  token: string
): {
  id: string | null
  email: string
  name: string
  phoneNumber: string
  userType: string
  sub: string | null
  decoded: DecodedJWT | null
} => {
  const decoded = decodeJWT(token)

  if (!decoded) {
    return {
      id: null,
      email: '',
      name: '',
      phoneNumber: '',
      userType: '',
      sub: null,
      decoded: null,
    }
  }

  return {
    id: getUserIdFromToken(token),
    email: getEmailFromToken(token),
    name: getUserNameFromToken(token),
    phoneNumber: getPhoneFromToken(token),
    userType: getUserTypeFromToken(token),
    sub: (decoded[JWT_CLAIMS.SUB] as string) || null,
    decoded,
  }
}
