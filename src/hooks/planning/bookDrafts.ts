import type {
  BudgetLineResponse,
  BudgetLineCategoryResponse,
  NoteLineResponse,
  NoteLineCategoryResponse,
  UserType,
  BookClass,
} from '@/types/responses'

export type BudgetBookDraft = {
  id?: number
  groomId?: string | null
  brideId?: string | null
  weddingPlannerId?: string | null
  bookType: UserType | string | number
  bookClass: BookClass | string | number
  title?: string | null
  clientName?: string | null
  weddingDate?: string | null
  eventLocation?: string | null
  initialEstimated?: number | null
  estimated?: number | null
  pending?: number | null
  paid?: number | null
  final?: number | null
  lines?: BudgetLineResponse[]
  lineCategories?: BudgetLineCategoryResponse[]
  count?: number | null
  createdBy?: string | null
  lastModifiedBy?: string | null
  isDeleted?: boolean
  creationDate?: string | null
  lastModifiedDate?: string | null
  slug?: string | null
  isModelsAdd?: boolean
}

export type NoteBookDraft = {
  id?: number
  groomId?: string | null
  brideId?: string | null
  weddingPlannerId?: string | null
  bookType: UserType | string | number
  bookClass: BookClass | string | number
  title?: string | null
  clientName?: string | null
  weddingDate?: string | null
  eventLocation?: string | null
  lines?: NoteLineResponse[]
  lineCategories?: NoteLineCategoryResponse[]
  count?: number | null
  createdBy?: string | null
  lastModifiedBy?: string | null
  isDeleted?: boolean
  creationDate?: string | null
  lastModifiedDate?: string | null
  slug?: string | null
  isModelsAdd?: boolean
}
