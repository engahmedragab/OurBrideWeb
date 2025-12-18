'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Facebook, Instagram, Phone, Link as LinkIcon, Users } from 'lucide-react'
import { Checkbox } from '@/components/ui/Checkbox'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import authHeroImage from '@/assets/images/authHero.jpg'

// Mock data
const INITIAL_ITEMS = [
  { id: 1, name: 'Sofa', iscompleted: true },
  { id: 2, name: 'Bed', iscompleted: true },
  { id: 3, name: 'Refrigerator', iscompleted: true },
  { id: 4, name: 'Gas Cooker', iscompleted: false },
  { id: 5, name: 'Washing Machine', iscompleted: true },
  { id: 6, name: 'Dining Table', iscompleted: false },
]

const mockBudgetCategories = [
  { id: 'entertainment', items: [{ estimatedCost: 2000, paidAmount: 1000 }, { estimatedCost: 500, paidAmount: 300 }] },
  { id: 'beauty', items: [] },
  { id: 'cake', items: [{ estimatedCost: 2000, paidAmount: 1000 }, { estimatedCost: 500, paidAmount: 300 }] },
]

const createInitialServices = () => [
  {
    id: '1',
    title: 'Makeup Artist',
    providerUserName: 'Asmaa Mohamed',
    location: 'Olea, 6 Of October',
    date: '2025-12-12',
    time: '04:30 PM',
    status: 'pending',
    providerImage: '/placeholder-avatar.jpg',
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
  },
]

const mockTasks = [
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

// Progress Ring Component
const ProgressRing = ({ percentage, size = 60, strokeWidth = 6 }: { percentage: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#22C55E"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
    </div>
  )
}

// Donut Chart Component
const DonutChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = 35
  const circumference = 2 * Math.PI * radius
  let currentOffset = 0

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
    const strokeDashoffset = -currentOffset
    currentOffset += (percentage / 100) * circumference

    return (
      <circle
        key={index}
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={item.color}
        strokeWidth="14"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        className="transition-all duration-500"
        transform="rotate(-90 50 50)"
      />
    )
  })

  return (
    <div className="relative w-[100px] h-[100px] mx-auto">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {segments}
      </svg>
    </div>
  )
}

export default function OverviewPage() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  })

  // Calculate countdown
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const difference = eventDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

        setTimeRemaining({ days, hours, minutes })
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0 })
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 60000)

    return () => clearInterval(interval)
  }, [])

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
    const totalEstimated = mockBudgetCategories.reduce(
      (sum, cat) => sum + cat.items.reduce((itemSum, item) => itemSum + item.estimatedCost, 0),
      0
    )
    const totalPaid = mockBudgetCategories.reduce(
      (sum, cat) => sum + cat.items.reduce((itemSum, item) => itemSum + item.paidAmount, 0),
      0
    )
    const remaining = totalEstimated - totalPaid
    return { total: 120000, paid: totalPaid, remaining: 90000 }
  }, [])

  // Budget chart data
  const budgetChartData = [
    { label: 'Paid', value: budgetStats.paid, color: '#22C55E' },
    { label: 'Pending', value: budgetStats.remaining - budgetStats.paid, color: '#EAB308' },
    { label: 'Other', value: 10000, color: '#3B82F6' },
    { label: 'Remaining', value: budgetStats.remaining - (budgetStats.remaining - budgetStats.paid) - 10000, color: '#9CA3AF' },
  ]

  const upcomingBookings = createInitialServices().slice(0, 3)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
      {/* SECTION 1: Event Summary */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/3 h-40 lg:h-auto relative overflow-hidden">
              <Image
                src={authHeroImage}
                alt="Event Hero"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Event Details */}
            <div className="lg:flex-1 p-4 lg:p-6 relative">
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <Link href="#" className="text-brand-500 hover:text-brand-600 text-12 font-medium">
                  Dashboard Setting
                </Link>
                <Link href="#" className="text-brand-500 hover:text-brand-600 text-12 font-medium">
                  Edit
                </Link>
              </div>

              <div className="mt-6 lg:mt-0">
                <h1 className="text-22 sm:text-24 font-semibold text-gray-900 mb-2">{eventName}</h1>
                <div className="flex items-center gap-2 text-14 text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <span>{format(eventDate, 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-24 sm:text-28 font-bold text-brand-500 leading-none">
                      {timeRemaining.days}
                    </p>
                    <p className="text-12 text-gray-600 mt-1">Days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-24 sm:text-28 font-bold text-brand-500 leading-none">
                      {timeRemaining.hours}
                    </p>
                    <p className="text-12 text-gray-600 mt-1">Hours</p>
                  </div>
                  <div className="text-center">
                    <p className="text-24 sm:text-28 font-bold text-brand-500 leading-none">
                      {timeRemaining.minutes}
                    </p>
                    <p className="text-12 text-gray-600 mt-1">Min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Quick Stats Cards */}
      <div className="mb-6 sm:mb-8">
        <div className={cn('grid gap-3 sm:gap-4', 'grid-cols-1', 'sm:grid-cols-3')}>
          {/* Confirmed Booking */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <h3 className="text-14 font-semibold text-gray-900 mb-3">Confirmed Booking</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-16 font-bold text-gray-900">
                  {stats.bookings.current} Out of {stats.bookings.total}
                </p>
              </div>
              <ProgressRing percentage={stats.bookings.percentage} />
            </div>
          </div>

          {/* Complete Lists */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <h3 className="text-14 font-semibold text-gray-900 mb-3">Complete Lists</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-16 font-bold text-gray-900">
                  {stats.items.current} Out of {stats.items.total}
                </p>
              </div>
              <ProgressRing percentage={stats.items.percentage} />
            </div>
          </div>

          {/* Invite Your Guests */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <h3 className="text-14 font-semibold text-gray-900 mb-3">Invite Your Guests</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-16 font-bold text-gray-900">
                  {stats.guests.current} Out of {stats.guests.total}
                </p>
              </div>
              <ProgressRing percentage={stats.guests.percentage} />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Tasks Reminder */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-18 font-semibold text-gray-900">Tasks Reminder</h2>
              <Link
                href="#"
                className="text-12 text-brand-500 hover:text-brand-600 font-medium"
              >
                View All Tasks
              </Link>
            </div>
            <div className="space-y-3">
              {mockTasks.map(task => (
                <div key={task.id} className="flex items-start gap-2">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => {}}
                    variant={task.completed ? 'successFilled' : 'gray'}
                    shape="square"
                    size="sm"
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-13 text-gray-900 mb-1',
                      task.completed && 'line-through text-gray-400'
                    )}>
                      {task.description}
                    </p>
                    <p className="text-11 text-gray-500">Due: {format(new Date(task.dueDate), 'dd/MM/yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-18 font-semibold text-gray-900">Upcoming Bookings</h2>
              <Link
                href="/events/planning/bookings"
                className="text-12 text-brand-500 hover:text-brand-600 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingBookings.map(booking => (
                <div key={booking.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    <span className="text-14 font-semibold text-gray-600">
                      {booking.providerUserName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-14 font-semibold text-gray-900 mb-1">{booking.title}</p>
                    <p className="text-12 text-gray-600 mb-1">Provider : {booking.providerUserName}</p>
                    <p className="text-12 text-gray-600 mb-1">{booking.location}</p>
                    <p className="text-12 text-gray-600">{booking.date} {booking.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {booking.status === 'pending' && (
                      <Badge variant="pending" className="text-11">booking pending</Badge>
                    )}
                    {booking.status === 'confirmed' && (
                      <Badge variant="confirmed" className="text-11">booking confirmed</Badge>
                    )}
                    {booking.status === 'canceled' && (
                      <Badge variant="destructive" className="text-11">booking canceled</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Budget & Payments */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-18 font-semibold text-gray-900">Budget & Payments</h2>
              <Link
                href="/events/planning/calender"
                className="text-12 text-brand-500 hover:text-brand-600 font-medium"
              >
                View Details
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <DonutChart data={budgetChartData} />
              <div className="mt-4 space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-13 text-gray-600">All Budget</span>
                  <span className="text-14 font-semibold text-gray-900">{budgetStats.total.toLocaleString()} EGP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-13 text-gray-600">Remaining Budget</span>
                  <span className="text-14 font-semibold text-gray-900">{budgetStats.remaining.toLocaleString()} EGP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guests & Invitation */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-18 font-semibold text-gray-900">Guests & Invitation</h2>
              <Link
                href="/events/planning/calender"
                className="text-12 text-brand-500 hover:text-brand-600 font-medium"
              >
                View Details
              </Link>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-13 text-gray-600">Invited Guests</span>
                  <span className="text-14 font-semibold text-gray-900">25 Guest</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-13 text-gray-600">Remaining Seats</span>
                  <span className="text-14 font-semibold text-gray-900">150 Seat</span>
                </div>
              </div>

              {/* Image Placeholder */}
              <div className="h-24 bg-gradient-to-br from-pink-100 to-red-100 rounded-lg flex items-center justify-center mt-3">
                <div className="text-center">
                  <Users className="w-8 h-8 text-brand-500 mx-auto mb-1" />
                  <p className="text-11 text-gray-600">Event Image</p>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="flex gap-2 mt-3">
                <button className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                  <Instagram className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-gray-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
