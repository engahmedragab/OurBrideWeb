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
  // Note: reservation property can cause circular dependency, use reservationId instead
  // reservation: ReservationResponse | null
  valueString: string | null
  valueInt: number | null
  valueBool: boolean | null
  valueDateTime: string | null // ISO DateTime string
}
