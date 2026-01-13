import { Suspense } from 'react'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { ArticleDetailsClient } from './ArticleDetailsClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of article IDs to pre-generate at build time
  // Generate IDs 1-100 to cover common article IDs
  // In production, this could fetch from an API
  return Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1) }))
}

export default function ArticleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </main>
          <Footer />
        </div>
      }
    >
      <ArticleDetailsContentWrapper params={params} />
    </Suspense>
  )
}

async function ArticleDetailsContentWrapper({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ArticleDetailsClient id={id} />
}
