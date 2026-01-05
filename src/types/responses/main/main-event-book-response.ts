/**
 * Main Event Book Response
 */

import type { MainBookResponse } from './main-book-response'
import type { MainEventLineResponse } from './main-event-line-response'

export interface MainEventBookResponse extends MainBookResponse<MainEventLineResponse> {
  // No additional properties
}
