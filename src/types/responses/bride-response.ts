/**
 * Bride Response
 */

import type { UserResponse } from './user-response'

export interface BrideResponse extends UserResponse {
  brideId: number
  groomName: string
}


