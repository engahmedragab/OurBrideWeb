/**
 * BudgetBooks Query Keys Factory
 *
 * Provides stable query keys for React Query cache management.
 * All keys are returned as arrays suitable for use with queryClient.invalidateQueries().
 */

import type {
  BudgetBooksQuery,
  BudgetBooksBaseQuery,
} from '@/services/api/budgetBooks.types'

/**
 * Query key factory for budget book queries
 */
export const budgetBookKeys = {
  /**
   * Key for a single budget book
   */
  book: (query?: BudgetBooksQuery) => ['budgetBook', 'book', query] as const,

  /**
   * Key for all budget lines
   */
  lines: (query?: BudgetBooksQuery) => ['budgetBook', 'lines', query] as const,

  /**
   * Key for custom filtered budget lines
   */
  linesCustom: (
    filters: { isDeleted: boolean; isDone: boolean; isFavorite: boolean },
    query?: BudgetBooksQuery
  ) => ['budgetBook', 'lines', 'custom', filters, query] as const,

  /**
   * Key for done budget lines
   */
  linesDone: (query?: BudgetBooksBaseQuery) =>
    ['budgetBook', 'lines', 'done', query] as const,

  /**
   * Key for not done budget lines
   */
  linesNotDone: (query?: BudgetBooksBaseQuery) =>
    ['budgetBook', 'lines', 'notDone', query] as const,

  /**
   * Key for favorite budget lines
   */
  linesFavorite: (query?: BudgetBooksBaseQuery) =>
    ['budgetBook', 'lines', 'favorite', query] as const,

  /**
   * Key for not favorite budget lines
   */
  linesNotFavorite: (query?: BudgetBooksBaseQuery) =>
    ['budgetBook', 'lines', 'notFavorite', query] as const,

  /**
   * Key for deleted budget lines
   */
  linesDeleted: (query?: BudgetBooksBaseQuery) =>
    ['budgetBook', 'lines', 'deleted', query] as const,

  /**
   * Key for not deleted budget lines
   */
  linesNotDeleted: (query?: BudgetBooksBaseQuery) =>
    ['budgetBook', 'lines', 'notDeleted', query] as const,

  /**
   * Key for a single budget line
   */
  line: (id: number, query?: BudgetBooksBaseQuery) =>
    ['budgetBook', 'line', id, query] as const,

  /**
   * Key for all budget categories
   */
  categories: (query?: BudgetBooksBaseQuery) =>
    ['budgetBook', 'categories', query] as const,

  /**
   * Key for a single budget category
   */
  category: (id: number, query?: BudgetBooksBaseQuery) =>
    ['budgetBook', 'category', id, query] as const,

  /**
   * Base key for all budget book related queries
   * Useful for invalidating all budget book data
   */
  all: () => ['budgetBook'] as const,
}
