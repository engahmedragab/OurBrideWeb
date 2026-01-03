/**
 * User Response for Provider Home
 * Note: This is a separate definition to match C# contracts where fields are optional
 * Different from the base UserResponse which has required fields
 */

export interface ProviderHomeUserResponse {
  id: string // Guid
  userId: number
  firstName?: string
  lastName?: string
  isDeleted: boolean
  isActive: boolean
  isInit: boolean
  personal?: string
  personalType?: number // PersonalType enum as number
  birthDate?: string // ISO 8601 date string
  customTag?: string
  partnerName?: string
  type: number // UserType enum as number
  gender: number // Gender enum as number
  status: number // SocialStatus enum as number
  creationDate?: string // ISO 8601 date string
  lastModifiedDate?: string // ISO 8601 date string
  phoneNumber?: string
  email?: string
  userName?: string
  profileUrl?: string
}

