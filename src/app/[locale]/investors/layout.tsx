import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Investor Relations — OurBride | Egypt\'s Wedding OS',
  description:
    'The all-in-one wedding planning platform for Egypt. Live product, real traction, massive market.',
}

export default function InvestorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
