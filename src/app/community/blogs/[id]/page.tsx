import { Suspense } from 'react'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { BlogDetailsClient } from './BlogDetailsClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of blog IDs to pre-generate at build time
  // Generate IDs 1-100 to cover common blog IDs
  // In production, this could fetch from an API
  return Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1) }))
}

export default function BlogDetailsPage({
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
      <BlogDetailsContentWrapper params={params} />
    </Suspense>
  )
}

async function BlogDetailsContentWrapper({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <BlogDetailsClient id={id} />
}
