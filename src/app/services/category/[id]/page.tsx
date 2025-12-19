import { ServiceDetailClient } from './ServiceDetailClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of service category IDs to pre-generate at build time
  // In a real app, this would fetch from an API
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: serviceId } = await params
  return <ServiceDetailClient serviceId={serviceId} />
}
