/**
 * Guest Line Response
 */

import type { LineResponse } from './line-response'
import type { GuestLineCategoryResponse } from './guest-line-category-response'
import type { GuestResponse } from './guest-response'
import type { GuestStatus, GuestRelevant, GuestTitle } from './book-enums'

export interface GuestLineResponse extends LineResponse {
  guestId?: string // Guid
  guest?: GuestResponse
  nickName: string
  title: GuestTitle
  attended: boolean
  family: string
  status: GuestStatus
  guestRelevant: GuestRelevant
  guestLineCategory?: GuestLineCategoryResponse
}


