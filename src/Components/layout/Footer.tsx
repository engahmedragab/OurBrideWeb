import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import footerLogo from '@/assets/Footer-Logo.svg'
import { Facebook, Instagram, Music2, Twitter } from 'lucide-react'
import appStoreSvg from '@/assets/svg/app-store.svg'
import googlePlaySvg from '@/assets/svg/google-play.svg'

// App Store constants
const APP_PACKAGE = 'com.ourbride.app'
const IOS_APP_ID = '6747453812'

const appStoreUrl = `https://apps.apple.com/app/id${IOS_APP_ID}`
const playStoreUrl = `https://play.google.com/store/apps/details?id=${APP_PACKAGE}`

export interface FooterProps {
  className?: string
}

export const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/ourbride',
      ariaLabel: 'Visit our Facebook page',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/ourbride',
      ariaLabel: 'Visit our Instagram page',
    },
    {
      name: 'TikTok',
      icon: Music2,
      href: 'https://tiktok.com/@ourbride',
      ariaLabel: 'Visit our TikTok page',
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      href: 'https://twitter.com/ourbride',
      ariaLabel: 'Visit our X (Twitter) page',
    },
  ]

  return (
    <footer className={cn('w-full bg-[#F45B42] text-white', className)}>
      {/* Top Section - Logo and Navigation */}
      <div className="container-custom border-b border-white/20 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={footerLogo}
              alt="OurBride Logo"
              className="h-12 md:h-16 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 md:gap-8">
            <Link
              to="/"
              className="text-16 font-semibold hover:opacity-80 transition-opacity"
            >
              Home
            </Link>
            <Link
              to="/store"
              className="text-16 font-semibold hover:opacity-80 transition-opacity"
            >
              Store
            </Link>
            <Link
              to="/about"
              className="text-16 font-semibold hover:opacity-80 transition-opacity"
            >
              About Us
            </Link>
            <Link
              to="/blog"
              className="text-16 font-semibold hover:opacity-80 transition-opacity"
            >
              Blog
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content - Three Columns */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1: Get In Touch */}
          <div className="flex flex-col gap-6">
            <h3 className="text-20 font-bold">Get In Touch</h3>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map(social => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-[#F45B42] hover:opacity-80 transition-opacity"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                )
              })}
            </div>

            {/* Service Provider Link */}
            <Link
              to="/provide-services"
              className="text-16 font-medium underline hover:opacity-80 transition-opacity self-start"
            >
              Provide Your Services With Us
            </Link>
          </div>

          {/* Column 2: Help Center */}
          <div className="flex flex-col gap-6">
            <h3 className="text-20 font-bold">Help Center</h3>

            {/* Help Links */}
            <div className="flex flex-col gap-4">
              <Link
                to="/help"
                className="text-16 font-medium underline hover:opacity-80 transition-opacity self-start"
              >
                Help & FAQs
              </Link>
              <Link
                to="/terms"
                className="text-16 font-medium underline hover:opacity-80 transition-opacity self-start"
              >
                Terms of Use
              </Link>
              <Link
                to="/privacy"
                className="text-16 font-medium underline hover:opacity-80 transition-opacity self-start"
              >
                Privacy Policy
              </Link>
            </div>

            {/* Support Email */}
            <div className="mt-2">
              <p className="text-14 font-medium">Support E-mail</p>
              <a
                href="mailto:example@test.com"
                className="text-14 font-medium underline hover:opacity-80 transition-opacity"
              >
                example@test.com
              </a>
            </div>
          </div>

          {/* Column 3: Download Our App */}
          <div className="flex flex-col gap-6">
            <h3 className="text-20 font-bold">Download Our App</h3>

            {/* App Store Badges */}
            <div className="flex flex-col gap-4">
              {/* Apple App Store */}
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src={appStoreSvg}
                  alt="Download on the App Store"
                  className="h-10 w-auto"
                />
              </a>

              {/* Google Play Store */}
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src={googlePlaySvg}
                  alt="Get it on Google Play"
                  className="h-10 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="container-custom border-t border-white/20 py-6">
        <p className="text-center text-14 font-medium">
          © {currentYear} Crafted by OurBride All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
