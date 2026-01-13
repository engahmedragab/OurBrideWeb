import { Suspense } from 'react'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { DecisionGroupDetailsClient } from './DecisionGroupDetailsClient'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of decision group IDs to pre-generate at build time
  // Generate IDs 1-100 to cover common decision group IDs
  // In production, this could fetch from an API
  return Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1) }))
}

export default function DecisionGroupDetailsPage({
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
      <DecisionGroupDetailsContentWrapper params={params} />
    </Suspense>
  )
}

async function DecisionGroupDetailsContentWrapper({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <DecisionGroupDetailsClient id={id} />
}

















