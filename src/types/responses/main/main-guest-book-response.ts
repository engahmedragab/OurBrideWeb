/**
 * Main Guest Book Response
 */

import type { MainBookResponse } from './main-book-response'
import type { MainGuestLineResponse } from './main-guest-line-response'

export interface MainGuestBookResponse extends MainBookResponse<MainGuestLineResponse> {
  // No additional properties
}


