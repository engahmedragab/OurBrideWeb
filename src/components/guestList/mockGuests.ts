export type GuestSide = 'bride' | 'groom'
export type GuestStatus = 'confirmed' | 'none'
export type GuestGroupId = string // Changed to string to support dynamic groups

export interface Guest {
  id: string
  side: GuestSide
  groupId: GuestGroupId
  name: string
  peopleCount: number
  registeredAt: string // ISO date string
  status: GuestStatus
  selected: boolean
}

export interface GuestGroup {
  id: GuestGroupId
  title: string
}

// Default groups - can be extended dynamically
export const DEFAULT_GROUPS: GuestGroup[] = [
  { id: 'friends', title: 'الاصدقاء' },
  { id: 'family', title: 'العائلة' },
  { id: 'acquaintances', title: 'المعارف' },
]

// Helper functions
export const getGuestsBySide = (guests: Guest[], side: GuestSide): Guest[] => {
  return guests.filter(guest => guest.side === side)
}

export const getGuestsByGroup = (
  guests: Guest[],
  groupId: GuestGroupId
): Guest[] => {
  return guests.filter(guest => guest.groupId === groupId)
}

export const getGroupCount = (
  guests: Guest[],
  groupId: GuestGroupId
): number => {
  return getGuestsByGroup(guests, groupId).length
}

// Get all unique groups from guests
export const getGroupsFromGuests = (guests: Guest[]): GuestGroup[] => {
  const groupMap = new Map<GuestGroupId, string>()
  
  guests.forEach(guest => {
    if (!groupMap.has(guest.groupId)) {
      // Try to find title from default groups first
      const defaultGroup = DEFAULT_GROUPS.find(g => g.id === guest.groupId)
      groupMap.set(guest.groupId, defaultGroup?.title || guest.groupId)
    }
  })
  
  return Array.from(groupMap.entries()).map(([id, title]) => ({
    id,
    title,
  }))
}

export const getTotalInvitations = (guests: Guest[]): number => {
  return guests.length
}

export const getTotalPeople = (guests: Guest[]): number => {
  return guests.reduce((sum, guest) => sum + guest.peopleCount, 0)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`
}



