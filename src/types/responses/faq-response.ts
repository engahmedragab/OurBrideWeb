/**
 * FAQ Response
 * Response model for FAQ data
 */

import type { FAQType } from '@/../client/common/api/gen/ourbride-api'

/**
 * FAQ Response
 */
export interface FAQResponse {
  // Base Response Properties
  id: number
  isDeleted: boolean
  creationDate: string
  lastModifiedDate: string
  slug?: string

  // Base Lookup Response Properties
  nameAr?: string
  nameEn?: string
  descriptionAr?: string
  descriptionEn?: string

  // FAQ Specific Properties
  question?: string
  questionAr?: string
  questionEn?: string
  answer?: string
  answerAr?: string
  answerEn?: string
  order: number
  isActive: boolean
  type: FAQType
  tags?: string
}

