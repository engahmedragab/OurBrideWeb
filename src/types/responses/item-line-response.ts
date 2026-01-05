/**
 * Item Line Response
 */

import type { LineResponse } from './line-response'
import type { ItemLineCategoryResponse } from './item-line-category-response'
import type { ItemResponse } from './item-response'
import type { ReminderType, ProvidingType } from './book-enums'

export interface ItemLineResponse extends LineResponse {
  nameAr: string
  nameEn: string
  name: string
  descriptionAr: string
  descriptionEn: string
  description: string
  quantity?: number
  estimatedQuantity?: number
  price?: number
  totalPrice?: number
  advanceAmount?: number
  hasReminder: boolean
  reminderDate?: string // ISO DateTime string
  reminderText: string
  buyDate?: string // ISO DateTime string
  seller: string
  notes: string
  reminderType?: ReminderType
  providerName: string
  providerAddress: string
  providerLink: string
  providingType?: ProvidingType
  hasProvider: boolean
  budget: boolean
  iconName: string
  colorName: string
  itemLineCategory?: ItemLineCategoryResponse
  itemId: number
  item?: ItemResponse
  categoryId: number
  subCategoryId: number
  providerId?: number
}
