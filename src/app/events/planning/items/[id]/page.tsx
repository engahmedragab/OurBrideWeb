import { ItemDetailsPageClient } from './ItemDetailsPageClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of item IDs to pre-generate at build time
  // In a real app, this would fetch from an API
  return [{ id: 'INV-2025-001' }, { id: 'INV-2025-002' }, { id: 'INV-2025-003' }]
}

export default async function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: itemId } = await params
  return <ItemDetailsPageClient itemId={itemId} />
}
