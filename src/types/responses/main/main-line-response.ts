/**
 * Main Line Response (Base)
 * Simplified line response for home/dashboard views
 */

import type { BookClass } from '../book-enums'

export interface MainLineResponse {
  id: number
  bookClass: BookClass
  isDone: boolean
  isFavorite: boolean
  isDeleted: boolean
  creationDate: string
  lastModifiedDate: string
  isModelLine: boolean
}


