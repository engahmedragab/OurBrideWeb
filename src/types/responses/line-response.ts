/**
 * Line Response
 */

import type { BaseEntityResponse } from './common'
import type { UserType, BookClass } from './book-enums'

export interface LineResponse extends BaseEntityResponse {
  groomId?: string // Guid
  brideId?: string // Guid
  lineType: UserType
  bookClass: BookClass
  isDone: boolean
  isFavorite: boolean
  isModelLine: boolean
  bookId?: number
  lineCategoryId?: number
  createdBy: string // Guid
  lastModifiedBy: string // Guid
}


