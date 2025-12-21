/**
 * Blocked Working Time Response
 */

import type { BaseResponse } from '@/types/responses/common'

export interface BlockedWorkingTimeResponse extends BaseResponse {
  dayOfWeek: number // DayOfWeek enum
  start: string // ISO DateTime string
  end: string // ISO DateTime string
  blockedDate: string // ISO DateTime string
  providerId: number | null
}
