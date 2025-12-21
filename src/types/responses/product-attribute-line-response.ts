/**
 * Product Attribute Line Response
 */

export interface ProductAttributeLineResponse {
  id: number | null
  name: string | null
  options: string[] | null
  position: number | null
  visible: boolean | null
  variation: boolean | null
}
