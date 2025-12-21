/**
 * Service Package Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'

export interface ServicePackageResponse extends BaseLookupResponse {
  price: number
  serviceId: number
}
