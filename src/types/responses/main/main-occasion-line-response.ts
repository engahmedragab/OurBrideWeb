/**
 * Main Occasion Line Response
 */

import type { MainLineResponse } from './main-line-response'
import type { OccasionType } from '@/../client/common/api/gen/ourbride-api'

export interface MainOccasionLineResponse extends MainLineResponse {
  date: string
  subDate?: string
  brideFirstName: string
  brideLastName: string
  groomFirstName: string
  groomLastName: string
  titleEn: string
  titleAr: string
  subTitleEn: string
  subTitleAr: string
  caption: string
  iconName: string
  colorName: string
  type?: OccasionType
}


