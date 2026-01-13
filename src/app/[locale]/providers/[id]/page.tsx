import { ProviderProfileClient } from '../../provider/[id]/ProviderProfileClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of provider IDs to pre-generate at build time
  // In a real app, this would fetch from an API
  // Generate IDs 1-10 to cover common provider IDs
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }))
}

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: providerId } = await params
  return <ProviderProfileClient providerId={providerId} />
}
