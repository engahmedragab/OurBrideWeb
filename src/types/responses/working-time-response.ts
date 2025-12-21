/**
 * Working Time Response
 */

import type { BaseResponse } from '@/types/responses/common'

export interface WorkingTimeResponse extends BaseResponse {
  dayOfWeek: number // DayOfWeek enum (0=Sunday, 1=Monday, etc.)
  start: string // ISO DateTime string
  end: string // ISO DateTime string
  providerId: number | null
}
