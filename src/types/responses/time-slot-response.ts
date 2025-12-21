/**
 * Time Slot Response
 */

import type { BaseEntityResponse } from '@/types/responses/common'
import type { AvailabilityStatus } from '@/types/responses/common'

export interface TimeSlotResponse extends BaseEntityResponse {
  start: string // ISO DateTime string
  end: string // ISO DateTime string
  serviceId: number | null
  status: AvailabilityStatus
  shortName: string | null
}
