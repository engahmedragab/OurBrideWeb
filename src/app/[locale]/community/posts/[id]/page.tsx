import { Suspense } from 'react'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { PostDetailsClient } from './PostDetailsClient'
import { useI18nTranslations } from '@/i18n'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { LoadingSpinner } from '@/components/ui'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of post IDs to pre-generate at build time
  // Generate IDs 1-100 to cover common post IDs
  // In production, this could fetch from an API
  return Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1) }))
}

export default function PostDetailsPage({
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
            <LoadingSpinner open={true} />
          </main>
          <Footer />
        </div>
      }
    >
      <PostDetailsContentWrapper params={params} />
    </Suspense>
  )
}

async function PostDetailsContentWrapper({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PostDetailsClient id={id} />
}
