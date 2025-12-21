import type { Metadata } from 'next'
import { Providers } from './providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'OurBride',
  description: 'Premium wedding products and services',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* SVG clipPath definition for card with rounded corners and smooth top-right cutout */}
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            <clipPath id="clipWithCircularNotch" clipPathUnits="objectBoundingBox">
              <path d="
                  M 0.06, 0
                  L 0.75, 0
                  A 0.05, 0.05 0 0 1 0.80, 0.05
                  A 0.15, 0.15 0 0 0 0.95, 0.20
                  A 0.05, 0.05 0 0 1 1, 0.25
                  L 1, 0.94
                  Q 1, 1 0.94, 1
                  L 0.06, 1
                  Q 0, 1 0, 0.94
                  L 0, 0.06
                  Q 0, 0 0.06, 0
                  Z
                " />
            </clipPath>
          </defs>
        </svg>

        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
