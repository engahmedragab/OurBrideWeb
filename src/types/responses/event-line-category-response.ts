/**
 * Event Line Category Response
 */

import type { LineCategoryResponse } from './line-category-response'

export interface EventLineCategoryResponse extends LineCategoryResponse {
  date: string // ISO DateTime string
}
