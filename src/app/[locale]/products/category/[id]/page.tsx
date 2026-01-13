import { ProductCategoryDetailClient } from './ProductCategoryDetailClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of product category IDs to pre-generate at build time
  // In a real app, this would fetch from an API
  // Generate IDs 1-10 to cover common product category IDs
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }))
}

export default async function ProductCategoryDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: productId } = await params
  return <ProductCategoryDetailClient productId={productId} />
}
