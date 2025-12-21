/**
 * Wedding Planner Response
 */

export interface WeddingPlannerResponse {
  id: string // Guid
  email: string
  userName: string
  firstName: string
  lastName: string
  phoneNumber: string
  companyName: string
  bio: string
  website: string
  address: string
  experienceYears: number | null
  specializations: string
  hourlyRate: number | null
  packageRate: number | null
  isCertified: boolean
  certificationUrl: string
  isActive: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
  language: number // Language enum
  gender: number // Gender enum
  tier: number // UserTier enum
  profileUrl: string
}
