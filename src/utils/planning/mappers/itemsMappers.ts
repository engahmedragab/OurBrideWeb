/**
 * Mappers for ItemBook (Items)
 */
import type { ItemLineResponse, ItemBookResponse, ItemLineCategoryResponse } from '@/types/responses'
import type { ItemBookRequest, ItemLineRequest, ItemLineCategoryRequest, BookClass, UserType } from '@/../client/common/api/gen/ourbride-api'

export type UiItem = {
  id: number
  title: string
  description: string | null
  quantity: number
  totalPrice: number
  providerName: string
  buyDate: string
  categoryId: number
  categoryName: string
  isDone: boolean
  isDeleted: boolean
}

export type UiCategory = {
  id: number
  name: string
  color?: string
}

/**
 * Convert ItemLineResponse to ItemLineRequest
 */
export const convertLineToRequest = (line: ItemLineResponse, bookId: number): ItemLineRequest => {
  const lineAny = line as unknown as Record<string, unknown>
  return {
    id: line.id ?? null,
    bookId: line.bookId ?? bookId,
    lineCategoryId: line.lineCategoryId ?? null,
    lineCategoryCountId: (lineAny.lineCategoryCountId as number | null | undefined) ?? null,
    lineCategorySlug: (lineAny.lineCategorySlug as string | null | undefined) ?? null,
    name: line.name || line.nameEn || line.nameAr || null,
    description: line.description || line.descriptionEn || line.descriptionAr || null,
    quantity: line.quantity ?? null,
    estimatedQuantity: (lineAny.estimatedQuantity as number | null | undefined) ?? null,
    price: line.price ?? null,
    totalPrice: line.totalPrice ?? null,
    hasReminder: line.hasReminder ?? false,
    buyDate: line.buyDate ?? null,
    seller: line.seller ?? null,
    notes: line.notes ?? null,
    reminderType: line.reminderType != null ? (line.reminderType as unknown as ItemLineRequest['reminderType']) : undefined,
    providerName: line.providerName ?? null,
    providerAddress: line.providerAddress ?? null,
    providerLink: line.providerLink ?? null,
    providingType: line.providingType != null ? (line.providingType as unknown as ItemLineRequest['providingType']) : undefined,
    reminderDate: line.reminderDate ?? null,
    reminderText: line.reminderText ?? null,
    itemId: line.itemId ?? null,
    categoryId: line.categoryId ?? null,
    subCategoryId: line.subCategoryId ?? null,
    advanceAmount: line.advanceAmount ?? null,
    hasProvider: line.hasProvider ?? false,
    budget: line.budget ?? false,
    iconName: line.iconName ?? null,
    colorName: line.colorName ?? null,
    isDone: line.isDone ?? false,
    isFavorite: line.isFavorite ?? false,
    isDeleted: line.isDeleted ?? false,
    isModelLine: line.isModelLine ?? false,
    brideId: line.brideId ?? null,
    groomId: line.groomId ?? null,
    creationDate: line.creationDate ?? null,
    lastModifiedDate: line.lastModifiedDate ?? null,
  }
}

/**
 * Convert ItemLineCategoryResponse to ItemLineCategoryRequest
 */
export const convertCategoryToRequest = (category: ItemLineCategoryResponse): ItemLineCategoryRequest => {
  const catAny = category as unknown as Record<string, unknown>
  return {
    id: category.id ?? null,
    name: category.name || category.nameEn || category.nameAr || null,
    description: category.description ?? null,
    slug: category.slug ?? null,
    count_id: (catAny.count_id as number | null | undefined) ?? null,
    isDeleted: category.isDeleted ?? false,
    isModelLine: category.isModelLine ?? false,
    creationDate: category.creationDate ?? null,
    lastModifiedDate: category.lastModifiedDate ?? null,
    iconName: category.iconName ?? null,
    colorName: category.colorName ?? null,
  }
}

/**
 * Convert ItemLineResponse to UiItem
 */
export const convertLineToUiItem = (line: ItemLineResponse, categoryName: string): UiItem => {
  return {
    id: line.id,
    title: line.name || line.nameEn || line.nameAr || '',
    description: line.description || line.descriptionEn || line.descriptionAr || null,
    quantity: line.quantity ?? 0,
    totalPrice: line.totalPrice ?? line.price ?? 0,
    providerName: line.providerName || '',
    buyDate: line.buyDate || '',
    categoryId: line.lineCategoryId || 0,
    categoryName: categoryName,
    isDone: line.isDone || false,
    isDeleted: line.isDeleted || false,
  }
}

/**
 * Convert UiItem to ItemLineRequest
 */
export const convertUiItemToLineRequest = (item: UiItem, localItemBook: ItemBookResponse): ItemLineRequest => {
  if (!localItemBook?.id) {
    throw new Error('Item book not found')
  }

  // Find the original line to preserve all fields
  const originalLine = (localItemBook.lines || []).find(l => l.id === item.id)
  const originalLineAny = originalLine as unknown as Record<string, unknown>
  const category = (localItemBook.lineCategories || []).find(c => c.id === item.categoryId)
  const categoryAny = category as unknown as Record<string, unknown>

  return {
    id: item.id,
    bookId: localItemBook.id,
    name: item.title,
    description: item.description || null,
    quantity: item.quantity || null,
    totalPrice: item.totalPrice || null,
    providerName: item.providerName || null,
    buyDate: item.buyDate || null,
    lineCategoryId: item.categoryId ?? null,
    lineCategoryCountId: (originalLineAny?.lineCategoryCountId as number | null | undefined) ?? (categoryAny?.count_id as number | null | undefined) ?? null,
    lineCategorySlug: (originalLineAny?.lineCategorySlug as string | null | undefined) ?? category?.slug ?? null,
    isDone: item.isDone || false,
    isFavorite: originalLine?.isFavorite || false,
    isDeleted: item.isDeleted || false,
    isModelLine: originalLine?.isModelLine || false,
    brideId: originalLine?.brideId || null,
    groomId: originalLine?.groomId || null,
    creationDate: originalLine?.creationDate || new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
    // Preserve other fields from original line
    hasReminder: originalLine?.hasReminder || false,
    reminderText: originalLine?.reminderText || null,
    seller: originalLine?.seller || null,
    notes: originalLine?.notes || null,
    providerAddress: originalLine?.providerAddress || null,
    providerLink: originalLine?.providerLink || null,
    itemId: originalLine?.itemId || null,
    categoryId: originalLine?.categoryId || null,
    subCategoryId: originalLine?.subCategoryId || null,
    iconName: originalLine?.iconName || null,
    colorName: originalLine?.colorName || null,
  }
}

/**
 * Convert ItemLineCategoryResponse to UiCategory
 */
export const convertCategoryToUi = (category: ItemLineCategoryResponse): UiCategory => {
  return {
    id: category.id,
    name: category.name || category.nameEn || category.nameAr || '',
    color: category.colorName || undefined,
  }
}

/**
 * Build ItemBookRequest from local state
 * Includes all lines and categories (including deleted ones) for sync
 */
export const buildBookRequestFromLocal = (localItemBook: ItemBookResponse): ItemBookRequest => {
  if (!localItemBook) {
    throw new Error('Item book not found')
  }

  // Include ALL lines (including deleted) for sync
  const allLines = (localItemBook.lines || []).map(line =>
    convertUiItemToLineRequest(convertLineToUiItem(line, ''), localItemBook)
  )

  // Include ALL categories (including deleted) for sync
  const allCategories: ItemLineCategoryRequest[] = (localItemBook.lineCategories || []).map(cat => {
    const catAny = cat as unknown as Record<string, unknown>
    return {
      id: cat.id ?? null,
      name: cat.name ?? null,
      nameAr: (catAny.nameAr as string | null | undefined) ?? null,
      nameEn: (catAny.nameEn as string | null | undefined) ?? null,
      description: cat.description ?? null,
      descriptionAr: (catAny.descriptionAr as string | null | undefined) ?? null,
      descriptionEn: (catAny.descriptionEn as string | null | undefined) ?? null,
      slug: cat.slug ?? null,
      count_id: (catAny.count_id as number | null | undefined) ?? null,
      isDeleted: cat.isDeleted ?? false,
      isModelLine: cat.isModelLine ?? false,
      creationDate: cat.creationDate ?? new Date().toISOString(),
      lastModifiedDate: cat.lastModifiedDate ?? new Date().toISOString(),
      iconName: cat.iconName ?? null,
      colorName: cat.colorName ?? null,
    }
  })

  return {
    id: localItemBook.id,
    groomId: localItemBook.groomId || null,
    brideId: localItemBook.brideId || null,
    weddingPlannerId: undefined,
    bookType: (localItemBook.bookType as unknown) as UserType | undefined,
    bookClass: localItemBook.bookClass as unknown as BookClass | undefined,
    title: localItemBook.title || null,
    clientName: null,
    weddingDate: null,
    eventLocation: null,
    lines: allLines,
    lineCategories: allCategories.length > 0 ? allCategories : null,
    lastModifiedDate: new Date().toISOString(),
  }
}
