/**
 * Event Line Response
 */

import type { LineResponse } from './line-response'
import type { EventLineCategoryResponse } from './event-line-category-response'

export interface EventLineResponse extends LineResponse {
  time: string // ISO DateTime string
  duration: string
  name: string
  nameAr: string
  nameEn: string
  desctiption: string
  desctiptionAr: string
  desctiptionEn: string
  highlighted: boolean
  eventLineCategory?: EventLineCategoryResponse
}


