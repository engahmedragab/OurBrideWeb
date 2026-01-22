import { Suspense } from 'react'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { ContestDetailsClient } from './ContestDetailsClient'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of contest IDs to pre-generate at build time
  // Generate IDs 1-100 to cover common contest IDs
  // In production, this could fetch from an API
  return Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1) }))
}

export default function ContestDetailsPage({
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
            <LoadingOverlay open={true} />
          </main>
          <Footer />
        </div>
      }
    >
      <ContestDetailsContentWrapper params={params} />
    </Suspense>
  )
}

async function ContestDetailsContentWrapper({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ContestDetailsClient id={id} />
}

















