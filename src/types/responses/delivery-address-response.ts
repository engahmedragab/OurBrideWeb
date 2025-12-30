/**
 * Delivery Address Response
 * Based on OurBrideMain.Contracts.V1.Responses.Purchases.DeliveryAddressResponse
 */

import type { BaseEntityResponse } from './common'

export interface DeliveryAddressResponse extends BaseEntityResponse {
  contactName: string
  contactNumber1: string
  contactNumber2: string
  email: string
  address1: string
  address2: string
  city: string
  state: string
  postcode: string
  country: string
  isDefault: boolean
  addressComment: string
  deliveryId: number | null
  userId: string | null // Guid
  customerId: number | null // ulong in C# maps to number in TypeScript
}

