'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import authHeroImage from '@/assets/images/authHero.jpg'
import {
  EventSummaryCard,
  QuickStatsCard,
  TasksReminder,
  UpcomingBookings,
  BudgetPayments,
  GuestsInvitation,
  type Task,
  type Booking,
} from '@/components/overviews'

// Mock data
const INITIAL_ITEMS = [
  { id: 1, name: 'Sofa', iscompleted: true },
  { id: 2, name: 'Bed', iscompleted: true },
  { id: 3, name: 'Refrigerator', iscompleted: true },
  { id: 4, name: 'Gas Cooker', iscompleted: false },
  { id: 5, name: 'Washing Machine', iscompleted: true },
  { id: 6, name: 'Dining Table', iscompleted: false },
]

const createInitialServices = (): Booking[] => [
  {
    id: '1',
    title: 'Makeup Artist',
    providerUserName: 'Asmaa Mohamed',
    location: 'Olea, 6 Of October',
    date: '2025-12-12',
    time: '04:30 PM',
    status: 'pending',
    providerImage: '/placeholder-avatar.jpg',
    imageSrc: authHeroImage,
  },
  {
    id: '2',
    title: 'Photography',
    providerUserName: 'Photo Studio',
    location: 'Cairo',
    date: '2025-12-15',
    time: '10:00 AM',
    status: 'confirmed',
    providerImage: '/placeholder-avatar.jpg',
    imageSrc: authHeroImage,
  },
  {
    id: '3',
    title: 'Wedding Hall',
    providerUserName: 'Grand Venue',
    location: 'New Cairo',
    date: '2025-12-20',
    time: '06:00 PM',
    status: 'canceled',
    providerImage: '/placeholder-avatar.jpg',
    imageSrc: authHeroImage,
  },
]

const mockTasks: Task[] = [
  {
    id: '1',
    description: 'You must Go To Home & Prepare Everything For Wedding. You must Organize all items and check everything is ready.',
    dueDate: '2025-12-12',
    completed: true,
  },
  {
    id: '2',
    description: 'Finalize guest list and send invitations to all confirmed guests.',
    dueDate: '2025-12-10',
    completed: true,
  },
  {
    id: '3',
    description: 'Confirm all bookings and make final payments for services.',
    dueDate: '2025-12-15',
    completed: false,
  },
]

// Mock event data
const eventDate = new Date('2025-11-25')
const eventName = 'Aya Wedding'

export default function OverviewPage() {
  // Statistics
  const stats = useMemo(() => {
    const confirmedBookings = 2
    const totalBookings = 10
    const completedItems = INITIAL_ITEMS.filter(i => i.iscompleted).length
    const totalItems = INITIAL_ITEMS.length
    const invitedGuests = 60
    const maxGuests = 150

    return {
      bookings: { current: confirmedBookings, total: totalBookings, percentage: (confirmedBookings / totalBookings) * 100 },
      items: { current: completedItems, total: totalItems, percentage: (completedItems / totalItems) * 100 },
      guests: { current: invitedGuests, total: maxGuests, percentage: (invitedGuests / maxGuests) * 100 },
    }
  }, [])

  // Budget statistics
  const budgetStats = useMemo(() => {
    const total = 120000
    const remaining = 90000
    const paid = 30000
    const pending = 10000
    const other = 10000
    const actualRemaining = remaining - pending - other
    return { total, paid, remaining, pending, other, actualRemaining }
  }, [])

  // Budget chart data
  const budgetChartData = [
    { label: 'Remaining', value: budgetStats.actualRemaining, color: '#E5E7EB' },
    { label: 'Paid', value: budgetStats.paid, color: '#059669' },
    { label: 'Pending', value: budgetStats.pending, color: '#F59E0B' },
    { label: 'Other', value: budgetStats.other, color: '#60A5FA' },
  ]

  const upcomingBookings = createInitialServices().slice(0, 3)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
      {/* SECTION 1: Event Summary */}
      <div className="mb-6 sm:mb-8">
        <EventSummaryCard
          eventName={eventName}
          eventDate={eventDate}
          imageSrc={authHeroImage}
        />
      </div>

      {/* SECTION 2: Quick Stats Cards */}
      <div className="mb-6 sm:mb-8">
        <div className={cn('grid gap-3 sm:gap-4', 'grid-cols-1', 'sm:grid-cols-3')}>
          <QuickStatsCard
            title="Confirmed Booking"
            current={stats.bookings.current}
            total={stats.bookings.total}
            percentage={stats.bookings.percentage}
          />
          <QuickStatsCard
            title="Complete Lists"
            current={stats.items.current}
            total={stats.items.total}
            percentage={stats.items.percentage}
          />
          <QuickStatsCard
            title="Invite Your Guests"
            current={stats.guests.current}
            total={stats.guests.total}
            percentage={stats.guests.percentage}
          />
        </div>
      </div>

      {/* SECTION 3: Tasks Reminder - Full Width */}
      <div className="mb-6 sm:mb-8">
        <TasksReminder tasks={mockTasks} />
      </div>

      {/* SECTION 4: Upcoming Bookings - Full Width */}
      <div className="mb-6 sm:mb-8">
        <UpcomingBookings bookings={upcomingBookings} imageSrc={authHeroImage} />
      </div>

      {/* SECTION 5: Budget & Guests - Two Columns */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
        <BudgetPayments
          total={budgetStats.total}
          remaining={budgetStats.remaining}
          chartData={budgetChartData}
        />
        <GuestsInvitation
          invitedGuests={25}
          remainingSeats={150}
          imageSrc={authHeroImage}
        />
      </div>
    </div>
  )
}
