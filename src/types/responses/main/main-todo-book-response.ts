/**
 * Main Todo Book Response
 */

import type { MainBookResponse } from './main-book-response'
import type { MainTodoLineResponse } from './main-todo-line-response'
import type { TodoLineCategoryResponse } from '../todo-line-category-response'

export interface MainTodoBookResponse extends Omit<
  MainBookResponse<MainTodoLineResponse>,
  'count'
> {
  count: number // Override - only parent lines count
  completed?: number
  pending?: number
  isSubDone?: boolean
  todos?: MainTodoLineResponse[] | null
  lineCategories?: TodoLineCategoryResponse[]
}
