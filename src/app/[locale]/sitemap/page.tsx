'use client'

import { Link } from '@/i18n/navigation'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { Typography, CardWrapper } from '@/components/ui'
import {
  Home,
  User,
  Calendar,
  Users,
  Gift,
  HelpCircle,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n'

export default function SitemapPage() {
  const t = useI18nTranslations('sitemap')
  const isRtl = useIsRTL();

  const sitemapSections = [
    {
      title: t('sections.main.title'),
      icon: Home,
      iconColor: 'bg-blue-100 text-blue-600',
      links: [
        { label: t('sections.main.links.home'), href: '/' },
        { label: t('sections.main.links.products'), href: '/products' },
        { label: t('sections.main.links.services'), href: '/services' },
        { label: t('sections.main.links.community'), href: '/community' },
      ],
    },
    {
      title: t('sections.account.title'),
      icon: User,
      iconColor: 'bg-purple-100 text-purple-600',
      links: [
        { label: t('sections.account.links.profile'), href: '/profile' },
        { label: t('sections.account.links.orders'), href: '/orders' },
        { label: t('sections.account.links.cart'), href: '/cart' },
        { label: t('sections.account.links.wishlist'), href: '/wishlist' },
        { label: t('sections.account.links.favorites'), href: '/favorites' },
        { label: t('sections.account.links.messages'), href: '/messages' },
        { label: t('sections.account.links.notifications'), href: '/notifications' },
      ],
    },
    {
      title: t('sections.wedding.title'),
      icon: Calendar,
      iconColor: 'bg-pink-100 text-pink-600',
      links: [
        { label: t('sections.wedding.links.events'), href: '/events' },
        { label: t('sections.wedding.links.myEvents'), href: '/dashboard/my-events' },
        { label: t('sections.wedding.links.calendar'), href: '/dashboard/calendar' },
        { label: t('sections.wedding.links.budget'), href: '/events/planning/budget' },
        { label: t('sections.wedding.links.guestList'), href: '/events/planning/events' },
        { label: t('sections.wedding.links.todo'), href: '/events/planning/todo' },
      ],
    },
    {
      title: t('sections.community.title'),
      icon: Users,
      iconColor: 'bg-green-100 text-green-600',
      links: [
        { label: t('sections.community.links.posts'), href: '/community?tab=posts' },
        { label: t('sections.community.links.blogs'), href: '/community?tab=blogs' },
        { label: t('sections.community.links.articles'), href: '/community?tab=articles' },
        { label: t('sections.community.links.reels'), href: '/community?tab=reels' },
        { label: t('sections.community.links.decisionGroups'), href: '/community?tab=decision-groups' },
        { label: t('sections.community.links.contests'), href: '/community?tab=contests' },
      ],
    },
    {
      title: t('sections.gift.title'),
      icon: Gift,
      iconColor: 'bg-yellow-100 text-yellow-600',
      links: [
        { label: t('sections.gift.links.giftCenter'), href: '/dashboard/gift-center' },
        { label: t('sections.gift.links.coupons'), href: '/dashboard/gift-center/coupons' },
        { label: t('sections.gift.links.offers'), href: '/dashboard/gift-center/offers' },
        { label: t('sections.gift.links.rewards'), href: '/dashboard/gift-center/rewards' },
        { label: t('sections.gift.links.ranking'), href: '/dashboard/gift-center/ranking' },
      ],
    },
    {
      title: t('sections.support.title'),
      icon: HelpCircle,
      iconColor: 'bg-indigo-100 text-indigo-600',
      links: [
        { label: t('sections.support.links.helpCenter'), href: '/dashboard/help-center' },
        { label: t('sections.support.links.about'), href: '/about' },
        { label: t('sections.support.links.shipping'), href: '/shipping' },
        { label: t('sections.support.links.returns'), href: '/returns' },
        { label: t('sections.support.links.downloadApp'), href: '/download-app' },
        { label: t('sections.support.links.sitemap'), href: '/sitemap' },
      ],
    },
    {
      title: t('sections.settings.title'),
      icon: Settings,
      iconColor: 'bg-gray-100 text-gray-600',
      links: [
        { label: t('sections.settings.links.settings'), href: '/dashboard/settings' },
        { label: t('sections.settings.links.privacy'), href: '/dashboard/settings/privacy' },
        { label: t('sections.settings.links.terms'), href: '/dashboard/settings/terms' },
        { label: t('sections.settings.links.communitySettings'), href: '/dashboard/settings/community' },
      ],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background-secondary">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 md:mb-12 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-brand-500" />
                </div>
                <Typography variant="h1" className={cn("text-24 md:text-32 font-normal", isRtl ? "text-right" : "text-left")}>
                  {t('pageTitle')}
                </Typography>
              </div>
              <div className="w-20 h-1 bg-brand-500 mx-auto md:mx-0" />
              <Typography
                variant="bodyLarge"
                textColor="secondary"
                className={cn("mt-4 max-w-2xl", isRtl ? "text-right" : "text-left")}
              >
                {t('pageSubtitle')}
              </Typography>
            </div>

            {/* Sitemap Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sitemapSections.map((section, index) => {
                const Icon = section.icon
                return (
                  <CardWrapper
                    key={index}
                    className="border-gray-200 hover:shadow-md transition-shadow"
                    padding="md"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${section.iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Typography
                        variant="h3"
                        className={cn("text-18 md:text-20 font-normal", isRtl ? "text-right" : "text-left")}
                      >
                        {section.title}
                      </Typography>
                    </div>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            className="flex items-center gap-2 text-14 md:text-16 text-gray-700 hover:text-brand-500 transition-colors group"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
                            <Typography
                              variant="body"
                              as="span"
                              className={cn(isRtl ? "text-right" : "text-left")}
                            >
                              {link.label}
                            </Typography>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardWrapper>
                )
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
