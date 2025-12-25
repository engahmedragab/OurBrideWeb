/**
 * Guest Response
 */

import type { UserResponse } from './user-response'

export interface GuestResponse extends UserResponse {
  guestId: number
}


