import { ReservationDetailsClient } from './ReservationDetailsClient'

// No generateStaticParams needed - using SSR for dynamic reservations
// This allows reservations to be fetched at runtime based on user authentication

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ReservationDetailsClient reservationId={id} />
}
