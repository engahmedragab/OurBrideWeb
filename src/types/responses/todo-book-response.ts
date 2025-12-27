/**
 * Todo Book Response
 */

import type { BookResponse } from './book-response'
import type { TodoLineResponse } from './todo-line-response'
import type { TodoLineCategoryResponse } from './todo-line-category-response'

export interface TodoBookResponse extends Omit<BookResponse<TodoLineResponse>, 'lines' | 'count'> {
  lines: TodoLineResponse[] // Override - only parent lines
  count: number // Override - only parent lines count
  parentLines?: TodoLineResponse[]
  lineCategories?: TodoLineCategoryResponse[]
  categoriesCount?: number
}


