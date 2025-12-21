/**
 * Address Response
 */

import type {
  Source,
  TenantScopeLevel,
  AddressType,
  AddressStatus,
  AddressGrade,
} from '@/types/responses/common'

export interface AddressResponse {
  id: number
  sourceId: number
  source: Source
  providerId: number | null
  branchId: number | null
  staffId: string | null // Guid
  userId: string | null // Guid
  scopeLevel: TenantScopeLevel
  isGlobal: boolean
  isInherited: boolean
  parentId: number | null
  type: AddressType | null
  category: string | null
  status: AddressStatus
  countryId: number
  countryName: string
  cityId: number
  cityName: string
  regionId: number | null
  regionName: string
  nameEn: string
  nameAr: string
  addressEn: string
  addressAr: string
  address2: string
  street: string
  building: string
  floor: string
  apartment: string
  landmark: string
  directions: string
  postalCode: number
  postalCodeText: string
  latitude: number
  longitude: number
  altitude: number | null
  timeZone: string
  grade: AddressGrade | null
  isPrimary: boolean
  isVerified: boolean
  isActive: boolean
  contactPerson: string
  contactPhone: string
  contactEmail: string
  contactNotes: string
  businessName: string
  businessType: string
  businessHours: string
  businessDescription: string
  isDeliveryAvailable: boolean
  isPickupAvailable: boolean
  deliveryInstructions: string
  pickupInstructions: string
  deliveryRadius: number | null
  deliveryFee: number | null
  deliveryTimeMinutes: number | null
  isWheelchairAccessible: boolean
  hasParking: boolean
  hasPublicTransport: boolean
  accessibilityNotes: string
  isValidated: boolean
  validatedAt: string | null // ISO DateTime string
  validationSource: string
  validationNotes: string
  validationScore: number | null
  usageCount: number
  deliveryCount: number
  pickupCount: number
  lastUsedAt: string | null // ISO DateTime string
  lastDeliveryAt: string | null // ISO DateTime string
  lastPickupAt: string | null // ISO DateTime string
  tags: string
  metadata: string
  notes: string
  expiresAt: string | null // ISO DateTime string
  isTemporary: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
  createdBy: string // Guid
  lastModifiedBy: string // Guid
  displayName: string // Computed property
  displayAddress: string // Computed property
  fullAddress: string // Computed property
  isExpired: boolean // Computed property
  statusText: string // Computed property
  typeText: string // Computed property
  gradeText: string // Computed property
}
