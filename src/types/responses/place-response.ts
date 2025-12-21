/**
 * Place Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type { LinkResponse } from './link-response'
import type { ReviewResponse } from './review-response'
import type { AddressResponse } from './address-response'

export interface PlaceResponse extends BaseLookupResponse {
  phoneNumber: string
  phoneNumber2: string
  isActive: boolean
  rate: number | null
  likes: number | null
  links: LinkResponse[]
  reviews: ReviewResponse[]
  address: AddressResponse | null
  providerId: number | null
  isMain: boolean
}
