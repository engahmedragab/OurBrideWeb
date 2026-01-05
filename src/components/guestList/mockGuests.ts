export type GuestSide = 'bride' | 'groom'
export type GuestStatus = 'confirmed' | 'none'
export type GuestGroupId = string

export interface Guest {
  id: string
  side: GuestSide
  groupId: GuestGroupId
  name: string
  peopleCount: number
  registeredAt: string // ISO date string (yyyy-mm-dd)
  status: GuestStatus
  selected: boolean
  clientId?: string
}

export interface GuestGroup {
  id: GuestGroupId
  title: string
}

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
