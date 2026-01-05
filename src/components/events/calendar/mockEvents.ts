import { EventStatus } from '@/components/ui/CalendarEventBlock'

export interface MockEvent {
  id: string
  title: string
  customerName: string
  status: EventStatus
  timeRange: string
  startHour: number
  startMinute: number
  durationHours: number
  durationMinutes: number
  date: Date
}

/**
 * Get events for a specific date
 */
export const getEventsForDate = (date: Date): MockEvent[] => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  const allEvents: MockEvent[] = [
    // Day 3 events
    {
      id: 'day3-1',
      title: 'Hair Styling',
      customerName: 'Sara Ali',
      status: 'confirmed',
      timeRange: '11:00AM-1:00PM',
      startHour: 11,
      startMinute: 0,
      durationHours: 2,
      durationMinutes: 0,
      date: new Date(year, month, 3),
    },
    {
      id: 'day3-2',
      title: 'Makeup Session',
      customerName: 'Nour Hassan',
      status: 'pending',
      timeRange: '2:00PM-3:00PM',
      startHour: 14,
      startMinute: 0,
      durationHours: 1,
      durationMinutes: 0,
      date: new Date(year, month, 3),
    },
    // Day 8 events (current day)
    {
      id: 'day8-1',
      title: 'Bridal Makeup',
      customerName: 'Ahmed Ramadan',
      status: 'pending',
      timeRange: '9:00AM-10:00AM',
      startHour: 9,
      startMinute: 0,
      durationHours: 1,
      durationMinutes: 0,
      date: new Date(year, month, 8),
    },
    {
      id: 'day8-2',
      title: 'Wedding Photography',
      customerName: 'Mohamed Ibrahim',
      status: 'confirmed',
      timeRange: '10:00AM-12:00PM',
      startHour: 10,
      startMinute: 0,
      durationHours: 2,
      durationMinutes: 0,
      date: new Date(year, month, 8),
    },
    {
      id: 'day8-3',
      title: 'Hair Styling',
      customerName: 'Sara Ali',
      status: 'pending',
      timeRange: '10:30AM-11:30AM',
      startHour: 10,
      startMinute: 30,
      durationHours: 1,
      durationMinutes: 0,
      date: new Date(year, month, 8),
    },
    {
      id: 'day8-4',
      title: 'Makeup Session',
      customerName: 'Nour Hassan',
      status: 'confirmed',
      timeRange: '9:30AM-10:30AM',
      startHour: 9,
      startMinute: 30,
      durationHours: 1,
      durationMinutes: 0,
      date: new Date(year, month, 8),
    },
    {
      id: 'day8-6',
      title: 'Dress Fitting',
      customerName: 'Layla Mohamed',
      status: 'pending',
      timeRange: '11:15AM-12:45PM',
      startHour: 11,
      startMinute: 15,
      durationHours: 1,
      durationMinutes: 30,
      date: new Date(year, month, 8),
    },
    {
      id: 'day8-5',
      title: 'Bridal Consultation',
      customerName: 'Fatma Ahmed',
      status: 'canceled',
      timeRange: '2:00PM-4:00PM',
      startHour: 14,
      startMinute: 0,
      durationHours: 2,
      durationMinutes: 0,
      date: new Date(year, month, 8),
    },
    // Day 13 events
    {
      id: 'day13-1',
      title: 'Wedding Photography',
      customerName: 'Mohamed Ibrahim',
      status: 'confirmed',
      timeRange: '10:00AM-12:00PM',
      startHour: 10,
      startMinute: 0,
      durationHours: 2,
      durationMinutes: 0,
      date: new Date(year, month, 13),
    },
    {
      id: 'day13-2',
      title: 'Bridal Consultation',
      customerName: 'Fatma Ahmed',
      status: 'pending',
      timeRange: '3:00PM-4:00PM',
      startHour: 15,
      startMinute: 0,
      durationHours: 1,
      durationMinutes: 0,
      date: new Date(year, month, 13),
    },
    // Day 17 events
    {
      id: 'day17-1',
      title: 'Dress Fitting',
      customerName: 'Layla Mohamed',
      status: 'confirmed',
      timeRange: '11:00AM-1:00PM',
      startHour: 11,
      startMinute: 0,
      durationHours: 2,
      durationMinutes: 0,
      date: new Date(year, month, 17),
    },
    {
      id: 'day17-2',
      title: 'Hair Trial',
      customerName: 'Mariam Ali',
      status: 'confirmed',
      timeRange: '2:00PM-3:00PM',
      startHour: 14,
      startMinute: 0,
      durationHours: 1,
      durationMinutes: 0,
      date: new Date(year, month, 17),
    },
    // Day 29 events
    {
      id: 'day29-1',
      title: 'Final Consultation',
      customerName: 'Yasmine Hassan',
      status: 'pending',
      timeRange: '10:00AM-11:00AM',
      startHour: 10,
      startMinute: 0,
      durationHours: 1,
      durationMinutes: 0,
      date: new Date(year, month, 29),
    },
    {
      id: 'day29-2',
      title: 'Makeup Trial',
      customerName: 'Rania Mostafa',
      status: 'confirmed',
      timeRange: '1:00PM-3:00PM',
      startHour: 13,
      startMinute: 0,
      durationHours: 2,
      durationMinutes: 0,
      date: new Date(year, month, 29),
    },
  ]

  return allEvents.filter(event => {
    return (
      event.date.getDate() === day &&
      event.date.getMonth() === month &&
      event.date.getFullYear() === year
    )
  })
}

/**
 * Legacy export for backward compatibility
 */
export const mockEvents: MockEvent[] = []
