/**
 * Main Book Response (Base)
 * Simplified book response for home/dashboard views
 */

import type { BookClass } from '../book-enums'
import type { MainLineResponse } from './main-line-response'

export interface MainBookResponse<TLine extends MainLineResponse> {
  id: number
  isModelsAdd: boolean
  isBookInit: boolean
  bookClass: BookClass
  title: string
  description: string
  lines: TLine[]
  count?: number
  isDeleted: boolean
  creationDate: string
  lastModifiedDate: string
}


