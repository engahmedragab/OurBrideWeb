/**
 * Line Category Response
 */

import type { BaseEntityResponse } from './common'

export interface LineCategoryResponse extends BaseEntityResponse {
  name: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  description: string
  eventId?: number
  createdBy: string // Guid
  lastModifiedBy: string // Guid
  isModelLine: boolean
}
