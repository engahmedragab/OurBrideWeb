import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { ArticleDetails } from '@/components/community'

// Generate static params for static export
export function generateStaticParams() {
  // Return array of article IDs to pre-generate at build time
  // In a real app, this would fetch from an API
  return [{ id: '1' }]
}

// Mock data - Replace with API call
const mockArticle = {
  id: '1',
  title: '5 Makeup Hacks Every Bride Needs Today',
  description:
    'Discover the essential makeup tips that every bride should know for their special day. These professional techniques will help you achieve a flawless look.',
  fullContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.`,
  image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
  author: {
    name: 'Aya Mohamed',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  date: '12 Sep, 2025',
  likes: 20,
  comments: 20,
  shares: 215,
}

export default async function ArticleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // In a real app, fetch article data based on id
  const article = mockArticle

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-6 md:py-8">
          <div className="max-w-3xl mx-auto">
            <ArticleDetails {...article} id={id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
