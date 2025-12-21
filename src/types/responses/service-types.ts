/**
 * Paginated List utility type
 */

export interface PaginatedList<T> {
  items: T[]
  totalCount: number
  currentPage: number
  pageSize: number
}
