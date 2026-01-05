/**
 * Occasion Line Response
 */

import type { LineResponse } from './line-response'
import type { OccasionType } from '@/../client/common/api/gen/ourbride-api'

export interface OccasionLineResponse extends LineResponse {
  date: string // ISO DateTime string
  subDate?: string // ISO DateTime string
  brideFirstName: string
  brideLastName: string
  groomFirstName: string
  groomLastName: string
  titleEn: string
  titleAr: string
  title: string
  subTitleEn: string
  subTitleAr: string
  subTitle: string
  caption: string
  iconName: string
  colorName: string
  type?: OccasionType
}
