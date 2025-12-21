/**
 * Service Info Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type { ReservationInfoType } from '@/types/responses/common'

export interface ServiceInfoResponse extends BaseLookupResponse {
  id: number
  name: string // Computed property
  description: string | null // Computed property
  reservationInfoType: ReservationInfoType
  serviceId: number
  serviceName: string | null
  valueString: string | null
  valueInt: number | null
  valueBool: boolean | null
  valueDateTime: string | null // ISO DateTime string
}
