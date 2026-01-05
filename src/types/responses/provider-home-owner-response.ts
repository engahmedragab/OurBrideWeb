/**
 * Owner Response for Provider Home
 * Extends UserResponse with owner-specific fields
 */

import type { ProviderHomeUserResponse } from './provider-home-user-response'

export interface ProviderHomeOwnerResponse extends ProviderHomeUserResponse {
  id: string // Guid (overrides UserResponse.id)
  ownerId: number
}
