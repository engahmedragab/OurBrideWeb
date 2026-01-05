/**
 * Main Todo Line Response
 */

import type { MainLineResponse } from './main-line-response'

export interface MainTodoLineResponse extends MainLineResponse {
  bookId?: number
  lineCategoryId?: number
  lineCategoryCountId?: number
  lineCategorySlug?: string
  parentLineId?: number | null
  task: string
  subTask: string
  hasSubline: boolean
  sublines?: MainTodoLineResponse[]
}
