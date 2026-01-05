/**
 * Main Service Book Response
 */

import type { MainBookResponse } from './main-book-response'
import type { MainServiceLineResponse } from './main-service-line-response'

export interface MainServiceBookResponse extends MainBookResponse<MainServiceLineResponse> {
  completed?: number
  pending?: number
  isSubDone?: boolean
  services?: MainServiceLineResponse[]
}
