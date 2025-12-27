/**
 * Main Occasion Book Response
 */

import type { MainBookResponse } from './main-book-response'
import type { MainOccasionLineResponse } from './main-occasion-line-response'

export interface MainOccasionBookResponse extends MainBookResponse<MainOccasionLineResponse> {
  occasions: MainOccasionLineResponse[]
}


