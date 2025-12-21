/**
 * Product Error Response
 */

import type { ProductErrorDataResponse } from './product-error-data-response'

export interface ProductErrorResponse {
  code: string | null
  message: string | null
  data: ProductErrorDataResponse | null
}
