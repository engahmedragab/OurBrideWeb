export interface InvitationTemplateProps {
  brideName: string
  groomName: string
  guestName?: string
  weddingDate?: string | null
  engagementDate?: string | null
  hennaDate?: string | null
  crownDate?: string | null
  weddinghole?: string | null
  weddingAddress?: string | null
  area?: string | null
  mapsLink?: string | null
  numberOfGuests?: number
  /** preview mode = smaller card for template browser */
  preview?: boolean
}

export interface TemplateInfo {
  id: number
  name: string
  nameAr: string
  category: 'classic' | 'modern' | 'floral' | 'luxury' | 'minimalist' | 'cultural' | 'playful'
  colors: { primary: string; secondary: string; accent: string }
}

export const formatInvDate = (date?: string | null) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatInvTime = (date?: string | null) => {
  if (!date) return null
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
