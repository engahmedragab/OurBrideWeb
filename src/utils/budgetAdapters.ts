/**
 * Budget Adapters
 * 
 * Functions to convert between API response format and local draft format
 */

import type { BudgetBookResponse, BudgetLineResponse, BudgetLineCategoryResponse } from '@/types/responses'
import type { BudgetBookRequest, BudgetLineRequest, BudgetLineCategoryRequest } from '@/../client/common/api/gen/ourbride-api'

/**
 * Draft type for local state (matches API response structure)
 */
export type BudgetBookDraft = BudgetBookResponse

/**
 * Convert API response to draft format
 */
export const mapApiToDraft = (apiData: BudgetBookResponse | null | any): BudgetBookDraft | null => {
  if (!apiData) return null

  return {
    ...apiData,
    lines: apiData.lines || [],
    lineCategories: apiData.lineCategories || [],
    initialEstimated: apiData.initialEstimated ?? apiData.estimated ?? undefined,
  } as BudgetBookDraft
}

/**
 * Convert draft to sync payload
 */
export const mapDraftToSyncPayload = (draft: BudgetBookDraft): BudgetBookRequest => {
  // Convert lines
  const lines: BudgetLineRequest[] = (draft.lines || [])
    .filter(line => !line.isDeleted) // Exclude soft-deleted lines
    .map(line => ({
      id: line.id || 0,
      bookId: draft.id || 0,
      expense: line.expense || null,
      lineCategoryId: line.lineCategoryId || null,
      estimated: line.estimated || 0,
      paid: line.paid || 0,
      final: line.final || null,
      dueDate: line.dueDate || null,
      count: line.count || null,
      payer: line.payer || null,
      note: line.note || null,
      isDone: line.isDone || false,
      isFavorite: line.isFavorite || false,
      isDeleted: line.isDeleted || false,
      isModelLine: line.isModelLine || false,
      iconName: line.iconName || null,
      colorName: line.colorName || null,
      brideId: line.brideId || null,
      groomId: line.groomId || null,
    }))

  // Convert categories
  // Include all categories (even deleted ones) so API can update isDeleted flag
  const lineCategories: BudgetLineCategoryRequest[] = (draft.lineCategories || [])
    .map(cat => ({
      id: cat.id || 0,
      name: cat.name || null,
      description: cat.description || null,
      iconName: cat.iconName || null,
      colorName: cat.colorName || null,
      count_id: (cat as any).count_id || null,
      isModelLine: cat.isModelLine || false,
      isDeleted: cat.isDeleted || false, // Include isDeleted flag
      // Include multilingual fields even though they're not in type definition
      // API may accept them
      nameAr: (cat as any).nameAr || null,
      nameEn: (cat as any).nameEn || null,
      descriptionAr: (cat as any).descriptionAr || null,
      descriptionEn: (cat as any).descriptionEn || null,
    } as any))

  return {
    id: draft.id || 0,
    groomId: draft.groomId || null,
    brideId: draft.brideId || null,
    weddingPlannerId: undefined,
    bookType: draft.bookType as any,
    bookClass: draft.bookClass as any,
    title: draft.title || null,
    clientName: null,
    weddingDate: null,
    eventLocation: null,
    lines,
    lineCategories,
    initialEstimated: draft.initialEstimated || draft.estimated || 0,
  }
}

/**
 * Generate temporary ID for new items
 */
export const generateTempId = (): number => {
  // Use negative timestamp to ensure uniqueness and indicate it's temporary
  return -Date.now()
}

