/**
 * Product Information Response
 */

import type { ProductInfoCategory } from '@/../client/common/api/gen/ourbride-api'

export interface ProductInformationResponse {
  category: ProductInfoCategory
  subCategory: string | null
  name: string
  value: string
  visible: boolean
  global: boolean
  default: string | null
  productId: number
}
