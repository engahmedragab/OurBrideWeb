'use client'

import Image from 'next/image'
import type { ElementType, SVGProps } from 'react'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import { useI18nTranslations, useIsRTL } from '@/i18n'
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

function FooterColumn({ section, isRTL }: { section: FooterSection; isRTL: boolean }) {
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
              className={cn(
                "relative inline-block",
                "text-14 font-normal text-gray-700",
                "transition-colors duration-200",
                "hover:text-brand-500",
                "after:absolute after:-bottom-0.5",
                "after:h-[2px] after:w-full",
                "after:bg-brand-500",
                "after:transition-transform after:duration-300",
                "after:scale-x-0",
                "hover:after:scale-x-100",
                isRTL 
                  ? "after:right-0 after:origin-right" 
                  : "after:left-0 after:origin-left"
              )}
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
  const t = useI18nTranslations('footer')
  const isRTL = useIsRTL()

  const footerSections: FooterSection[] = [
    {
      title: t('sections.mainPages.title'),
      links: [
        { label: t('sections.mainPages.home'), href: '/' },
        { label: t('sections.mainPages.products'), href: '/products' },
        { label: t('sections.mainPages.services'), href: '/services' },
        { label: t('sections.mainPages.community'), href: '/community' },
      ],
    },
    {
      title: t('sections.eventsPlanning.title'),
      links: [
        { label: t('sections.eventsPlanning.myEvents'), href: '/dashboard/my-events' },
        { label: t('sections.eventsPlanning.eventsDay'), href: '/events/planning/events' },
        { label: t('sections.eventsPlanning.budgetPlanning'), href: '/events/planning/budget' },
        { label: t('sections.eventsPlanning.guestList'), href: '/events/planning/invitation' },
        { label: t('sections.eventsPlanning.todoList'), href: '/events/planning/todo' },
      ],
    },
    {
      title: t('sections.legal.title'),
      links: [
        { label: t('sections.legal.privacyPolicy'), href: '/privacy-policy' },
        { label: t('sections.legal.termsConditions'), href: '/terms-conditions' },
        { label: t('sections.legal.settings'), href: '/dashboard/settings' },
      ],
    },
    {
      title: t('sections.support.title'),
      links: [
        { label: t('sections.support.helpCenter'), href: '/dashboard/help-center' },
        { label: t('sections.support.aboutUs'), href: '/about' },
        { label: t('sections.support.shipping'), href: '/shipping' },
        { label: t('sections.support.returns'), href: '/returns' },
        { label: t('sections.support.downloadApp'), href: '/download-app' },
        { label: t('sections.support.sitemap'), href: '/sitemap' },
      ],
    },
    {
      title: t('sections.community.title'),
      links: [
        { label: t('sections.community.posts'), href: '/community?tab=posts' },
        { label: t('sections.community.blogs'), href: '/community?tab=blogs' },
        { label: t('sections.community.articles'), href: '/community?tab=articles' },
        { label: t('sections.community.reels'), href: '/community?tab=reels' },
        { label: t('sections.community.decisionGroups'), href: '/community?tab=decision-groups' },
        { label: t('sections.community.contests'), href: '/community?tab=contests' },
      ],
    },
  ]

  const socialLinks: SocialLink[] = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/ourbridestore',
      ariaLabel: t('social.instagram'),
      hoverBgClass:
        'hover:bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]',
      hoverBorderClass: 'hover:border-transparent',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/OurBrideStores',
      ariaLabel: t('social.facebook'),
      hoverBgClass: 'hover:bg-[#1877F2]',
      hoverBorderClass: 'hover:border-[#1877F2]',
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      href: 'https://tiktok.com/@our.bride.store',
      ariaLabel: t('social.tiktok'),
      hoverBgClass: 'hover:bg-black',
      hoverBorderClass: 'hover:border-black',
    },
  ]

  return (
    <footer 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn('w-full bg-white', className)}
    >
      <div className="w-full h-[1px] bg-brand-500" />

      <div className="bg-white px-5">
        <div className="py-10 mx-auto container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            {/* Left */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
              <Link 
                href="/" 
                className={cn(
                  "flex-shrink-0",
                  isRTL ? "self-start" : "self-start"
                )}
              >
                <Image
                  src={typeof footerLogo === 'string' ? footerLogo : footerLogo.src}
                  alt="OurBride Logo"
                  width={160}
                  height={64}
                  className="h-14 md:h-18 w-auto"
                />
              </Link>

              <p className={cn(
                "text-16 text-gray-600 max-w-sm",
                isRTL ? "text-right self-end" : "text-left self-start"
              )}>
                {t('description')}
              </p>

              <div className={cn(
                "flex flex-col gap-4 w-full",
                isRTL ? "items-start" : "items-start"
              )}>
                <h3 className={cn(
                  "text-18 md:text-20 font-semibold text-gray-900",
                  isRTL ? "text-right" : "text-left"
                )}>
                  {t('downloadApp')}
                </h3>
                <div className={cn(
                  "flex flex-wrap items-center",
                  isRTL ? "justify-end" : "justify-start"
                )}>
                  <StoreBadges size="3xl" />
                </div>
              </div>

              {/* Social Links */}
              <div className={cn(
                "flex flex-col gap-6 pt-2 w-full",
                isRTL ? "items-start" : "items-start"
              )}>
                <h3 className={cn(
                  "text-16 md:text-20 font-semibold text-gray-900",
                  isRTL ? "text-right" : "text-left"
                )}>
                  {t('socialLinks')}
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
  <div className={cn(
    "flex flex-wrap items-center gap-3",
    isRTL ? "justify-end" : "justify-start"
  )}>
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
            <div className={cn(
              "md:col-span-8 lg:col-span-9 lg:pt-24",
              isRTL ? "me-3" : "ms-3"
            )}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 gap-y-12">
                {footerSections.map(section => (
                  <FooterColumn key={section.title} section={section} isRTL={isRTL} />
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-200 my-10" />

          <div className="text-center">
            <p className="text-14 font-normal text-gray-700">
              {t('copyright', { year: currentYear })}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-800 h-2" />
    </footer>
  )
}
