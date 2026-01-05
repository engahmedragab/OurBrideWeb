/**
 * Guest Line Category Response
 */

import type { LineCategoryResponse } from './line-category-response'
import type { GuestRelevant } from './book-enums'

export interface GuestLineCategoryResponse extends LineCategoryResponse {
  guestRelevant: GuestRelevant
}
