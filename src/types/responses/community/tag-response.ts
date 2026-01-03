/**
 * Tag Response
 */

import type { BaseEntityResponse } from '../common'

export interface TagResponse extends BaseEntityResponse {
  name: string
  slug: string
  description: string
  color: string
  icon: string
  isActive: boolean
  isFeatured: boolean
  usageCount: number
}


















