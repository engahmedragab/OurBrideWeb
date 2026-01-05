/**
 * User Response
 * Used in community content responses
 */

export interface UserResponse {
  id: string // Guid
  userId: number
  firstName: string
  lastName: string
  isDeleted: boolean
  isActive: boolean
  isInit: boolean
  personal: string
  personalType: string | null
  birthDate: string | null // ISO date string
  customTag: string
  partnerName: string
  type: string // UserType enum
  gender: string // Gender enum
  status: string // SocialStatus enum
  creationDate: string | null // ISO date string
  lastModifiedDate: string | null // ISO date string
  phoneNumber: string
  email: string
  userName: string
  profileUrl: string
}
