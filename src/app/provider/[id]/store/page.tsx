import { ProviderStoreClient } from './ProviderStoreClient'

export default async function ProviderStorePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: providerId } = await params
  return <ProviderStoreClient providerId={providerId} />
}
