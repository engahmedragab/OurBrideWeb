/**
 * Base response types - shared across all features
 */

export interface BaseResponse {
  id: number
  isDeleted: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
  slug: string
}

export interface BaseEntityResponse extends BaseResponse {
  // Currently empty, but extends BaseResponse
}

export interface BaseLookupResponse extends BaseEntityResponse {
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
}
