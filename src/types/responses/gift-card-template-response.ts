/**
 * Gift Card Template Response
 */

export interface GiftCardTemplateResponse {
  id: number
  name: string | null
  backgroundImageUrl: string | null
  fontStyle: string | null
  primaryColor: string | null
  secondaryColor: string | null
  textColor: string | null
  isActive: boolean
}
