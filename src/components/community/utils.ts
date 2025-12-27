import type {
  PostResponse,
  BlogResponse,
  ArticleResponse,
  ReelResponse,
  DecisionGroupResponse,
  LeaderboardContestResponse,
  UserResponse,
} from '@/types/responses/community'

// Helper function to format date
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Helper function to format date (short version)
export const formatDateShort = (dateString: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Helper function to get user display name
export const getUserDisplayName = (user: UserResponse | null, fallback?: string): string => {
  if (!user) return fallback || 'Anonymous'
  
  // Handle null/undefined firstName and lastName
  const firstName = user.firstName || ''
  const lastName = user.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()
  
  return fullName || user.userName || fallback || 'Anonymous'
}

// Helper function to get user avatar
export const getUserAvatar = (user: UserResponse | null): string => {
  if (!user) return 'https://via.placeholder.com/100'
  return user.profileUrl || 'https://via.placeholder.com/100'
}

// Helper function to format duration
export const formatDuration = (seconds: number | null): string => {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Helper function to get profile URL
// Uses query parameters instead of dynamic route to work with static export
export const getProfileUrl = (userId: string | null | undefined, userType?: string | null): string | null => {
  if (!userId) return null
  
  // Check if user type is Provider, otherwise default to User
  const type = userType === 'Provider' ? 'Provider' : 'User'
  return `/community/profile?id=${userId}&type=${type}`
}





