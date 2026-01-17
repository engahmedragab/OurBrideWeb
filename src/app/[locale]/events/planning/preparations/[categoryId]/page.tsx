import PreparationsLinesClient from '@/components/planning/preparations/PreparationsLinesClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return empty array for dynamic routes
  // This route will be generated on-demand
  return []
}

export default async function PreparationsCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string; locale: string }>
}) {
  await params // Ensure params are awaited
  return <PreparationsLinesClient />
}
