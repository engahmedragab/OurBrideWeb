import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import footerLogo from '@/assets/svg/Brand-logo.svg'
import { Facebook, Instagram, Music2 } from 'lucide-react'
import { StoreBadges } from '@/components/ui/StoreBadges'

export interface FooterProps {
  className?: string
}

export const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/OurBrideStores',
      ariaLabel: 'Visit our Facebook page',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/ourbridestore',
      ariaLabel: 'Visit our Instagram page',
    },
    {
      name: 'TikTok',
      icon: Music2,
      href: 'https://tiktok.com/@our.bride.store',
      ariaLabel: 'Visit our TikTok page',
    },
  ]

  return (
    <footer className={cn('w-full bg-white', className)}>
      {/* Orange top border */}
      <div className="w-full h-[1px] bg-brand-500" />

      {/* Main footer content */}
      <div className="bg-white">
        <div className="container-custom py-8 md:py-12">
          {/* Top Section - Logo and Navigation */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-12">
            {/* Logo */}
            <div className="flex flex-col items-center md:items-start gap-3 flex-shrink-0">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src={
                    typeof footerLogo === 'string' ? footerLogo : footerLogo.src
                  }
                  alt="OurBride Logo"
                  width={160}
                  height={64}
                  className="h-12 md:h-16 w-auto"
                />
              </Link>
              <p className="text-14 text-gray-600 text-center md:text-left max-w-xs">
                Your all-in-one platform for wedding planning and shopping. Find
                everything you need to create your perfect day.
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-3 md:gap-4 items-center">
              <h3 className="text-18 font-normal text-gray-900">Quick Links</h3>
              <div className="w-16 h-0.5 bg-brand-500" />
              {/* Second Row */}
              <div className="flex items-center gap-4 md:gap-6 lg:gap-8 flex-wrap justify-center">
                <Link
                  href="/about"
                  className="text-16 font-normal text-gray-700 hover:opacity-80 transition-opacity"
                >
                  About
                </Link>
                <Link
                  href="/shipping"
                  className="text-16 font-normal text-gray-700 hover:opacity-80 transition-opacity"
                >
                  Shipping
                </Link>
                <Link
                  href="/returns"
                  className="text-16 font-normal text-gray-700 hover:opacity-80 transition-opacity"
                >
                  Returns
                </Link>
                <Link
                  href="/download-app"
                  className="text-16 font-normal text-gray-700 hover:opacity-80 transition-opacity"
                >
                  Download App
                </Link>
                <Link
                  href="/sitemap"
                  className="text-16 font-normal text-gray-700 hover:opacity-80 transition-opacity"
                >
                  Sitemap
                </Link>
                <Link
                  href="/dashboard/help-center"
                  className="text-16 font-normal text-gray-700 hover:opacity-80 transition-opacity"
                >
                  Help Center
                </Link>
              </div>
            </nav>
          </div>

          {/* Middle Section - Social Links and App Download */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* Left: Social Links */}
            <div className="flex flex-col gap-4 items-center md:items-start">
              <h3 className="text-20 font-normal text-gray-700">
                Social Links
              </h3>
              <div className="flex items-center gap-4 justify-center md:justify-start">
                {socialLinks.map(social => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-brand-500 text-gray-700 hover:opacity-80 transition-opacity"
                    >
                      <Icon className="h-6 w-6 text-brand-500" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Right: App Download */}
            <div className="flex flex-col gap-4 items-end">
              <div className='flex flex-col gap-4 items-start'>
                <h3 className="text-20 font-normal text-gray-700">
                  Download Ourbride App
                </h3>
                <div className="flex justify-center">
                  <StoreBadges size="md" />
                </div>
              </div>
            </div>
          </div>

          {/* Divider line */}
          <div className="w-full h-[1px] bg-gray-300 mb-6" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-14 font-normal text-gray-700">
              © {currentYear} Crafted by OurBride All Rights Reserved
            </p>
          </div>
        </div>
      </div>

      {/* Bottom dark gray strip */}
      <div className="w-full bg-gray-800 h-2" />
    </footer>
  )
}
