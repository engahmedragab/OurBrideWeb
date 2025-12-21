/**
 * User Response
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
  personalType: number | null // PersonalType enum
  birthDate: string | null // ISO DateTime string
  customTag: string
  partnerName: string
  type: number // UserType enum
  gender: number // Gender enum
  status: number // SocialStatus enum
  creationDate: string | null // ISO DateTime string
  lastModifiedDate: string | null // ISO DateTime string
  phoneNumber: string
  email: string
  userName: string
  profileUrl: string
}
