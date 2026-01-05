/**
 * Event Book Response
 */

import type { BookResponse } from './book-response'
import type { EventLineResponse } from './event-line-response'
import type { EventLineCategoryResponse } from './event-line-category-response'

export interface EventBookResponse extends BookResponse<EventLineResponse> {
  lineCategories?: EventLineCategoryResponse[]
  categoriesCount?: number
}
