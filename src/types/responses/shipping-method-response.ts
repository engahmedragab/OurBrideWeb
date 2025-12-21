/**
 * Shipping-related response types
 */

export interface ShippingMethodResponse {
  id: number
  nameAr: string
  nameEn: string
  name: string
  descriptionAr: string
  descriptionEn: string
  title: string
  description: string
  code: string
  provider: string
  providerServiceCode: string
  trackingUrl: string
  rateType: string
  baseRate: number
  perItemRate: number | null
  perWeightRate: number | null
  freeShippingThreshold: number | null
  currency: string
  minDeliveryDays: number | null
  maxDeliveryDays: number | null
  deliveryTimeDescription: string
  allowedCountries: string
  excludedCountries: string
  allowedStates: string
  excludedStates: string
  maxWeight: number | null
  maxLength: number | null
  maxWidth: number | null
  maxHeight: number | null
  isActive: boolean
  isDefault: boolean
  sortOrder: number
  requiresSignature: boolean
  isInsured: boolean
  insuranceValue: number | null
  methodType: string
}
