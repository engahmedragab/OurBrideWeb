/**
 * Item Detail Response
 */

import type { BaseEntityResponse } from './common'
import type { ItemResponse } from './item-response'

export interface ItemDetailResponse extends BaseEntityResponse {
  utilization: string
  importance?: number // Importance enum
  priority?: number // Priority enum
  usage: string
  quantity?: number
  represent: string
  representType?: number // RepresentType enum
  availableTypes: string
  popularBrands: string
  places: string
  lowPrice?: number
  highPrice?: number
  price?: number
  additions: string
  itemId: number
  item?: ItemResponse
  createdBy: string // Guid
  lastModifiedBy: string // Guid
}
