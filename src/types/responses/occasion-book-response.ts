/**
 * Occasion Book Response
 */

import type { BookResponse } from './book-response'
import type { OccasionLineResponse } from './occasion-line-response'

export interface OccasionBookResponse extends BookResponse<OccasionLineResponse> {
  weddingOccasionId?: number
  weddingOccasion?: OccasionLineResponse
}
