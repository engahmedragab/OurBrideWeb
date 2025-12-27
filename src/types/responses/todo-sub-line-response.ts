/**
 * Todo Sub Line Response
 */

import type { LineResponse } from './line-response'
import type { TodoLineCategoryResponse } from './todo-line-category-response'

export interface TodoSubLineResponse extends LineResponse {
  task: string
  subTask: string
  hasSubline: boolean
  parentLineId?: number
  todoLineCategory?: TodoLineCategoryResponse
}


