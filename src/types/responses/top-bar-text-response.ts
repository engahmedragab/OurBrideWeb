/**
 * Top Bar Text Response
 * Response model for Top Bar Text data
 */

import type { ScreenType, DisplayType } from '@/../client/common/api/gen/ourbride-api'

/**
 * Top Bar Text Response
 */
export interface TopBarTextResponse {
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

  // TopBarText Specific Properties
  text?: string
  textAr?: string
  textEn?: string
  screenType: ScreenType
  displayType: DisplayType
  isActive: boolean
  order: number
  startDate?: string | null
  endDate?: string | null
  backgroundColor?: string
  textColor?: string
  fontSize?: string
  fontWeight?: string
  isBold: boolean
  isItalic: boolean
  icon?: string
  link?: string
  openInNewTab: boolean
  priority: number
  customCSS?: string
  customJS?: string
  tags?: string
  views: number
  clicks: number
}

