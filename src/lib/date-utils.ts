/**
 * Safe date utilities to avoid timezone issues
 * Always use local dates, never ISO string parsing for date-only operations
 */

/**
 * Safely parse a date string (YYYY-MM-DD) to a local Date object
 * Uses midday (12:00) to avoid DST edge cases
 */
export const parseDateSafe = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0)
}

/**
 * Format a Date to YYYY-MM-DD string
 */
export const formatDateSafe = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Check if two dates are the same day (ignoring time)
 * Uses year, month, and day comparison to avoid timezone issues
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Get today's date as a safe local date (midday to avoid DST)
 */
export const getToday = (): Date => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0)
}

/**
 * Get weekday short name (e.g. SUN, MON, TUE) in uppercase
 * Uses local date to ensure correct weekday
 */
export const getWeekdayShort = (date: Date): string => {
  const safeDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0
  )
  return safeDate
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase()
}
