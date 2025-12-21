/**
 * Product Error Data Response
 */

import type { AdditionalDataResponse } from './additional-data-response'

export interface ProductErrorDataResponse {
  resource: string | null
  id: number | null
  additionalInfo: AdditionalDataResponse | null
}
