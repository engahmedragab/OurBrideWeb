import { BookingClient } from './BookingClient'

export default async function ProviderBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ service?: string }>
}) {
  const { id: providerId } = await params
  const { service: serviceId } = await searchParams

  return (
    <BookingClient providerId={providerId} preSelectedServiceId={serviceId} />
  )
}
