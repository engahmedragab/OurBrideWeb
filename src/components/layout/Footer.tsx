import Link from 'next/link'
import Image from 'next/image'
import type { ElementType, SVGProps } from 'react'
import { cn } from '@/lib/utils'
import footerLogo from '@/assets/svg/Brand-logo.svg'
import { Facebook, Instagram } from 'lucide-react'
import { StoreBadges } from '@/components/ui/StoreBadges'

export interface FooterProps {
  className?: string
}

type FooterLink = {
  label: string
  href: string
}

type FooterSection = {
  title: string
  links: FooterLink[]
}

type SocialLink = {
  name: string
  icon: ElementType
  href: string
  ariaLabel: string
  hoverBgClass: string
  hoverBorderClass: string
}

/** ✅ Custom TikTok SVG Icon */
const TikTokIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className={cn('w-6 h-6', props.className)}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
)

function FooterColumn({ section }: { section: FooterSection }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-16 md:text-18 font-semibold text-gray-900">
        {section.title}
      </h3>

      <ul className="flex flex-col gap-3">
        {section.links.map(item => (
          <li key={`${section.title}-${item.label}`}>
           <Link
  href={item.href}
  className="
    relative inline-block
    text-14 font-normal text-gray-700
    transition-colors duration-200
    hover:text-brand-500
    after:absolute after:left-0 after:-bottom-0.5
    after:h-[2px] after:w-full
    after:origin-left after:scale-x-0
    after:bg-brand-500
    after:transition-transform after:duration-300
    hover:after:scale-x-100
  "
>
  {item.label}
</Link>

          </li>
        ))}
      </ul>
    </div>
  )
}

export const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  const footerSections: FooterSection[] = [
    {
      title: 'Main Pages',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Services', href: '/services' },
        { label: 'Community', href: '/community' },
      ],
    },
    {
      title: 'Events Planning',
      links: [
        
        { label: 'My Events', href: '/dashboard/my-events' },
        { label: 'Events day', href: '/events/planning/events' },
        { label: 'Budget Planning', href: '/events/planning/budget' },
        { label: 'Guest List', href: '/events/planning/invitation' },
        { label: 'To-Do List', href: '/events/planning/todo' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms-conditions' },
    
        { label: 'Settings', href: '/dashboard/settings' },
      ],
    },
   
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/dashboard/help-center' },
        { label: 'About Us', href: '/about' },
        { label: 'Shipping', href: '/shipping' },
        { label: 'Returns', href: '/returns' },
        { label: 'Download App', href: '/download-app' },
        { label: 'Sitemap', href: '/sitemap' },
      ],
    },
   
    {
      title: 'Community',
      links: [
        { label: 'Posts', href: '/community?tab=posts' },
        { label: 'Blogs', href: '/community?tab=blogs' },
        { label: 'Articles', href: '/community?tab=articles' },
        { label: 'Reels', href: '/community?tab=reels' },
        { label: 'Decision Groups', href: '/community?tab=decision-groups' },
        { label: 'Contests', href: '/community?tab=contests' },
      ],
    },
  ]

  const socialLinks: SocialLink[] = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/ourbridestore',
      ariaLabel: 'Visit our Instagram page',
      hoverBgClass:
        'hover:bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]',
      hoverBorderClass: 'hover:border-transparent',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/OurBrideStores',
      ariaLabel: 'Visit our Facebook page',
      hoverBgClass: 'hover:bg-[#1877F2]',
      hoverBorderClass: 'hover:border-[#1877F2]',
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      href: 'https://tiktok.com/@our.bride.store',
      ariaLabel: 'Visit our TikTok page',
      hoverBgClass: 'hover:bg-black',
      hoverBorderClass: 'hover:border-black',
    },
  ]

  return (
    <footer className={cn('w-full bg-white', className)}>
      <div className="w-full h-[1px] bg-brand-500" />

      <div className="bg-white px-5  ">
        <div className="  py-10 mx-auto container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            {/* Left */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col items-start gap-6">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src={typeof footerLogo === 'string' ? footerLogo : footerLogo.src}
                  alt="OurBride Logo"
                  width={160}
                  height={64}
                  className="h-14 md:h-18 w-auto"
                />
              </Link>

              <p className="text-16 text-gray-600 max-w-sm">
                Your all-in-one platform for wedding planning and shopping. Find
                everything you need to create your perfect day.
              </p>


              <div className="flex flex-col items-start ">
                <h3 className="text-18 md:text-20 font-semibold text-gray-900">
                  Download Ourbride App
                </h3>
                <div className="flex flex-wrap items-center ">
                  <StoreBadges size="3xl" />

                </div>
              </div>

              {/* Social تحت Download */}
              <div className="flex flex-col items-start gap-6 pt-2">
  <h3 className="text-16 md:text-20 font-semibold text-gray-900">
    Social Links
  </h3>

  {/* ===== Style 1: Glass Circle ===== */}
  {/* <div className="flex flex-wrap items-center gap-3">
    {socialLinks.map(social => {
      const Icon = social.icon
      return (
        <a
          key={`glass-${social.name}`}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.ariaLabel}
          className={cn(
            'group inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full',
            'bg-white/80 backdrop-blur-md',
            'border border-gray-300/40',
            'shadow-[0_8px_20px_rgba(0,0,0,0.05)]',
            'transition-all duration-200',
            'hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(0,0,0,0.18)]',
            social.hoverBgClass,
            social.hoverBorderClass,
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
          )}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-gray-700 transition-colors duration-200 group-hover:text-white" />
        </a>
      )
    })}
  </div> */}

  {/* ===== Style 2: Minimal Outline ===== */}
  {/* <div className="flex flex-wrap items-center gap-3">
    {socialLinks.map(social => {
      const Icon = social.icon
      return (
        <a
          key={`outline-${social.name}`}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.ariaLabel}
          className={cn(
            'group inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full',
            'bg-transparent',
            'border border-gray-400',
            'transition-all duration-200',
            'hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(0,0,0,0.18)]',
            social.hoverBgClass,
            social.hoverBorderClass,
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
          )}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-gray-700 transition-colors duration-200 group-hover:text-white" />
        </a>
      )
    })}
  </div> */}

  {/* ===== Style 3: Soft Square (App Style) ===== */}
  <div className="flex flex-wrap items-center gap-3">
    {socialLinks.map(social => {
      const Icon = social.icon
      return (
        <a
          key={`square-${social.name}`}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.ariaLabel}
          className={cn(
            'group inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl',
            'bg-white',
            'border border-gray-200',
            'shadow-[0_6px_16px_rgba(0,0,0,0.06)]',
            'transition-all duration-200',
            'hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(0,0,0,0.18)]',
            social.hoverBgClass,
            social.hoverBorderClass,
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
          )}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-gray-700 transition-colors duration-200 group-hover:text-white" />
        </a>
      )
    })}
  </div>

  
</div>

            </div>

            {/* Right (Sections) */}
            {/* ✅ هنا التعديل: على lg بس يبدأ موازي للبراجراف */}
            <div className="ms-3 md:col-span-8 lg:col-span-9 lg:pt-24">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 gap-y-12">
                {footerSections.map(section => (
                  <FooterColumn key={section.title} section={section} />
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-200 my-10" />

          <div className="text-center">
            <p className="text-14 font-normal text-gray-700">
              © {currentYear} Crafted by OurBride All Rights Reserved
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-800 h-2" />
    </footer>
  )
}
