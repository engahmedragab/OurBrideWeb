import { ItemDetailsPageClient } from './ItemDetailsPageClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of item IDs to pre-generate at build time
  // In a real app, this would fetch from an API
  // Generate invoice IDs INV-2025-001 through INV-2025-010
  return Array.from({ length: 10 }, (_, i) => ({
    id: `INV-2025-${String(i + 1).padStart(3, '0')}`,
  }))
}

export default async function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: itemId } = await params
  return <ItemDetailsPageClient itemId={itemId} />
}
