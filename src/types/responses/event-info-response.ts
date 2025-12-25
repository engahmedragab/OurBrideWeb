/**
 * Event Info Response
 * Contains all book responses for a wedding event
 */

import type { MainItemBookResponse } from './main/main-item-book-response'
import type { MainServiceBookResponse } from './main/main-service-book-response'
import type { MainBudgetBookResponse } from './main/main-budget-book-response'
import type { MainEventBookResponse } from './main/main-event-book-response'
import type { MainGuestBookResponse } from './main/main-guest-book-response'
import type { MainNoteBookResponse } from './main/main-note-book-response'
import type { MainTodoBookResponse } from './main/main-todo-book-response'
import type { MainOccasionBookResponse } from './main/main-occasion-book-response'

export interface EventInfoResponse {
  itemBook: MainItemBookResponse
  serviceBook: MainServiceBookResponse
  budgetBook: MainBudgetBookResponse
  eventBook: MainEventBookResponse
  guestBook: MainGuestBookResponse
  noteBook: MainNoteBookResponse
  todoBook: MainTodoBookResponse
  occasionBook: MainOccasionBookResponse
}


