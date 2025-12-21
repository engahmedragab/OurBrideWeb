/**
 * Product Image Response
 */

export interface ProductImageResponse {
  id: number | null
  dateCreated: string | null // ISO DateTime string
  src: string | null
  name: string | null
  alt: string | null
  dateCreatedGmt: string | null // ISO DateTime string
  dateModified: string | null // ISO DateTime string
  dateModifiedGmt: string | null // ISO DateTime string
  position: number | null
}
