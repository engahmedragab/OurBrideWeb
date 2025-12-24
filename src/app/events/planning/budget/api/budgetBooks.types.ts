/**
 * BudgetBooks API Types
 * 
 * Type definitions, response types, query parameters, and form values
 * for the BudgetBooks module.
 */

import type {
  BudgetBook,
  BudgetBookRequest,
  BudgetLine,
  BudgetLineRequest,
  BudgetLineUpdateRequest,
  BudgetLineCategory,
  BudgetLineCategoryRequest,
  BudgetLineCategoryUpdateRequest,
  UserType,
  BookClass,
} from '@/../client/common/api/gen/ourbride-api'

// Re-export types from generated API
export type {
  BudgetBook,
  BudgetBookRequest,
  BudgetLine,
  BudgetLineRequest,
  BudgetLineUpdateRequest,
  BudgetLineCategory,
  BudgetLineCategoryRequest,
  BudgetLineCategoryUpdateRequest,
  UserType,
  BookClass,
}

// Response types for API endpoints
export type GetBudgetBookResponse = BudgetBook | null
export type GetBudgetLinesResponse = BudgetLine[]
export type GetBudgetCategoriesResponse = BudgetLineCategory[]
export type GetBudgetLineResponse = BudgetLine | null
export type GetBudgetCategoryResponse = BudgetLineCategory | null

// Query parameter types
export interface BudgetBooksQuery {
  clientId?: string
  userType?: UserType
  eventId?: number
}

export interface BudgetBooksBaseQuery {
  clientId?: string
  userType?: UserType
}

// Form value types (for future form implementation)
export interface InitBudgetBookFormValues {
  title: string
  clientName: string
  weddingDate: string
  eventLocation: string
  initialEstimated: number
  groomId?: string | null
  brideId?: string | null
  weddingPlannerId?: string | null
  bookType?: UserType
  bookClass?: BookClass
}

export interface BudgetLineFormValues {
  id?: number | null
  bookId: number
  expense?: string | null
  lineCategoryId?: number | null
  lineCategoryCountId?: number | null
  lineCategorySlug?: string | null
  estimated?: number | null
  paid?: number | null
  final?: number | null
  dueDate?: string | null
  count?: number | null
  payer?: string | null
  note?: string | null
  isDone?: boolean
  isFavorite?: boolean
  isDeleted?: boolean
  isModelLine?: boolean
  iconName?: string | null
  colorName?: string | null
  brideId?: string | null
  groomId?: string | null
}

export interface BudgetCategoryFormValues {
  id?: number | null
  name?: string | null
  nameAr?: string | null
  nameEn?: string | null
  description?: string | null
  descriptionAr?: string | null
  descriptionEn?: string | null
  iconName?: string | null
  colorName?: string | null
  count_id?: number | null
  isModelLine?: boolean
}

// API Error type
export interface ApiError {
  message: string
  status?: number
  details?: unknown
}

