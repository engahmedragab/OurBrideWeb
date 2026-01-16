/**
 * Mappers for BudgetBook (Budget)
 */
import type { BudgetBookDraft } from '@/hooks/planning/bookDrafts'
import type { BudgetBookRequest, BudgetLineRequest, BudgetLineCategoryRequest } from '@/../client/common/api/gen/ourbride-api'

export const convertLineToRequest = (line: any, bookId: number): BudgetLineRequest => {
  const localCategoryId: number | null = line.lineCategoryId ?? null
  return {
    id: line.id ?? null,
    isDone: line.isDone ?? false,
    isFavorite: line.isFavorite ?? false,
    isDeleted: line.isDeleted ?? false,
    isModelLine: line.isModelLine ?? false,
    brideId: line.brideId ?? null,
    groomId: line.groomId ?? null,
    bookId: line.bookId ?? bookId,
    lineCategoryId: localCategoryId ?? null,
    lineCategoryCountId: line.lineCategoryCountId ?? null,
    lineCategorySlug: line.lineCategorySlug ?? null,
    creationDate: line.creationDate ?? null,
    lastModifiedDate: line.lastModifiedDate ?? null,
    expense: line.expense ?? null,
    estimated: line.estimated ?? null,
    paid: line.paid ?? null,
    final: line.final ?? null,
    dueDate: line.dueDate ?? null,
    count: line.count ?? null,
    payer: line.payer ?? null,
    note: line.note ?? null,
    iconName: line.iconName ?? null,
    colorName: line.colorName ?? null,
  }
}

export const convertCategoryToRequest = (category: any): BudgetLineCategoryRequest => {
  return {
    id: category.id ?? null,
    name: category.name ?? null,
    description: category.description ?? null,
    slug: category.slug ?? null,
    count_id: category.count_id ?? null,
    isDeleted: category.isDeleted ?? false,
    isModelLine: category.isModelLine ?? false,
    creationDate: category.creationDate ?? null,
    lastModifiedDate: category.lastModifiedDate ?? null,
    iconName: category.iconName ?? null,
    colorName: category.colorName ?? null,
  }
}

/**
 * Build BudgetBookRequest from local state
 * Includes all lines and categories (including deleted ones) for sync
 */
export const buildBudgetBookRequestFromLocal = (draft: BudgetBookDraft): BudgetBookRequest => {
  const now = new Date().toISOString()
  const d: any = draft as any

  const findCategoryByLocalId = (localId: number | null | undefined) => {
    if (localId == null) return null
    return (d.lineCategories || []).find((c: any) => c.id === localId) ?? null
  }

  const lineCategories = (d.lineCategories || []).map((c: any) => {
    return {
      id: c.id ?? null,

      name: c.name ?? '',
      nameAr: c.nameAr ?? c.name ?? '',
      nameEn: c.nameEn ?? c.name ?? '',

      description: c.description ?? null,
      descriptionAr: c.descriptionAr ?? c.description ?? null,
      descriptionEn: c.descriptionEn ?? c.description ?? null,

      estimated: c.estimated ?? 0,
      pending: c.pending ?? null,
      paid: c.paid ?? null,
      final: c.final ?? null,
      count: c.count ?? null,

      iconName: c.iconName ?? null,
      colorName: c.colorName ?? null,

      slug: c.slug ?? null,
      count_id: c.count_id ?? null,

      isDeleted: c.isDeleted ?? false,
      isModelLine: c.isModelLine ?? false,
      creationDate: c.creationDate ?? now,
      lastModifiedDate: c.lastModifiedDate ?? now,
    }
  })

  const lines = (d.lines || []).map((l: any) => {
    const localCategoryId: number | null = l.lineCategoryId ?? null
    const category = findCategoryByLocalId(localCategoryId)

    const payloadLineCategoryId = localCategoryId ?? null
    const payloadLineCategoryCountId = l.lineCategoryCountId ?? category?.count_id ?? null
    const payloadLineCategorySlug = l.lineCategorySlug ?? category?.slug ?? null

    return {
      id: l.id ?? null,

      isDone: l.isDone ?? false,
      isFavorite: l.isFavorite ?? false,
      isDeleted: l.isDeleted ?? false,
      isModelLine: l.isModelLine ?? false,

      brideId: l.brideId ?? d.brideId ?? null,
      groomId: l.groomId ?? d.groomId ?? null,

      bookId: d.id ?? l.bookId ?? 0,

      lineCategoryId: payloadLineCategoryId,
      lineCategoryCountId: payloadLineCategoryCountId,
      lineCategorySlug: payloadLineCategorySlug,

      creationDate: l.creationDate ?? now,
      lastModifiedDate: l.lastModifiedDate ?? now,

      expense: l.expense ?? '',
      expenseAr: l.expenseAr ?? l.expense ?? '',
      expenseEn: l.expenseEn ?? l.expense ?? '',

      estimated: l.estimated ?? 0,
      paid: l.paid ?? 0,
      final: l.final ?? null,

      dueDate: l.dueDate ?? null,
      count: l.count ?? null,

      payer: l.payer ?? null,
      note: l.note ?? null,

      iconName: l.iconName ?? null,
      colorName: l.colorName ?? null,
    }
  })

  if (!d.id || d.id <= 0) {
    throw new Error('Invalid budget book id. Make sure the book is initialized and fetched first.')
  }

  return {
    id: d.id,

    groomId: d.groomId ?? null,
    brideId: d.brideId ?? null,
    weddingPlannerId: d.weddingPlannerId ?? null,

    bookType: d.bookType,
    bookClass: d.bookClass,

    title: d.title ?? null,
    clientName: d.clientName ?? null,
    weddingDate: d.weddingDate ?? null,
    eventLocation: d.eventLocation ?? null,

    lines,
    lineCategories,

    lastModifiedDate: now,
    initialEstimated: d.initialEstimated ?? null,
  } as any as BudgetBookRequest
}
