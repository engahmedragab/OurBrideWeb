'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout'
import { Footer } from '@/components/layout'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useTranslations, useIsRTL } from '@/i18n/hooks'
import {
  Calendar,
  Users,
  CheckCircle2,
  DollarSign,
  Heart,
  Gift,
  Camera,
  ArrowRight,
  Play,
  ChevronRight,
  Sparkles,
  ListTodo,
  Clock,
  MapPin,
} from 'lucide-react'
import eventsHomeSvg from '@/assets/svg/events-home.svg'

export default function EventsPage() {
  const t = useTranslations('home.sections.events')
  const isRTL = useIsRTL()
  const [activeStep, setActiveStep] = useState(0)

  const eventTypes = [
    {
      icon: Heart,
      title: t('eventTypes.engagement.title'),
      description: t('eventTypes.engagement.description'),
      accent: '#EC4899',
      gradient: 'from-pink-500/20 to-rose-500/10',
    },
    {
      icon: Gift,
      title: t('eventTypes.bridalShower.title'),
      description: t('eventTypes.bridalShower.description'),
      accent: '#8B5CF6',
      gradient: 'from-purple-500/20 to-violet-500/10',
    },
    {
      icon: Calendar,
      title: t('eventTypes.wedding.title'),
      description: t('eventTypes.wedding.description'),
      accent: '#F14836',
      gradient: 'from-brand-500/20 to-red-500/10',
    },
    {
      icon: Camera,
      title: t('eventTypes.photoshoot.title'),
      description: t('eventTypes.photoshoot.description'),
      accent: '#0EA5E9',
      gradient: 'from-sky-500/20 to-blue-500/10',
    },
  ]

  const features = [
    {
      icon: Calendar,
      title: t('features.eventManagement.title'),
      description: t('features.eventManagement.description'),
      step: '01',
    },
    {
      icon: Users,
      title: t('features.guestManagement.title'),
      description: t('features.guestManagement.description'),
      step: '02',
    },
    {
      icon: DollarSign,
      title: t('features.budgetTracking.title'),
      description: t('features.budgetTracking.description'),
      step: '03',
    },
    {
      icon: CheckCircle2,
      title: t('features.taskManagement.title'),
      description: t('features.taskManagement.description'),
      step: '04',
    },
  ]

  const planningTools = [
    { icon: ListTodo, label: t('planningTools.toDoLists'), count: t('planningTools.unlimited') },
    { icon: Users, label: t('planningTools.guestManagement'), count: '500+' },
    { icon: DollarSign, label: t('planningTools.budgetTracking'), count: t('planningTools.realTime') },
    { icon: Calendar, label: t('planningTools.eventCalendar'), count: t('planningTools.sync') },
    { icon: Clock, label: t('planningTools.timeline'), count: t('planningTools.automated') },
    { icon: MapPin, label: t('planningTools.venueFinder'), count: '100+' },
  ]

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Global Background with Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-brand-50/80 via-white to-pink-50/60 -z-20" />
      
      {/* Decorative Pattern Overlay */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Subtle dot pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #F14836 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        
        {/* Floating gradient orbs */}
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-brand-200/40 to-pink-200/30 blur-3xl" />
        <div className="absolute top-[40%] left-[0%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-200/30 to-brand-200/20 blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-bl from-pink-200/30 to-purple-200/20 blur-3xl" />
        <div className="absolute bottom-[5%] left-[20%] w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-brand-100/40 to-pink-100/30 blur-3xl" />
        
        {/* Decorative lines */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonal-lines" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="#F14836" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
        </svg>
      </div>

      <Header />
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container-custom py-12 md:py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Content - 7 cols */}
              <div className={cn(
                "lg:col-span-7 space-y-8",
                isRTL ? "order-2 lg:order-1" : "order-2 lg:order-1"
              )}>
                {/* Floating Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-brand-100">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span className="text-14 font-medium text-gray-700">{t('badge')}</span>
                </div>

                {/* Main Headline */}
                <div className="space-y-4">
                  <h1 className="text-36 sm:text-48 md:text-56 lg:text-64 font-bold text-gray-900 leading-[1.1] tracking-tight">
                    {t('title')}{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10 text-brand-500">{t('wedding')}</span>
                      <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-200" viewBox="0 0 200 12" preserveAspectRatio="none">
                        <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                    </span>
                    <br />
                    {t('events')}{' '}
                    <span className="text-gray-400">{t('withEase')}</span>
                  </h1>

                  <p className="text-18 md:text-20 text-gray-600 max-w-xl leading-relaxed">
                    {t('description')}
                  </p>
                </div>

                {/* CTA Group */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button
                    size="lg"
                    className="group text-16 font-semibold px-8 py-6 rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 transition-all"
                    asChild
                  >
                    <Link href="/auth/register">
                      {t('ctaDetails.getStarted')}
                      <ArrowRight className={cn("ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform", isRTL && "scale-x-[-1]")} />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="group text-16 font-medium px-6 py-6 text-gray-700 hover:text-brand-500"
                    asChild
                  >
                    <Link href="/events/planning">
                      <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-brand-100 flex items-center justify-center mr-3 group-hover:bg-brand-50 transition-colors">
                        <Play className="w-5 h-5 text-brand-500 ml-0.5" />
                      </div>
                      {t('ctaDetails.exploreFeatures')}
                    </Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className={cn("flex items-center gap-8 pt-4",)}>
                  <div className={cn("flex items-center gap-2")}>
                    <div className={cn("flex", isRTL ? "-space-x-2 flex-row-reverse" : "-space-x-2")}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-pink-400 border-2 border-white flex items-center justify-center shadow-sm relative"
                          style={{ zIndex: isRTL ? 5 - i : i }}
                        >
                          <Users className="w-4 h-4 text-white" />
                        </div>
                      ))}
                    </div>
                    <div className="text-14">
                      <span className="font-bold text-gray-900">+1000</span>
                      <span className={cn("text-gray-500", isRTL ? "mr-1" : "ml-1")}>{t('statistics.happyCouples')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - 5 cols - Floating Cards */}
              <div className={cn(
                "lg:col-span-5 relative",
                isRTL ? "order-1 lg:order-2" : "order-1 lg:order-2"
              )}>
                <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                  {/* Main Event Card */}
                  <div className="absolute inset-4 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                    <Image
                      src={typeof eventsHomeSvg === 'string' ? eventsHomeSvg : eventsHomeSvg.src}
                      alt="Wedding Events"
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-contain p-8"
                      priority
                    />
                  </div>

                  {/* Floating Stats Card - Top Right */}
                  <div className={cn(
                    "absolute -top-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/50",
                    isRTL ? "-left-4" : "-right-4"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-24 font-bold text-gray-900">98%</div>
                        <div className="text-12 text-gray-500">{t('statistics.satisfaction')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Events Card - Bottom Left */}
                  <div className={cn(
                    "absolute -bottom-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/50",
                    isRTL ? "-right-4" : "-left-4"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-brand-600" />
                      </div>
                      <div>
                        <div className="text-24 font-bold text-gray-900">+500</div>
                        <div className="text-12 text-gray-500">{t('statistics.eventsPlanned')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Types Section */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <span className="text-14 font-semibold text-brand-500 uppercase tracking-wider mb-2 block">
                  {t('eventTypes.title')}
                </span>
                <h2 className="text-32 md:text-40 lg:text-48 font-bold text-gray-900">
                  {t('eventTypes.subtitle')}
                </h2>
              </div>
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "self-start md:self-auto rounded-full px-6 md:px-8 py-3 md:py-4 text-16 md:text-18 font-semibold bg-white/80 backdrop-blur-sm border-2 hover:bg-white hover:border-brand-500 transition-all whitespace-nowrap",
                  isRTL && "flex-row-reverse"
                )}
                asChild
              >
                <Link 
                  href="/events/planning" 
                  className={cn("flex items-center gap-2")}
                >
                  <span className="whitespace-nowrap">{t('viewAllEvents')}</span>
                  <ChevronRight className={cn("w-4 h-4 flex-shrink-0")} />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {eventTypes.map((event, index) => {
                const Icon = event.icon
                return (
                  <div
                    key={index}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 hover:border-transparent hover:shadow-2xl hover:bg-white transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    {/* Gradient Background on Hover */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      event.gradient
                    )} />

                    <div className="relative z-10">
                      {/* Icon with colored ring */}
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${event.accent}15` }}
                      >
                        <Icon className="w-8 h-8" style={{ color: event.accent }} />
                      </div>

                      <h3 className="text-22 font-bold text-gray-900 mb-3">
                        {event.title}
                      </h3>
                      <p className="text-14 text-gray-600 leading-relaxed mb-6">
                        {event.description}
                      </p>

                      {/* Arrow */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                        style={{ backgroundColor: event.accent }}
                      >
                        <ArrowRight className={cn("w-5 h-5 text-white", isRTL && "scale-x-[-1]")} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="container-custom relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-14 font-semibold text-brand-500 uppercase tracking-wider mb-2 block">
                {t('features.title')}
              </span>
              <h2 className="text-32 md:text-40 lg:text-48 font-bold text-gray-900 mb-4">
                {t('features.subtitle')}
              </h2>
            </div>

            {/* Features Grid with Connected Line */}
            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 transform -translate-y-1/2" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  const isActive = activeStep === index
                  return (
                    <div
                      key={index}
                      className="relative"
                      onMouseEnter={() => setActiveStep(index)}
                    >
                      {/* Step Indicator */}
                      <div className="hidden lg:flex absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm border-4 border-brand-200 items-center justify-center z-10 transition-all duration-300 shadow-lg"
                        style={{
                          borderColor: isActive ? '#F14836' : undefined,
                          transform: isActive ? 'translateX(-50%) scale(1.1)' : 'translateX(-50%)',
                        }}
                      >
                        <span className={cn(
                          "text-18 font-bold transition-colors",
                          isActive ? "text-brand-500" : "text-gray-400"
                        )}>
                          {feature.step}
                        </span>
                      </div>

                      {/* Card */}
                      <div className={cn(
                        "bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg transition-all duration-300 lg:mt-12 border border-white/50",
                        isActive ? "shadow-2xl transform -translate-y-2 bg-white" : "hover:shadow-xl hover:bg-white"
                      )}>
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                          isActive ? "bg-brand-500" : "bg-brand-50"
                        )}>
                          <Icon className={cn(
                            "w-7 h-7 transition-colors",
                            isActive ? "text-white" : "text-brand-500"
                          )} />
                        </div>

                        <h3 className="text-20 font-bold text-gray-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-14 text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Planning Tools Section */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div>
                  <span className="text-14 font-semibold text-brand-500 uppercase tracking-wider mb-2 block">
                    {t('benefits.title')}
                  </span>
                  <h2 className="text-32 md:text-40 lg:text-48 font-bold text-gray-900 mb-4">
                    {t('benefits.subtitle')}
                  </h2>
                  <p className="text-18 text-gray-600 leading-relaxed">
                    {t('description')}
                  </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {planningTools.map((tool, index) => {
                    const Icon = tool.icon
                    return (
                      <div
                        key={index}
                        className="group p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-brand-100 hover:bg-white hover:border-brand-200 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <Icon className="w-6 h-6 text-brand-500 mb-3 group-hover:scale-110 transition-transform" />
                        <div className="text-14 font-medium text-gray-900 mb-1">{tool.label}</div>
                        <div className="text-12 text-gray-600">{tool.count}</div>
                      </div>
                    )
                  })}
                </div>

                <Button
                  size="lg"
                  className="text-16 font-semibold px-8 py-6 rounded-2xl shadow-lg shadow-brand-500/25"
                  asChild
                >
                  <Link href="/auth/register">
                    {t('ctaDetails.getStarted')}
                    <ArrowRight className={cn("ml-2 w-5 h-5", isRTL && "scale-x-[-1]")} />
                  </Link>
                </Button>
              </div>

              {/* Right - Stats */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-brand-500 to-pink-500 rounded-3xl p-8 text-center shadow-xl">
                    <div className="text-48 md:text-56 font-bold mb-2 text-white">+500</div>
                    <div className="text-16 text-white/90">{t('statistics.eventsPlanned')}</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center mt-8 shadow-xl border border-brand-100">
                    <div className="text-48 md:text-56 font-bold mb-2 text-brand-500">98%</div>
                    <div className="text-16 text-gray-700">{t('statistics.satisfaction')}</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border border-pink-100">
                    <div className="text-48 md:text-56 font-bold mb-2 text-pink-500">24/7</div>
                    <div className="text-16 text-gray-700">{t('statistics.support')}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-brand-500 rounded-3xl p-8 text-center mt-8 shadow-xl">
                    <div className="text-48 md:text-56 font-bold mb-2 text-white">+1K</div>
                    <div className="text-16 text-white/90">{t('statistics.happyCouples')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container-custom">
            <div className="relative max-w-4xl mx-auto">
              {/* CTA Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-xl border border-white/50">
                <div className="relative z-10 space-y-8">
                  <h2 className="text-36 md:text-48 lg:text-56 font-bold text-gray-900">
                    {t('ctaDetails.title')}
                  </h2>
                  <p className="text-18 md:text-20 text-gray-600 max-w-2xl mx-auto">
                    {t('ctaDetails.description')}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                      size="lg"
                      className="group text-16 font-semibold px-10 py-7 rounded-2xl shadow-xl shadow-brand-500/25 hover:shadow-2xl hover:shadow-brand-500/30 transition-all"
                      asChild
                    >
                      <Link href="/auth/register">
                        {t('ctaDetails.getStarted')}
                        <ArrowRight className={cn("ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform", isRTL && "scale-x-[-1]")} />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-16 font-semibold px-10 py-7 rounded-2xl border-2 bg-white/50"
                      asChild
                    >
                      <Link href="/events/planning">
                        {t('ctaDetails.learnMore')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
