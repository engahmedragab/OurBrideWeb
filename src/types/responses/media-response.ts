/**
 * Media Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'

export interface MediaResponse extends BaseLookupResponse {
  sourceId: number
  source: number // Source enum
  providerId: number | null
  branchId: number | null
  staffId: string | null // Guid
  userId: string | null // Guid
  scopeLevel: number // TenantScopeLevel enum
  isGlobal: boolean
  isInherited: boolean
  parentId: number | null
  alt: string
  size: number | null
  fileId: string
  fileName: string
  fileExtension: string
  mimeType: string
  url: string
  thumbnailUrl: string
  previewUrl: string
  originalUrl: string
  mediaType: number // MediaType enum
  width: number | null
  height: number | null
  duration: number | null
  resolution: string
  quality: string
  status: number // CommonEntityStatus enum
  isPublic: boolean
  isFeatured: boolean
  isDownloadable: boolean
}
