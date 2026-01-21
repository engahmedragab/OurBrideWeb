/**
 * Mappers for BudgetBook (Budget)
 */
import type { BudgetBookDraft } from '@/hooks/planning/bookDrafts'
import type { BudgetBookRequest, BudgetLineRequest, BudgetLineCategoryRequest } from '@/../client/common/api/gen/ourbride-api'

export const convertLineToRequest = (line: Record<string, unknown>, bookId: number): BudgetLineRequest => {
  const localCategoryId: number | null = (line.lineCategoryId as number | null | undefined) ?? null
  return {
    id: (line.id as number | null | undefined) ?? null,
    isDone: (line.isDone as boolean | undefined) ?? false,
    isFavorite: (line.isFavorite as boolean | undefined) ?? false,
    isDeleted: (line.isDeleted as boolean | undefined) ?? false,
    isModelLine: (line.isModelLine as boolean | undefined) ?? false,
    brideId: (line.brideId as string | null | undefined) ?? null,
    groomId: (line.groomId as string | null | undefined) ?? null,
    bookId: (line.bookId as number | undefined) ?? bookId,
    lineCategoryId: localCategoryId ?? null,
    lineCategoryCountId: (line.lineCategoryCountId as number | null | undefined) ?? null,
    lineCategorySlug: (line.lineCategorySlug as string | null | undefined) ?? null,
    creationDate: (line.creationDate as string | null | undefined) ?? null,
    lastModifiedDate: (line.lastModifiedDate as string | null | undefined) ?? null,
    expense: (line.expense as string | null | undefined) ?? null,
    estimated: (line.estimated as number | null | undefined) ?? null,
    paid: (line.paid as number | null | undefined) ?? null,
    final: (line.final as number | null | undefined) ?? null,
    dueDate: (line.dueDate as string | null | undefined) ?? null,
    count: (line.count as number | null | undefined) ?? null,
    payer: (line.payer as string | null | undefined) ?? null,
    note: (line.note as string | null | undefined) ?? null,
    iconName: (line.iconName as string | null | undefined) ?? null,
    colorName: (line.colorName as string | null | undefined) ?? null,
  }
}

export const convertCategoryToRequest = (category: Record<string, unknown>): BudgetLineCategoryRequest => {
  return {
    id: (category.id as number | null | undefined) ?? null,
    name: (category.name as string | null | undefined) ?? null,
    description: (category.description as string | null | undefined) ?? null,
    slug: (category.slug as string | null | undefined) ?? null,
    count_id: (category.count_id as number | null | undefined) ?? null,
    isDeleted: (category.isDeleted as boolean | undefined) ?? false,
    isModelLine: (category.isModelLine as boolean | undefined) ?? false,
    creationDate: (category.creationDate as string | null | undefined) ?? null,
    lastModifiedDate: (category.lastModifiedDate as string | null | undefined) ?? null,
    iconName: (category.iconName as string | null | undefined) ?? null,
    colorName: (category.colorName as string | null | undefined) ?? null,
  }
}

/**
 * Build BudgetBookRequest from local state
 * Includes all lines and categories (including deleted ones) for sync
 */
export const buildBudgetBookRequestFromLocal = (draft: BudgetBookDraft): BudgetBookRequest => {
  const now = new Date().toISOString()
  const d = draft as Record<string, unknown>

  const findCategoryByLocalId = (localId: number | null | undefined) => {
    if (localId == null) return null
    return (Array.isArray(d.lineCategories) ? d.lineCategories : []).find((c: Record<string, unknown>) => (c.id as number) === localId) ?? null
  }

  const lineCategories = (Array.isArray(d.lineCategories) ? d.lineCategories : []).map((c: Record<string, unknown>) => {
    return {
      id: (c.id as number | null | undefined) ?? null,

      name: (c.name as string | undefined) ?? '',
      nameAr: (c.nameAr as string | undefined) ?? (c.name as string | undefined) ?? '',
      nameEn: (c.nameEn as string | undefined) ?? (c.name as string | undefined) ?? '',

      description: (c.description as string | null | undefined) ?? null,
      descriptionAr: (c.descriptionAr as string | null | undefined) ?? (c.description as string | null | undefined) ?? null,
      descriptionEn: (c.descriptionEn as string | null | undefined) ?? (c.description as string | null | undefined) ?? null,

      estimated: (c.estimated as number | undefined) ?? 0,
      pending: (c.pending as number | null | undefined) ?? null,
      paid: (c.paid as number | null | undefined) ?? null,
      final: (c.final as number | null | undefined) ?? null,
      count: (c.count as number | null | undefined) ?? null,

      iconName: (c.iconName as string | null | undefined) ?? null,
      colorName: (c.colorName as string | null | undefined) ?? null,

      slug: (c.slug as string | null | undefined) ?? null,
      count_id: (c.count_id as number | null | undefined) ?? null,

      isDeleted: (c.isDeleted as boolean | undefined) ?? false,
      isModelLine: (c.isModelLine as boolean | undefined) ?? false,
      creationDate: (c.creationDate as string | undefined) ?? now,
      lastModifiedDate: (c.lastModifiedDate as string | undefined) ?? now,
    }
  })

  const lines = (Array.isArray(d.lines) ? d.lines : []).map((l: Record<string, unknown>) => {
    const localCategoryId: number | null = (l.lineCategoryId as number | null | undefined) ?? null
    const category = findCategoryByLocalId(localCategoryId)

    const payloadLineCategoryId = localCategoryId ?? null
    const payloadLineCategoryCountId = (l.lineCategoryCountId as number | null | undefined) ?? ((category as Record<string, unknown>)?.count_id as number | null | undefined) ?? null
    const payloadLineCategorySlug = (l.lineCategorySlug as string | null | undefined) ?? ((category as Record<string, unknown>)?.slug as string | null | undefined) ?? null

    return {
      id: (l.id as number | null | undefined) ?? null,

      isDone: (l.isDone as boolean | undefined) ?? false,
      isFavorite: (l.isFavorite as boolean | undefined) ?? false,
      isDeleted: (l.isDeleted as boolean | undefined) ?? false,
      isModelLine: (l.isModelLine as boolean | undefined) ?? false,

      brideId: (l.brideId as string | null | undefined) ?? (d.brideId as string | null | undefined) ?? null,
      groomId: (l.groomId as string | null | undefined) ?? (d.groomId as string | null | undefined) ?? null,

      bookId: (d.id as number | undefined) ?? (l.bookId as number | undefined) ?? 0,

      lineCategoryId: payloadLineCategoryId,
      lineCategoryCountId: payloadLineCategoryCountId,
      lineCategorySlug: payloadLineCategorySlug,

      creationDate: (l.creationDate as string | undefined) ?? now,
      lastModifiedDate: (l.lastModifiedDate as string | undefined) ?? now,

      expense: (l.expense as string | undefined) ?? '',
      expenseAr: (l.expenseAr as string | undefined) ?? (l.expense as string | undefined) ?? '',
      expenseEn: (l.expenseEn as string | undefined) ?? (l.expense as string | undefined) ?? '',

      estimated: (l.estimated as number | undefined) ?? 0,
      paid: (l.paid as number | undefined) ?? 0,
      final: (l.final as number | null | undefined) ?? null,

      dueDate: (l.dueDate as string | null | undefined) ?? null,
      count: (l.count as number | null | undefined) ?? null,

      payer: (l.payer as string | null | undefined) ?? null,
      note: (l.note as string | null | undefined) ?? null,

      iconName: (l.iconName as string | null | undefined) ?? null,
      colorName: (l.colorName as string | null | undefined) ?? null,
    }
  })

  if (!d.id || (d.id as number) <= 0) {
    throw new Error('Invalid budget book id. Make sure the book is initialized and fetched first.')
  }

  return {
    id: d.id as number,

    groomId: (d.groomId as string | null | undefined) ?? null,
    brideId: (d.brideId as string | null | undefined) ?? null,
    weddingPlannerId: (d.weddingPlannerId as string | null | undefined) ?? null,

    bookType: d.bookType,
    bookClass: d.bookClass,

    title: (d.title as string | null | undefined) ?? null,
    clientName: (d.clientName as string | null | undefined) ?? null,
    weddingDate: (d.weddingDate as string | null | undefined) ?? null,
    eventLocation: (d.eventLocation as string | null | undefined) ?? null,

    lines,
    lineCategories,

    lastModifiedDate: now,
    initialEstimated: (d.initialEstimated as number | null | undefined) ?? null,
  } as BudgetBookRequest
}
