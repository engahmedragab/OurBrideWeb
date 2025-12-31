import { GetBudgetBookResponse } from '@/services/api/budgetBooks.types'
import type {
  BudgetLineResponse,
  BudgetLineCategoryResponse,
  BudgetBookResponse,
} from '@/types/responses'
// لو عندك BudgetBookRequest من gen استورديه بدل any
// import type { BudgetBookRequest } from '@/../client/common/api/gen/ourbride-api'

export type BudgetBookDraft = {
  id?: number
  bookType: any
  bookClass: any
  initialEstimated?: number | null // ✅ budget من المستخدم
  estimated?: number | null        // ✅ مجموع lines (مش input)
  lines?: BudgetLineResponse[]
  lineCategories?: BudgetLineCategoryResponse[]
}

export const generateTempId = () => Math.floor(Date.now() + Math.random() * 1000)

export function mapApiToDraft(api: GetBudgetBookResponse | null): BudgetBookDraft | null {
  if (!api) return null

  return {
    id: api.id,
    bookType: api.bookType,
    bookClass: api.bookClass,
    // ✅ هنا المفتاح: budget ييجي من initialEstimated
    initialEstimated: api.initialEstimated ?? 0,
    // ✅ estimated ده مجموع المصروفات اللي راجع من السيرفر
    estimated: api.estimated ?? 0,
    lineCategories: (api.lineCategories || []) as any,
    lines: (api.lines || []).map((l: any) => ({
      ...l,
      // لو API ساعات بيرجع category جوه line
      lineCategoryId: l.lineCategoryId ?? l.budgetLineCategory?.id ?? null,
    })) as any,
  }
}

export function mapDraftToSyncPayload(draft: BudgetBookDraft) {
  const lines = (draft.lines || []).map(l => ({
    id: l.id,
    bookId: (draft.id || l.bookId || 0),
    expense: l.expense,
    expenseAr: l.expenseAr ?? l.expense ?? '',
    expenseEn: l.expenseEn ?? l.expense ?? '',
    lineCategoryId: l.lineCategoryId ?? null,

    estimated: Number(l.estimated) || 0,
    paid: Number(l.paid) || 0,
    final: Number(l.final) || 0,

    count: Number(l.count) || 0,
    payer: l.payer ?? null,
    note: l.note ?? null,

    isDone: !!l.isDone,
    isFavorite: !!l.isFavorite,
    isDeleted: !!l.isDeleted,
    isModelLine: !!l.isModelLine,

    iconName: l.iconName ?? null,
    colorName: l.colorName ?? null,

    dueDate: l.dueDate ?? '0001-01-01T00:00:00',
    lineType: l.lineType,
    bookClass: l.bookClass,
    slug: l.slug ?? '',
    createdBy: l.createdBy ?? '',
    lastModifiedBy: l.lastModifiedBy ?? '',
    creationDate: l.creationDate ?? new Date().toISOString(),
    lastModifiedDate: l.lastModifiedDate ?? new Date().toISOString(),
  }))

  const lineCategories = (draft.lineCategories || []).map(c => ({
    id: c.id,
    name: c.name,
    nameAr: c.nameAr ?? c.name ?? '',
    nameEn: c.nameEn ?? c.name ?? '',
    description: c.description ?? null,
    descriptionAr: c.descriptionAr ?? c.description ?? null,
    descriptionEn: c.descriptionEn ?? c.description ?? null,

    iconName: c.iconName ?? '',
    colorName: c.colorName ?? '',
    isDeleted: !!c.isDeleted,
    isModelLine: !!c.isModelLine,
    slug: c.slug ?? null,
    createdBy: c.createdBy ?? '',
    lastModifiedBy: c.lastModifiedBy ?? '',
    creationDate: c.creationDate ?? new Date().toISOString(),
    lastModifiedDate: c.lastModifiedDate ?? new Date().toISOString(),

    // ⚠️ مهم: ما تبعتش totals المحسوبة (estimated/paid/pending) لو السيرفر هو اللي بيحسبها
  }))
  




  
  // ✅ estimated الحقيقي كمصروفات (اختياري تبعًا للـ API) — محسوب من lines
  const computedEstimated = lines
    .filter(l => !l.isDeleted)
    .reduce((sum, l) => sum + (Number(l.estimated) || 0), 0)

  return {
    id: draft.id,
    bookType: draft.bookType,
    bookClass: draft.bookClass,

    // ✅ ده اللي كان ناقصك غالبًا (عشان initialEstimated عندك راجع null)
    initialEstimated: Number(draft.initialEstimated) || 0,

    // ✅ سيبيه computed (مش input budget)
    estimated: computedEstimated,

    lineCategories,
    lines,
  } /* satisfies BudgetBookRequest */
}
