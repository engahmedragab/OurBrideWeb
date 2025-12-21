/**
 * Reservation Info Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type { ReservationInfoType } from '@/types/responses/common'

export interface ReservationInfoResponse extends BaseResponse {
  reservationInfoType: ReservationInfoType
  reservationInfoId: number
  serviceId: number
  serviceName: string
  reservationId: number
  reservationCode: string
  valueString: string
  valueInt: number | null
  valueBool: boolean | null
  valueDateTime: string | null // ISO DateTime string
}
