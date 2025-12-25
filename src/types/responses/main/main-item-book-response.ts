/**
 * Main Item Book Response
 */

import type { MainBookResponse } from './main-book-response'
import type { MainItemLineResponse } from './main-item-line-response'

export interface MainItemBookResponse extends MainBookResponse<MainItemLineResponse> {
  estimated?: number
  totalPrice?: number
  completed?: number
  pending?: number
  isSubDone?: boolean
}


