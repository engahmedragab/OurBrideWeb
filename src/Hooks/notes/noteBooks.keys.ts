import type { NoteBooksQuery } from '@/services/api/noteBooksApi'

export const noteBookKeys = {
  all: () => ['noteBook'] as const,
  book: (query?: NoteBooksQuery) => ['noteBook', 'book', query] as const,
}
