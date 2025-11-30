import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/reactQuery'

// Pages
import Home from '@/pages/Home'

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          Deeplink routes
          {/* Short code handlers */}
          {/* <Route path="/d/:shortCode" element={<DeepLinkHandler />} />
          <Route path="/dl/:shortCode" element={<DeepLinkHandler />} />
           */}
          {/* Affiliate redirects */}
          {/* <Route path="/affiliate/:affiliateCode" element={<AffiliateRedirect />} />
          <Route path="/a/:affiliateCode" element={<AffiliateRedirect />} /> */}
          {/* Offer redirects */}
          {/* <Route path="/offer/:offerCode" element={<OfferRedirect />} />
          <Route path="/o/:offerCode" element={<OfferRedirect />} /> */}
          {/* QR code redirects */}
          {/* <Route path="/qr/:type/:id" element={<QRRedirect />} />
          <Route path="/qr/:qrCode" element={<QRRedirect />} /> */}
          {/* Coupon deeplink */}
          {/* <Route path="/app/coupon" element={<CouponDeepLink />} /> */}
          {/* DeepLinkRedirect for app routes (handles other /app/* paths) */}
          {/* <Route path="/app/*" element={<DeepLinkRedirect />} /> */}
          {/* Note: DeepLinkRedirect uses window.location.pathname to handle any path dynamically */}
          {/* If needed, add more specific routes above or use as catch-all below other routes */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
