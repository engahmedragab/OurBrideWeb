import { redirect } from '@/i18n/navigation'

/**
 * Generate static params for static export
 * Returns placeholder IDs to satisfy Next.js static export requirements
 */
export async function generateStaticParams() {
  // Return a minimal set of placeholder IDs
  // In a real app, you might fetch actual event IDs from an API
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

/**
 * EventDetailsPage
 * Redirects to the events/planning overview page with the event ID
 * This integrates the event details page with the events/planning structure
 * The planning pages will use the eventId from query params to load event-specific data
 */
export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  
  if (id) {
    // Redirect to my-events with the event ID selected
    redirect({
      href: `/dashboard/my-events?eventId=${id}`,
      locale,
    })
  } else {
    // If no event ID, redirect to my-events list
    redirect({
      href: '/dashboard/my-events',
      locale,
    })
  }
}
