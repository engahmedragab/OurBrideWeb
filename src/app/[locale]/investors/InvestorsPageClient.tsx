'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { useI18nLocale } from '@/i18n'
import { usePathname } from '@/i18n/navigation'
import brandLogo from '@/assets/svg/Brand-logo.svg'
import { getContent } from './content'
import { QA_PLAYBOOK_HTML } from './qa-playbook'
import './investors.css'

const TAB_KEYS = ['market', 'whynow', 'traction', 'moat', 'competition', 'built'] as const
type TabKey = (typeof TAB_KEYS)[number]

const DELAYS = ['', 'inv-d1', 'inv-d2', 'inv-d3']

export default function InvestorsPageClient() {
  const locale = useI18nLocale()
  const pathname = usePathname()
  const isRTL = locale === 'ar'
  const c = getContent(locale)

  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('market')
  const [isQAOpen, setIsQAOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const barChartRef = useRef<HTMLDivElement>(null)
  const [barAnimated, setBarAnimated] = useState(false)

  const logoSrc = typeof brandLogo === 'string' ? brandLogo : brandLogo.src

  const switchLocale = useCallback(() => {
    const newLocale = locale === 'ar' ? 'en' : 'ar'
    const newPath = `/${newLocale}${pathname === '/' ? '' : pathname}`
    window.location.href = newPath
  }, [locale, pathname])

  // Progress bar
  useEffect(() => {
    const handleScroll = () => {
      const s = document.documentElement.scrollTop
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current && h > 0) {
        progressRef.current.style.width = `${(s / h) * 100}%`
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Reveal on scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const els = container.querySelectorAll('.inv-reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (x.isIntersecting) x.target.classList.add('inv-visible')
        })
      },
      { threshold: 0.1 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Bar chart animation
  useEffect(() => {
    const el = barChartRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (x.isIntersecting) {
            setBarAnimated(true)
            obs.unobserve(x.target)
          }
        })
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Close modal on Escape + lock body scroll
  useEffect(() => {
    if (!isQAOpen) return
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsQAOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [isQAOpen])

  const toggleDark = useCallback(() => setIsDark((d) => !d), [])

  return (
    <div
      ref={containerRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`investors-page${isDark ? ' inv-dark' : ''}`}
    >
      <div ref={progressRef} className="inv-progress" />

      {/* NAV */}
      <nav className="inv-nav">
        <a href="#top" className="inv-nav-logo">
          <Image src={logoSrc} alt="OurBride" width={120} height={48} style={{ height: 48, width: 'auto' }} />
        </a>
        <div className="inv-nav-center">{c.nav.center}</div>
        <div className="inv-nav-right">
          <button className="inv-nav-lang" onClick={switchLocale} title={c.nav.langLabel}>
            {c.nav.langLabel}
          </button>
          <button className="inv-nav-toggle" onClick={toggleDark} title="Toggle dark mode">
            &#x25D0;
          </button>
          <a href="mailto:info@our-bride.com" className="inv-nav-cta">
            {c.nav.cta}
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="inv-hero" id="top">
        <div className="inv-hero-eyebrow">{c.hero.eyebrow}</div>
        <h1>
          {c.hero.title1}
          <br />
          <span className="inv-accent">{c.hero.title2}</span>
          <br />
          {c.hero.title3}
        </h1>
        <div className="inv-hero-underline" />
        <p className="inv-hero-desc">{c.hero.desc}</p>
        <div className="inv-hero-highlight">{c.hero.highlight}</div>
        <div className="inv-hero-ctas">
          <a href="mailto:info@our-bride.com" className="inv-btn-primary">
            {c.hero.ctaPrimary}
          </a>
          <a href="#built" className="inv-btn-ghost">
            {c.hero.ctaSecondary}
          </a>
        </div>
        <div className="inv-scroll-hint">{c.hero.scroll}</div>
      </section>

      {/* STATS BAR */}
      <div className="inv-stats-bar">
        {c.stats.map((stat, i) => (
          <div key={stat.label} className={`inv-stat-cell inv-reveal ${DELAYS[i] || ''}`}>
            <div className="inv-stat-val">{stat.val}</div>
            <div className="inv-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ALREADY BUILT */}
      <section className="inv-sec inv-sec-alt" id="built">
        <div className="inv-sec-num inv-reveal">{c.built.num}</div>
        <h2 className="inv-reveal">
          {c.built.title1}
          <br />
          <span className="inv-accent">{c.built.title2}</span>
        </h2>
        <p className="inv-body-lg inv-reveal" style={{ maxWidth: 600, marginBottom: 52 }}>
          {c.built.desc}
        </p>
        <div className="inv-built-grid">
          {c.built.items.map((item, i) => (
            <div key={item.title} className={`inv-built-item inv-reveal ${DELAYS[i % 4] || ''}`}>
              <div className={`inv-built-check ${item.done ? 'inv-done' : 'inv-soon'}`}>
                {item.done ? '✓' : '→'}
              </div>
              <div className="inv-built-item-text">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="inv-sec" id="problem">
        <div className="inv-sec-num inv-reveal">{c.problem.num}</div>
        <h2 className="inv-reveal">
          {c.problem.title1}
          <br />
          <span className="inv-accent">{c.problem.title2}</span>
        </h2>
        <p className="inv-body-lg inv-reveal" style={{ maxWidth: 620, marginBottom: 32 }}>
          {c.problem.desc}
        </p>
        <div className="inv-killer-line inv-reveal">{c.problem.killerLine}</div>
        <div className="inv-problem-cols">
          {c.problem.cards.map((card, i) => (
            <div key={card.title} className={`inv-prob-card inv-reveal ${DELAYS[i] || ''}`}>
              <div className="inv-prob-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARKET */}
      <section className="inv-sec inv-sec-alt" id="market-section">
        <div className="inv-sec-num inv-reveal">{c.market.num}</div>
        <div className="inv-market-top">
          <div className="inv-reveal">
            <div className="inv-big-fig">{c.market.bigFig}</div>
            <div className="inv-big-fig-sub">{c.market.bigFigSub}</div>
            <p className="inv-body-lg" style={{ maxWidth: 400 }}>
              {c.market.desc}
            </p>
            <div className="inv-wedge-line">{c.market.wedge}</div>
          </div>
          <div className="inv-reveal inv-d1">
            <div className="inv-market-cards">
              {c.market.cards.map((card) => (
                <div key={card.label} className="inv-mcard">
                  <div className="inv-mcard-label">{card.label}</div>
                  <div className="inv-mcard-val">{card.val}</div>
                  <div className="inv-mcard-arrow">{card.arrow}</div>
                  <span className="inv-cagr-badge">{card.cagr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div ref={barChartRef} className="inv-bar-chart inv-reveal">
          {c.market.bars.map((bar) => (
            <div key={bar.name} className="inv-bar-row">
              <span className="inv-bar-name">{bar.name}</span>
              <div className="inv-bar-track">
                <div
                  className="inv-bar-fill"
                  style={{
                    width: barAnimated ? `${bar.w}%` : '0%',
                    ...(bar.gold ? { background: 'var(--inv-gold)' } : {}),
                  }}
                />
              </div>
              <span className="inv-bar-val">{bar.val}</span>
            </div>
          ))}
        </div>

        {/* TAM SAM SOM */}
        <div className="inv-tsm-row">
          {[c.market.tam, c.market.sam, c.market.som].map((item, i) => (
            <div key={item.tag} className={`inv-tsm-item inv-reveal ${DELAYS[i] || ''}`}>
              <div className="inv-tsm-tag">{item.tag}</div>
              <div className="inv-tsm-val">{item.val}</div>
              <div className="inv-tsm-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TRACTION */}
      <section className="inv-sec inv-traction-sec" id="traction-section">
        <div className="inv-sec-num inv-reveal">{c.traction.num}</div>
        <h2 className="inv-reveal">
          {c.traction.title1}
          <br />
          <span className="inv-accent">{c.traction.title2}</span>
        </h2>
        <p
          className="inv-reveal"
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: 'rgba(255,255,255,.4)',
            maxWidth: 560,
            marginBottom: 52,
          }}
        >
          {c.traction.desc}
        </p>
        <div className="inv-traction-grid">
          {c.traction.items.map((item, i) => (
            <div key={item.label} className={`inv-tr-item inv-reveal ${DELAYS[i % 3] || ''}`}>
              <div className="inv-tr-val">{item.val}</div>
              <div className="inv-tr-label">{item.label}</div>
              <div className="inv-tr-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section className="inv-sec" id="solution">
        <div className="inv-sec-num inv-reveal">{c.solution.num}</div>
        <h2 className="inv-reveal">
          {c.solution.title1}
          <br />
          <span className="inv-accent">{c.solution.title2}</span>
        </h2>
        <p className="inv-body-lg inv-reveal" style={{ maxWidth: 600, marginBottom: 52 }}>
          {c.solution.desc}
        </p>
        <div className="inv-pillars inv-pillars-4">
          {c.solution.pillars.map((pillar, i) => (
            <div key={pillar.num} className={`inv-pillar inv-reveal ${DELAYS[i % 4] || ''}`}>
              <div className="inv-pillar-num">{pillar.num}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BUSINESS MODEL */}
      <section className="inv-sec inv-sec-alt" id="model">
        <div className="inv-sec-num inv-reveal">{c.model.num}</div>
        <h2 className="inv-reveal">
          {c.model.title1}
          <br />
          <span className="inv-accent">{c.model.title2}</span>
        </h2>
        <div className="inv-rev-streams">
          {c.model.streams.map((rev, i) => (
            <div key={rev.title} className={`inv-rev-item inv-reveal ${DELAYS[i] || ''}`}>
              <div className="inv-rev-icon">{rev.icon}</div>
              <h4>{rev.title}</h4>
              <p>{rev.desc}</p>
              <div className="inv-rev-pct">{rev.pct}</div>
            </div>
          ))}
        </div>

        {/* Unit Economics */}
        <div className="inv-unit-econ inv-reveal">
          {c.model.unitEcon.map((item, i) => (
            <div key={i} className="inv-unit-item">
              <div className="inv-unit-label">{item.label}</div>
              <div className="inv-unit-val">{item.val}</div>
              <div className="inv-unit-desc">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="inv-flywheel-box inv-reveal">
          <p>
            <strong>{c.model.flywheel}</strong> {c.model.flywheelDesc}
          </p>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="inv-sec" id="roadmap">
        <div className="inv-sec-num inv-reveal">{c.roadmap.num}</div>
        <h2 className="inv-reveal" style={{ marginBottom: 40 }}>
          {c.roadmap.title1}
          <br />
          <span className="inv-accent">{c.roadmap.title2}</span>
        </h2>
        <div className="inv-roadmap">
          {c.roadmap.phases.map((phase, i) => (
            <div
              key={phase.date}
              className={`inv-road-phase${phase.now ? ' inv-now' : ''} inv-reveal ${DELAYS[i] || ''}`}
            >
              <div className="inv-road-dot" />
              <div className="inv-r-date">{phase.date}</div>
              <h4>{phase.title}</h4>
              <ul>
                {phase.items.map((item) => (
                  <li key={item.text} className={item.done ? 'inv-done' : ''}>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM / WHY US */}
      <section className="inv-sec inv-sec-alt" id="team">
        <div className="inv-sec-num inv-reveal">{c.team.num}</div>
        <h2 className="inv-reveal">
          {c.team.title1}
          <br />
          <span className="inv-accent">{c.team.title2}</span>
        </h2>
        <div className="inv-team-grid">
          {c.team.members.map((member, i) => (
            <div key={member.name} className={`inv-team-card inv-reveal ${DELAYS[i] || ''}`}>
              <div
                className="inv-avatar"
                style={
                  member.color === 'gold'
                    ? { background: 'var(--inv-gold)' }
                    : member.color === 'mid'
                      ? { background: 'var(--inv-mid)' }
                      : undefined
                }
              >
                {member.initials}
              </div>
              <h4>{member.name}</h4>
              <div className="inv-role">{member.role}</div>
              <p>{member.desc}</p>
            </div>
          ))}
        </div>
        <div className="inv-conviction-box inv-reveal">
          <p>{c.team.conviction}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="inv-sec" id="faq">
        <div className="inv-sec-num inv-reveal">{c.faq.num}</div>
        <h2 className="inv-reveal" style={{ marginBottom: 40 }}>
          {c.faq.title1}
          <br />
          <span className="inv-accent">{c.faq.title2}</span>
        </h2>
        <div className="inv-tabs">
          {TAB_KEYS.map((key) => (
            <button
              key={key}
              className={`inv-tab-btn${activeTab === key ? ' inv-active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {c.faq.tabs[key]}
            </button>
          ))}
        </div>
        {TAB_KEYS.map((key) => (
          <div key={key} className={`inv-tab-panel${activeTab === key ? ' inv-active' : ''}`}>
            <h3>{c.faq.panels[key].q}</h3>
            {c.faq.panels[key].a.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ))}
        <button className="inv-playbook-btn" onClick={() => setIsQAOpen(true)}>
          {c.faq.playbookBtn}
        </button>
      </section>

      {/* THE ASK */}
      <section className="inv-ask-sec" id="ask">
        <div className="inv-sec-num">{c.ask.num}</div>
        <h2>
          {c.ask.title1}
          <br />
          <span className="inv-accent">{c.ask.title2}</span>
        </h2>
        <p className="inv-ask-desc">{c.ask.desc}</p>
        <div className="inv-funds-grid">
          {c.ask.funds.map((fund, i) => (
            <div key={i} className="inv-fund-item">
              <div className="inv-fund-pct">{fund.pct}</div>
              <div className="inv-fund-label">
                {fund.line1}
                <br />
                {fund.line2}
              </div>
            </div>
          ))}
        </div>
        <div className="inv-contact-row">
          <div>
            <p>{c.ask.contactLine1}</p>
            <p>
              <a href="mailto:info@our-bride.com">info@our-bride.com</a> &nbsp;&middot;&nbsp;{' '}
              <a href="https://our-bride.com" target="_blank" rel="noopener noreferrer">
                our-bride.com
              </a>
            </p>
          </div>
          <a
            href="mailto:info@our-bride.com"
            className="inv-btn-primary"
            style={{ flexShrink: 0, fontSize: 15, padding: '16px 32px' }}
          >
            {c.ask.contactCta}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="inv-footer">
        <Image src={logoSrc} alt="OurBride" width={100} height={40} className="inv-footer-logo" />
        <div>
          {c.footer.copy} &middot;{' '}
          <a href="https://our-bride.com" target="_blank" rel="noopener noreferrer">
            our-bride.com
          </a>
        </div>
      </footer>

      {/* Q&A PLAYBOOK MODAL */}
      {isQAOpen && (
        <div className="inv-modal-overlay" onClick={() => setIsQAOpen(false)}>
          <div className="inv-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="inv-modal-close" onClick={() => setIsQAOpen(false)}>
              ✕
            </button>
            <iframe className="inv-modal-iframe" srcDoc={QA_PLAYBOOK_HTML} title="Q&A Playbook" />
          </div>
        </div>
      )}
    </div>
  )
}
