/**
 * Todo Line Response
 */

import type { LineResponse } from './line-response'
import type { TodoLineCategoryResponse } from './todo-line-category-response'
import type { TodoSubLineResponse } from './todo-sub-line-response'

export interface TodoLineResponse extends LineResponse {
  count: number
  completed: number
  isSubDone: boolean
  task: string
  subTask: string
  hasSubline: boolean
  parentLineId?: number
  parentLine?: TodoSubLineResponse
  sublines?: TodoLineResponse[]
  todoLineCategory?: TodoLineCategoryResponse
}
