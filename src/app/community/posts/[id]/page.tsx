import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { PostDetails } from '@/components/community'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of post IDs to pre-generate at build time
  // In a real app, this would fetch from an API
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

// Mock data - Replace with API call
const mockPost = {
  id: '1',
  author: {
    name: 'Aya Mohamed',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  images: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
  ],
  timestamp: '18 Aug 2025 12:45 PM',
  likes: 20,
  comments: 20,
  shares: 215,
}

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // In a real app, fetch post data based on id
  const post = mockPost

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-6 md:py-8">
          <div className="max-w-3xl mx-auto">
            <PostDetails {...post} id={id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
