import { ServiceDetailClient } from './ServiceDetailClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of service category IDs to pre-generate at build time
  // In a real app, this would fetch from an API
  // Generate IDs 1-10 to cover common service IDs
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }))
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: serviceId } = await params
  return <ServiceDetailClient serviceId={serviceId} />
}
