/**
 * Provider Public Profile Settings Response
 */

export interface ProviderPublicProfileSettingsResponse {
  id: number
  providerId: number
  isPublicProfileEnabled: boolean
  publicProfileSlug: string | null
  showName: boolean
  showDescription: boolean
  showPhoneNumber: boolean
  showAddress: boolean
  showBranches: boolean
  showServices: boolean
  showProducts: boolean
  showReviews: boolean
  showRatings: boolean
  showLinks: boolean
  showWorkingHours: boolean
  showPaymentMethods: boolean
  showVerificationBadge: boolean
  publicDescriptionAr: string | null
  publicDescriptionEn: string | null
  publicBannerImageUrl: string | null
  publicLogoImageUrl: string | null
  seoMetaTitle: string | null
  seoMetaDescription: string | null
}



