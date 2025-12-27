/**
 * Groom Response
 */

import type { UserResponse } from './user-response'

export interface GroomResponse extends UserResponse {
  groomId: number
  brideName: string
}


