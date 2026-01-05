import { ProviderLinksClient } from './ProviderLinksClient'

export default async function ProviderLinksPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: providerId } = await params
  return <ProviderLinksClient providerId={providerId} />
}
