import { ProviderProfileClient } from './ProviderProfileClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of provider IDs to pre-generate at build time
  // In a real app, this would fetch from an API
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: providerId } = await params
  return <ProviderProfileClient providerId={providerId} />
}
