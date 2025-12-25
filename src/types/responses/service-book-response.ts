/**
 * Service Book Response
 */

import type { BookResponse } from './book-response'
import type { ServiceLineResponse } from './service-line-response'

export interface ServiceBookResponse extends BookResponse<ServiceLineResponse> {
  completed?: number
  pending?: number
  isSubDone?: boolean
}


