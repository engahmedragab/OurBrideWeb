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
  if (!user) return fallback || 'OurBride'
  
  // Handle null/undefined firstName and lastName - check for null/undefined explicitly
  const firstName = (user.firstName && user.firstName !== 'null') ? user.firstName : ''
  const lastName = (user.lastName && user.lastName !== 'null') ? user.lastName : ''
  const fullName = `${firstName} ${lastName}`.trim()
  
  // If we have a full name, use it
  if (fullName) return fullName
  
  // If userName is admin@our-bride.com, display as OurBride
  if (user.userName && user.userName.toLowerCase() === 'admin@our-bride.com') {
    return 'OurBride'
  }
  
  return user.userName || fallback || 'OurBride'
}

// Helper function to get user avatar
export const getUserAvatar = (user: UserResponse | null): string | null => {
  if (!user || !user.profileUrl) return null
  return user.profileUrl
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





