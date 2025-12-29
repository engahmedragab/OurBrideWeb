import PreparationsLinesClient from '@/components/planning/preparations/PreparationsLinesClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of category IDs to pre-generate at build time
  // Generate IDs 1-5 to cover common category IDs
  return Array.from({ length: 5 }, (_, i) => ({ categoryId: String(i + 1) }))
}

export default async function PreparationsLinesPage({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  await params // Await params for Next.js static export compatibility
  return <PreparationsLinesClient />
}
