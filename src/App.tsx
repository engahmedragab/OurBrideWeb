import { BrowserRouter, Routes, Route, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/reactQuery'

// Pages
import { routes } from './routes/routes'

// // Deeplink pages
// import DeepLinkHandler from '@/pages/deeplink/DeepLinkHandler'
// import DeepLinkRedirect from '@/pages/deeplink/DeepLinkRedirect'
// import AffiliateRedirect from '@/pages/deeplink/AffiliateRedirect'
// import OfferRedirect from '@/pages/deeplink/OfferRedirect'
// import QRRedirect from '@/pages/deeplink/QRRedirect'
// import CouponDeepLink from '@/pages/deeplink/CouponDeepLink'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
     <RouterProvider router={routes} />
    </QueryClientProvider>
  )
}

export default App
