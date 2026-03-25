/**
 * Q&A Playbook HTML — rendered inside an iframe on the Investors page.
 * Complete self-contained HTML document with inline styles and scripts.
 */
export const QA_PLAYBOOK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OurBride — Complete Q&A Playbook 2026</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --brand: #F14836;
  --brand-darker: #D63D2E;
  --brand-subtle: #FFF5F5;
  --brand-10: rgba(241,72,54,0.1);
  --brand-15: rgba(241,72,54,0.15);
  --brand-20: rgba(241,72,54,0.2);
  --fg: #1C1510;
  --fg-muted: #6B5D50;
  --bg: #ffffff;
  --surface: #FFF5F5;
  --card: #ffffff;
  --border: #e5e5e5;
  --border-light: rgba(0,0,0,0.06);
  --success: #22C55E;
  --success-pale: #f0fdf4;
  --error: #EF4444;
  --error-pale: #fef2f2;
  --info: #3B82F6;
  --info-pale: #eff6ff;
  --purple: #8B5CF6;
  --purple-pale: #f5f3ff;
  --warning: #F59E0B;
  --warning-pale: #fffbeb;
  --radius: 8px;
  --radius-lg: 16px;
  --shadow-raised: 0 4px 20px rgba(0,0,0,0.06);
  --shadow-floating: 0 8px 28px rgba(0,0,0,0.08);
  --font: 'Poppins', sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font);
  font-size: 14px;
  line-height: 1.65;
}

.masthead {
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-darker) 100%);
  padding: 52px 48px 44px;
  position: relative;
  overflow: hidden;
}
.masthead::after {
  content: 'Q&A';
  position: absolute; right: -10px; bottom: -40px;
  font-family: var(--font); font-size: 240px; font-weight: 800;
  color: rgba(255,255,255,0.08); pointer-events: none; line-height: 1;
}
.masthead-eyebrow {
  font-size: 10px; font-weight: 600; letter-spacing: 3px;
  text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 14px;
}
.masthead h1 {
  font-family: var(--font); font-size: 46px; font-weight: 800;
  color: #fff; line-height: 1.15; margin-bottom: 14px;
}
.masthead h1 em { color: rgba(255,255,255,0.85); font-style: normal; font-weight: 500; }
.masthead-desc {
  font-size: 14px; color: rgba(255,255,255,0.7);
  max-width: 620px; margin-bottom: 32px; line-height: 1.7;
}

.phase-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.phase-pill {
  font-size: 9px; font-weight: 600; letter-spacing: 2px;
  text-transform: uppercase; padding: 6px 14px; border-radius: 20px;
  cursor: pointer; transition: all 0.2s; border: 1px solid;
  backdrop-filter: blur(4px);
  background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); color: #fff;
}
.phase-pill:hover { background: rgba(255,255,255,0.25); }

.toc-bar {
  background: var(--card); border-bottom: 1px solid var(--border-light);
  padding: 0 48px; display: flex; gap: 0; overflow-x: auto;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.toc-item {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.5px; text-transform: uppercase;
  padding: 14px 18px; white-space: nowrap;
  cursor: pointer; border-bottom: 2px solid transparent;
  transition: all 0.15s; color: var(--fg-muted);
  text-decoration: none; display: block; margin-bottom: -1px;
}
.toc-item:hover { color: var(--fg); }
.toc-item.active { color: var(--brand); border-bottom-color: var(--brand); }

.content { max-width: 1100px; margin: 0 auto; padding: 0 48px 80px; }

.phase-header {
  display: flex; align-items: flex-start; gap: 24px;
  padding: 52px 0 28px; border-bottom: 2px solid var(--brand);
  margin-bottom: 40px;
}
.phase-num {
  font-size: 72px; font-weight: 800;
  line-height: 1; color: var(--brand-15); flex-shrink: 0;
}
.phase-info h2 {
  font-size: 32px; font-weight: 700;
  line-height: 1.15; margin-bottom: 6px; color: var(--fg);
}
.phase-info p { font-size: 13px; color: var(--fg-muted); max-width: 580px; }

.phase-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 10px; letter-spacing: 1px;
  text-transform: uppercase; padding: 3px 10px; border-radius: 20px;
  margin-bottom: 12px; font-weight: 600;
}
.tag-apply { background: var(--brand-10); color: var(--brand-darker); border: 1px solid var(--brand-20); }
.tag-screen { background: var(--success-pale); color: var(--success); border: 1px solid #bbf7d0; }
.tag-deepdive { background: var(--info-pale); color: var(--info); border: 1px solid #bfdbfe; }
.tag-pitch { background: var(--error-pale); color: var(--error); border: 1px solid #fecaca; }
.tag-closing { background: var(--purple-pale); color: var(--purple); border: 1px solid #ddd6fe; }
.tag-hard { background: var(--warning-pale); color: var(--warning); border: 1px solid #fde68a; }

.qa-card {
  background: var(--card); border: 1px solid var(--border-light);
  border-radius: var(--radius); overflow: hidden;
  transition: box-shadow 0.2s;
  margin-bottom: 14px;
}
.qa-card:hover { box-shadow: var(--shadow-raised); }
.qa-card-stripe { height: 3px; }
.stripe-gold { background: var(--brand); }
.stripe-green { background: var(--success); }
.stripe-blue { background: var(--info); }
.stripe-rust { background: var(--error); }
.stripe-purple { background: var(--purple); }

.qa-question {
  padding: 18px 22px 14px;
  cursor: pointer; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
}
.qa-question-left { flex: 1; }
.qa-q-label {
  font-size: 10px; letter-spacing: 1px;
  text-transform: uppercase; color: var(--fg-muted); margin-bottom: 6px;
}
.qa-q-text {
  font-size: 16px; font-weight: 700;
  line-height: 1.4; color: var(--fg);
}
.qa-toggle {
  font-size: 20px; color: var(--fg-muted);
  flex-shrink: 0; padding-top: 2px; transition: transform 0.2s;
  user-select: none; width: 28px; height: 28px; display: flex;
  align-items: center; justify-content: center; border-radius: 50%;
  background: var(--surface);
}
.qa-card.open .qa-toggle { transform: rotate(45deg); color: var(--brand); background: var(--brand-10); }

.qa-answer {
  max-height: 0; overflow: hidden;
  transition: max-height 0.35s ease, padding 0.2s ease;
  border-top: 1px solid transparent;
}
.qa-card.open .qa-answer {
  max-height: 2000px;
  border-top-color: var(--border-light);
  padding-bottom: 4px;
}

.qa-answer-inner { padding: 20px 22px 22px; }
.qa-answer-inner p { font-size: 14px; line-height: 1.75; margin-bottom: 12px; }
.qa-answer-inner p:last-child { margin-bottom: 0; }
.qa-answer-inner strong { font-weight: 600; }
.qa-answer-inner em { font-style: normal; color: var(--brand); font-weight: 600; }

.answer-headline {
  font-size: 15px; font-weight: 600;
  color: var(--brand-darker); border-left: 3px solid var(--brand);
  padding: 10px 16px; background: var(--brand-10);
  margin-bottom: 14px; border-radius: 0 var(--radius) var(--radius) 0;
  line-height: 1.5;
}
.stat-row {
  display: flex; flex-wrap: wrap; gap: 10px; margin: 14px 0;
}
.stat-chip {
  background: var(--surface); border: 1px solid var(--border-light);
  border-radius: var(--radius); padding: 8px 14px;
  font-size: 12px;
}
.stat-chip strong { font-size: 18px; display: block; color: var(--brand); line-height: 1.2; font-weight: 700; }

.bullet-list { list-style: none; margin: 10px 0; }
.bullet-list li {
  display: flex; gap: 10px; margin-bottom: 8px; font-size: 13px; line-height: 1.6;
}
.bullet-list li::before {
  content: '\u2192'; color: var(--brand);
  font-size: 12px; padding-top: 2px; flex-shrink: 0; font-weight: 700;
}

.answer-warn {
  background: var(--error-pale); border: 1px solid #fecaca;
  border-radius: var(--radius); padding: 12px 16px; margin: 12px 0;
  font-size: 12px; color: var(--error); font-weight: 500;
}
.answer-warn::before { content: '\u26A0 AVOID: '; font-weight: 700; }

.answer-tip {
  background: var(--success-pale); border: 1px solid #bbf7d0;
  border-radius: var(--radius); padding: 12px 16px; margin: 12px 0;
  font-size: 12px; color: var(--success); font-weight: 500;
}
.answer-tip::before { content: '\u2713 TIP: '; font-weight: 700; }

.divider-label {
  font-size: 10px; letter-spacing: 2px; font-weight: 700;
  text-transform: uppercase; color: var(--fg-muted);
  margin: 32px 0 16px; display: flex; align-items: center; gap: 12px;
}
.divider-label::after { content: ''; flex: 1; height: 1px; background: var(--border-light); }

.callout-box {
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-darker) 100%);
  color: #fff; border-radius: var(--radius-lg);
  padding: 28px 32px; margin: 28px 0;
}
.callout-box h4 { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 12px; }
.callout-box p { font-size: 13px; line-height: 1.7; opacity: 0.9; margin-bottom: 8px; }
.callout-box p:last-child { margin-bottom: 0; }
.callout-box strong { color: #fff; font-weight: 700; }

.one-liner {
  background: var(--brand-10);
  border: 1px solid var(--brand-20); border-radius: var(--radius);
  padding: 16px 20px; margin: 16px 0;
  font-size: 15px; font-weight: 600;
  line-height: 1.6; color: var(--brand-darker);
}

.phase-section { padding-top: 12px; }

@media (max-width: 640px) {
  .masthead { padding: 32px 20px 28px; }
  .masthead h1 { font-size: 30px; }
  .content { padding: 0 20px 60px; }
  .toc-bar { padding: 0 16px; }
  .phase-num { font-size: 48px; }
  .phase-info h2 { font-size: 24px; }
}
</style>
</head>
<body>

<div class="masthead">
  <div class="masthead-eyebrow">OurBride \u00B7 Wedding OS \u00B7 Complete Playbook \u00B7 2026</div>
  <h1>Every Question.<br><em>Every Phase.</em><br>Perfect Answers.</h1>
  <div class="masthead-desc">From the first application form to the closing call — every question accelerators, VCs, judges, and committees will ask, with precise answers grounded in OurBride's real numbers, live platform, and traction.</div>
  <div class="phase-pills">
    <div class="phase-pill" onclick="scrollTo('phase-apply')">Phase 1 \u00B7 Application Forms</div>
    <div class="phase-pill" onclick="scrollTo('phase-screen')">Phase 2 \u00B7 Screening Call</div>
    <div class="phase-pill" onclick="scrollTo('phase-deepdive')">Phase 3 \u00B7 Deep Dive / DD</div>
    <div class="phase-pill" onclick="scrollTo('phase-pitch')">Phase 4 \u00B7 Pitch Day</div>
    <div class="phase-pill" onclick="scrollTo('phase-closing')">Phase 5 \u00B7 Term Sheet</div>
    <div class="phase-pill" onclick="scrollTo('phase-hard')">\u26A1 Hardball Questions</div>
  </div>
</div>

<div class="toc-bar">
  <a class="toc-item" onclick="scrollTo('phase-apply')">01 \u00B7 Application</a>
  <a class="toc-item" onclick="scrollTo('phase-screen')">02 \u00B7 Screening</a>
  <a class="toc-item" onclick="scrollTo('phase-deepdive')">03 \u00B7 Deep Dive</a>
  <a class="toc-item" onclick="scrollTo('phase-pitch')">04 \u00B7 Pitch Day</a>
  <a class="toc-item" onclick="scrollTo('phase-closing')">05 \u00B7 Term Sheet</a>
  <a class="toc-item" onclick="scrollTo('phase-hard')">\u26A1 Hardball</a>
</div>

<div class="content">

<!-- PHASE 1: APPLICATION -->
<div id="phase-apply" class="phase-section">
  <div class="phase-header">
    <div class="phase-num">01</div>
    <div class="phase-info">
      <h2>Application Form Questions</h2>
      <p>Short-form fields in accelerator and VC applications. Every word counts — character limits are tight.</p>
    </div>
  </div>

  <div class="callout-box">
    <h4>Master One-Liner — Use This Everywhere</h4>
    <p><strong>OurBride is the Wedding Operating System for Egypt</strong> — one platform for planning, shopping, and booking every wedding need, turning a 90% informal \$3.2B market into a structured, scalable commerce engine for millions of Egyptian brides.</p>
  </div>

  <div class="divider-label">Core Identity</div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-apply">Application</span> Describe your startup in one sentence</div>
        <div class="qa-q-text">What does your company do?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <div class="answer-headline">"OurBride is Egypt's Wedding Operating System — one platform to plan, shop, and book every wedding need, becoming the distribution engine for wedding vendors across MENA."</div>
      <p><strong>Longer version (if more space):</strong> We serve three customer types: brides who need planning tools and curated shopping, wedding vendors who need discovery and booking infrastructure, and the bridal beauty market that needs a trusted e-commerce channel. What began as a wedding planner evolved into a full-stack wedding OS — the missing infrastructure layer between Egypt's 600K+ annual brides and the \$3.2B wedding economy.</p>
      <div class="answer-tip">Lead with the infrastructure/OS angle — not "a wedding app." Infrastructure language scores higher with investors because it signals scale and defensibility.</div>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-apply">Application</span></div>
        <div class="qa-q-text">What problem are you solving?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <div class="answer-headline">90% of Egypt's wedding transactions still run on WhatsApp, cash, and word of mouth. We are building the first structured operating layer.</div>
      <p>Egypt's wedding industry is a \$3.2B annual market operating entirely in the informal economy. Brides manage 15\u201320 vendors over WhatsApp. Vendors track bookings on Excel. Stores sell bridal products through unverified Instagram accounts. There is no digital layer connecting bride \u2192 vendor \u2192 product \u2192 booking \u2192 payment. We built that layer.</p>
      <ul class="bullet-list">
        <li>Brides manage 15\u201320 vendors with no digital trail, no oversight, no protection</li>
        <li>50,000+ wedding professionals have no structured way to reach brides beyond Instagram DMs</li>
        <li>Bridal beauty and essentials are purchased from scattered offline shops — no trusted alternative</li>
        <li>The market is \$3.2B annually and growing — but entirely undigitized</li>
      </ul>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-apply">Application</span></div>
        <div class="qa-q-text">What is your solution?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>OurBride is a single platform with interconnected modules: <strong>(1) Wedding Planner</strong> — budget tracking, guest list, event timeline, and task management built for Egyptian wedding culture; <strong>(2) Bridal Store</strong> — curated e-commerce with 332+ bridal beauty products from trusted brands; <strong>(3) Provider Marketplace</strong> — discover, compare, and book verified wedding vendors with secure payment; <strong>(4) Bride Community</strong> — social layer where brides share experiences and discover trends; <strong>(5) Provider Dashboard</strong> — SaaS tools for wedding professionals. The modules feed each other: planning brings brides to the store, the store brings them to vendors, vendors bring more brides through referrals.</p>
      <div class="stat-row">
        <div class="stat-chip"><strong>100%</strong>Platform Live</div>
        <div class="stat-chip"><strong>3</strong>Platforms (Web+iOS+Android)</div>
        <div class="stat-chip"><strong>333</strong>Registered Clients</div>
        <div class="stat-chip"><strong>332</strong>Products Live</div>
        <div class="stat-chip"><strong>5.0\u2605</strong>App Store Rating</div>
      </div>
    </div></div>
  </div>

  <div class="divider-label">Market & Scale</div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-apply">Application</span></div>
        <div class="qa-q-text">What is the market size? (TAM / SAM / SOM)</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <div class="stat-row">
        <div class="stat-chip"><strong>\$3.2B</strong>TAM — Total Egyptian wedding spend annually</div>
        <div class="stat-chip"><strong>\$800M</strong>SAM — Digital-ready wedding categories</div>
        <div class="stat-chip"><strong>\$24M</strong>SOM — Year 3 target (3% SAM capture)</div>
      </div>
      <p><strong>Supporting data:</strong> Egypt registers 600,000+ marriages annually. Average wedding spend is \$5,000\u2013\$30,000. Egypt e-commerce reached \$9.1B in 2024, growing at 13.9% CAGR toward \$29B by 2032. Egypt Beauty & Care is \$1.85B growing to \$3.1B by 2033. MENA wedding market is \$12B+. The physical wedding services layer is almost entirely undigitized — 90% of transactions happen offline.</p>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-apply">Application</span></div>
        <div class="qa-q-text">What is your current traction / stage?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <div class="answer-headline">Live platform, live mobile apps, 333 clients, 332 products — before a single investor dollar.</div>
      <div class="stat-row">
        <div class="stat-chip"><strong>333</strong>Registered Clients</div>
        <div class="stat-chip"><strong>332</strong>Products Live</div>
        <div class="stat-chip"><strong>5.0\u2605</strong>App Store Rating</div>
        <div class="stat-chip"><strong>3</strong>Live Platforms</div>
        <div class="stat-chip"><strong>2</strong>Countries Listed</div>
        <div class="stat-chip"><strong>18mo</strong>Built In</div>
      </div>
      <p>The platform is 100% complete — full website in Arabic and English, mobile app live on both iOS App Store and Google Play, wedding planner with budget and guest list, bridal e-commerce store with 332 products, community layer with real Arabic content, and provider discovery. Every module is built, tested, and serving real users. This is not a prototype asking for build capital — it is a running system asking for growth capital.</p>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-apply">Application</span></div>
        <div class="qa-q-text">What is your business model / how do you make money?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>Revenue at every level of the stack — four independent streams that compound as the network grows:</p>
      <ul class="bullet-list">
        <li><strong>E-Commerce (LIVE NOW):</strong> Product margins on bridal beauty and wedding items through the OurBride store. 332 products live and generating real transactions.</li>
        <li><strong>Booking Commission (NEXT):</strong> 8\u201315% commission on every vendor booking made through the platform. Scales directly with marketplace liquidity.</li>
        <li><strong>Provider SaaS (NEXT):</strong> Monthly subscription for wedding professionals using booking management, scheduling, and analytics tools.</li>
        <li><strong>Featured Placement (YEAR 2):</strong> Premium visibility for vendors in search results and homepage spotlights. High-margin with zero additional cost.</li>
      </ul>
      <p>The flywheel: more brides attract more providers \u2192 more providers improve selection \u2192 better selection drives more bookings \u2192 more bookings fund product development \u2192 better product attracts more brides. Each turn compounds.</p>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-apply">Application</span></div>
        <div class="qa-q-text">Why now? What makes this the right timing?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>Three converging trends make 2024\u20132026 the right moment:</p>
      <ul class="bullet-list">
        <li><strong>Smartphone Penetration 70%+:</strong> Mobile commerce is now the dominant behavior in Egypt. The generation getting married expects digital experiences.</li>
        <li><strong>Post-Pandemic Wedding Surge:</strong> Delayed ceremonies are happening now, driving record vendor demand. More brides than ever are looking for organized planning tools.</li>
        <li><strong>Supply Side Ready:</strong> 50,000+ wedding vendors are already on Instagram but desperate for structured booking and payment. They need the infrastructure we built.</li>
      </ul>
      <div class="stat-row">
        <div class="stat-chip"><strong>70%+</strong>Smartphone Penetration</div>
        <div class="stat-chip"><strong>600K+</strong>Marriages/Year</div>
        <div class="stat-chip"><strong>90%</strong>Still Offline</div>
        <div class="stat-chip"><strong>#1</strong>First Mover in Egypt</div>
      </div>
    </div></div>
  </div>

  <div class="divider-label">Team & Competition</div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-apply">Application</span></div>
        <div class="qa-q-text">What is your unfair advantage / moat?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>Three advantages that are difficult or impossible to replicate:</p>
      <ul class="bullet-list">
        <li><strong>We Already Built It:</strong> Full platform live — web, iOS, Android, e-commerce store. Most competitors are still at directory stage. 333 clients and 332 products before approaching a single investor. You are investing in growth, not construction.</li>
        <li><strong>Data Moat:</strong> Every bride generates irreplaceable behavioral data about Egyptian wedding patterns and preferences. A new entrant starts with zero data.</li>
        <li><strong>No Direct Competitor:</strong> Zafaf.net, ArabiaWeddings, WEDDnGO, and Farahy are pure directories — no commerce, no planning tools, no provider SaaS. We own a category no one else has built.</li>
      </ul>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-apply">Application</span></div>
        <div class="qa-q-text">How much are you raising and what will you use it for?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>We are raising a <strong>seed round</strong> focused entirely on growth — the product is already built. Use of funds:</p>
      <ul class="bullet-list">
        <li><strong>Provider Acquisition (40%):</strong> Onboard 200+ verified wedding vendors to fill the marketplace</li>
        <li><strong>Growth & Marketing (25%):</strong> Influencer partnerships, content marketing, SEO push to drive bride acquisition</li>
        <li><strong>Team (25%):</strong> 2 key seed hires — Head of Growth and Head of Marketplace</li>
        <li><strong>Infrastructure (10%):</strong> Payment rails, logistics, and tooling to support marketplace transactions</li>
      </ul>
      <p>The platform is fully built — this capital goes entirely to growth, not construction.</p>
    </div></div>
  </div>
</div>

<!-- PHASE 2: SCREENING -->
<div id="phase-screen" class="phase-section">
  <div class="phase-header">
    <div class="phase-num">02</div>
    <div class="phase-info">
      <h2>Screening Call Questions</h2>
      <p>30\u201345 minute call with a program associate or junior investor. Goal: verify fit, check founder conviction, and decide whether to escalate.</p>
    </div>
  </div>

  <div class="callout-box">
    <h4>How to win the screening call</h4>
    <p>The screener is checking three things: <strong>Does this founder know their numbers cold?</strong> Does the model make intuitive sense? Is this person someone we want to work with? Be direct, confident, specific. Never say "around" or "approximately" — say the number.</p>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-green"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-screen">Screening</span></div>
        <div class="qa-q-text">Tell me about OurBride in 2 minutes.</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <div class="one-liner">"Egypt has 600,000+ marriages a year — a \$3.2B market — and 90% of it still runs on WhatsApp, cash, and word of mouth. We built the operating system to fix that."</div>
      <p>Then: <strong>"OurBride is one platform that does three things: helps brides plan their wedding, shop for bridal products, and book verified vendors. Think of it as the Zola + The Knot for the Arab world — but built specifically for the Egyptian market."</strong></p>
      <p>Then: <strong>"We are not pitching you a deck with a vision. We are showing you a live system with 333 clients, 332 products, apps on both stores with a 5.0 rating, and an active Arabic community — all built in 18 months before a single investor dollar."</strong></p>
      <p>Then land on the flywheel: <strong>"More brides attract more providers. More providers improve selection. Better selection drives more bookings. More bookings fund development. That's the OurBride flywheel."</strong></p>
      <div class="answer-tip">Practice this to under 2 minutes. Internalize the three points: the problem (90% informal), the platform (plan + shop + book), the traction (already live).</div>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-green"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-screen">Screening</span></div>
        <div class="qa-q-text">How did you build this without funding?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>OurBride was built by a founder with deep technical expertise and understanding of the Egyptian wedding market. The entire platform — web, iOS, Android, e-commerce store, planner tools, community — was built in under 18 months through focused execution and efficient use of modern development frameworks.</p>
      <p>This is a significant competitive advantage: the typical seed-stage startup is asking investors to fund a build. We are asking investors to fund growth on a system that is already running. This means our burn rate through the seed round is materially lower than a company starting from scratch — more of every dollar goes to market expansion.</p>
      <div class="answer-tip">This is one of your strongest cards. Play it clearly: "We had the technical skill. We had the market knowledge. We didn't wait for funding to start — we built first, then came to investors with proof."</div>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-green"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-screen">Screening</span></div>
        <div class="qa-q-text">Who are your customers and how do you acquire them?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>We serve two customer types, and the acquisition model creates a flywheel:</p>
      <ul class="bullet-list">
        <li><strong>Brides (demand side):</strong> Acquired through content marketing, Arabic SEO, Instagram/TikTok influencer partnerships, and word of mouth. 333 registered organically with zero paid acquisition. Community content creates organic discovery.</li>
        <li><strong>Wedding Vendors (supply side):</strong> Acquired through direct outreach, vendor networks, and the marketplace value proposition. Each vendor onboarded improves selection for brides, which attracts more brides, which attracts more vendors.</li>
      </ul>
      <p>CAC is very low right now because (1) organic community content drives discovery, (2) the bridal store creates natural engagement, and (3) wedding planning is inherently social — brides recommend tools to other brides.</p>
    </div></div>
  </div>
</div>

<!-- PHASE 3: DEEP DIVE -->
<div id="phase-deepdive" class="phase-section">
  <div class="phase-header">
    <div class="phase-num">03</div>
    <div class="phase-info">
      <h2>Deep Dive & Due Diligence</h2>
      <p>Partner-level meetings, technical reviews, and formal DD sessions. Questions get harder and more specific. Numbers must be exact.</p>
    </div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-blue"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-deepdive">Deep Dive</span></div>
        <div class="qa-q-text">What are your biggest risks and how are you mitigating them?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p><strong>Risk 1: Vendor adoption pace</strong><br>Mitigation: (a) We already have a live platform vendors can see and test; (b) the seed round budget includes dedicated marketplace operations hire; (c) the bridal store proves the commerce model — vendors see real transactions happening.</p>
      <p><strong>Risk 2: Marketplace liquidity (chicken-and-egg)</strong><br>Mitigation: We started with the demand side (brides) through planning tools and community, then added the store. Vendors join a platform that already has active brides — not an empty marketplace.</p>
      <p><strong>Risk 3: Egypt macroeconomic volatility</strong><br>Mitigation: Weddings are culturally non-discretionary in Egypt. The market is recession-resistant. Our pricing is in EGP, matching our cost structure.</p>
      <p><strong>Risk 4: A well-funded competitor entering</strong><br>Mitigation: (a) Building a verified vendor network takes 12\u201318 months of relationship-building; (b) our data and community moat grows with every user; (c) the global players (The Knot, Zola) have shown zero interest in Arabic-first markets.</p>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-blue"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-deepdive">Deep Dive</span></div>
        <div class="qa-q-text">How defensible is this business? What stops someone from copying it?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>OurBride has four layers of defensibility that compound over time:</p>
      <ul class="bullet-list">
        <li><strong>Network Effects:</strong> Every bride attracts vendors. Every vendor improves selection for brides. The platform becomes more valuable with every participant — classic marketplace defensibility.</li>
        <li><strong>Data Moat:</strong> Every bride interaction generates behavioral data about Egyptian wedding patterns — what's booked, when, at what price, in which city. A new entrant starts with zero intelligence.</li>
        <li><strong>Brand Trust:</strong> In a market where trust is the key purchasing factor, our verified provider network and secure payment infrastructure become durable advantages over time.</li>
        <li><strong>Supply-Side Lock-in:</strong> Building a verified, active vendor network takes 12\u201318 months of relationship-building that cannot be replicated by cash alone. Vendors who build their profiles, collect reviews, and manage bookings on OurBride have high switching costs.</li>
      </ul>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-blue"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-deepdive">Deep Dive</span></div>
        <div class="qa-q-text">Tell me about the team. Why are you the right person to build this?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <div class="answer-headline">I didn't discover this problem from the outside. I built the entire system myself — and proved it works before asking anyone for money.</div>
      <p>I'm Ahmed Ragab — founder and CEO of OurBride. I built this platform from zero to a live multi-platform product in under 18 months. I'm listed as the developer on both the iOS App Store and Google Play. I have deep understanding of the Egyptian market, mobile-first product design, and the architecture of multi-sided platforms.</p>
      <p>The key seed hires are: (1) Head of Growth — Egypt-based with D2C brand building and influencer partnership experience; (2) Head of Marketplace — operations leader with vendor onboarding and supply-side quality control experience. Both roles are funded by this round.</p>
      <div class="answer-tip">The "I built everything myself before raising" narrative is extremely powerful at seed stage. It demonstrates conviction, technical ability, and capital efficiency — the three things investors care most about.</div>
    </div></div>
  </div>
</div>

<!-- PHASE 4: PITCH DAY -->
<div id="phase-pitch" class="phase-section">
  <div class="phase-header">
    <div class="phase-num">04</div>
    <div class="phase-info">
      <h2>Pitch Day Questions</h2>
      <p>Live pitch to a panel. 5\u201310 minute presentation followed by rapid-fire Q&A. Answers must be sharp, confident, and under 60 seconds each.</p>
    </div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-rust"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-pitch">Pitch Day</span></div>
        <div class="qa-q-text">Why should we invest in a wedding platform in Egypt?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>"Because 600,000 Egyptian families spend \$3.2 billion on weddings every year — and there is literally no technology infrastructure serving them. Zero. It's WhatsApp, cash, and hope. We built the infrastructure. We proved it works. We're live on 3 platforms with 333 clients and a 5.0 App Store rating. The product risk is zero — you're investing in scaling a proven system into the largest untapped wedding market in MENA."</p>
      <div class="answer-warn">Don't get drawn into defending the category. Redirect to the size of the opportunity and the fact that you already built and proved the product.</div>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-rust"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-pitch">Pitch Day</span></div>
        <div class="qa-q-text">What's your MENA expansion plan?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>"Egypt first — it's the largest market. Saudi Arabia next — our iOS app is already approved in the Saudi App Store from day one. The wedding market across Egypt + KSA + UAE is \$12B+. Our Arabic-first, mobile-first platform is built for this region. Within 12 months of this round, we plan to begin Saudi Arabia operations."</p>
    </div></div>
  </div>
</div>

<!-- PHASE 5: TERM SHEET -->
<div id="phase-closing" class="phase-section">
  <div class="phase-header">
    <div class="phase-num">05</div>
    <div class="phase-info">
      <h2>Term Sheet & Closing</h2>
      <p>Final negotiations. Legal, financial, and governance questions. Have your cap table, incorporation docs, and data room ready.</p>
    </div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-purple"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-closing">Closing</span></div>
        <div class="qa-q-text">What milestones will this round fund?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>Three milestone gates that position us for Series A:</p>
      <ul class="bullet-list">
        <li><strong>200+ verified providers onboarded</strong> — proving marketplace supply-side execution</li>
        <li><strong>5,000+ active brides</strong> — proving demand-side growth and retention</li>
        <li><strong>First booking commissions generating</strong> — proving the marketplace revenue model works</li>
      </ul>
      <p>These three milestones create the Series A story: proven marketplace traction + recurring revenue + clear path to MENA expansion.</p>
    </div></div>
  </div>
</div>

<!-- HARDBALL -->
<div id="phase-hard" class="phase-section">
  <div class="phase-header">
    <div class="phase-num">\u26A1</div>
    <div class="phase-info">
      <h2>Hardball Questions</h2>
      <p>The questions designed to test your composure. Stay calm, stay specific, never get defensive.</p>
    </div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-hard">\u26A1 Hardball</span></div>
        <div class="qa-q-text">You're a solo founder. Isn't that a red flag?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>"I built the entire platform — web, iOS, Android, e-commerce store, community, planner tools — by myself in 18 months. That's not a weakness. That's proof of what I can do with limited resources. Imagine what happens when I have a team and capital behind me. The two key hires — Head of Growth and Head of Marketplace — are funded by this round. I'm not asking you to bet on a solo founder staying solo. I'm asking you to bet on a founder who proved they can execute before building the team."</p>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-hard">\u26A1 Hardball</span></div>
        <div class="qa-q-text">333 users isn't impressive. Why so few?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>"333 organic signups with zero marketing spend, zero paid acquisition, and zero funding — while simultaneously building the entire platform. That's not a weakness. That's proof of organic demand. The question isn't 'why only 333?' — it's 'what happens when we actually have a marketing budget?' This round funds the growth engine. The product-market signal is already there."</p>
      <div class="answer-tip">Always reframe small numbers as "organic validation with zero spend" — then pivot to what capital unlocks.</div>
    </div></div>
  </div>

  <div class="qa-card">
    <div class="qa-card-stripe stripe-gold"></div>
    <div class="qa-question" onclick="toggle(this)">
      <div class="qa-question-left">
        <div class="qa-q-label"><span class="phase-tag tag-hard">\u26A1 Hardball</span></div>
        <div class="qa-q-text">Why can't The Knot or Zola just enter Egypt and crush you?</div>
      </div>
      <div class="qa-toggle">+</div>
    </div>
    <div class="qa-answer"><div class="qa-answer-inner">
      <p>"Three reasons. First, they haven't — in over a decade of operating, none of the global wedding platforms have entered any Arabic-speaking market. The cultural, linguistic, and behavioral differences make it unattractive for their model. Second, Egyptian weddings are fundamentally different from Western weddings — the vendor categories, the family dynamics, the payment methods, the planning timeline. A Western platform can't just translate their UI and win. Third, the real competition isn't The Knot — it's WhatsApp and word of mouth. We're not displacing a competitor. We're replacing a behavior. That requires local-first, Arabic-first, mobile-first design that no global player will build."</p>
    </div></div>
  </div>
</div>

</div>

<script>
function toggle(el) {
  el.closest('.qa-card').classList.toggle('open');
}
function scrollTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Sticky TOC active state
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.toc-item').forEach(t => t.classList.remove('active'));
      const id = e.target.id;
      document.querySelectorAll('.toc-item').forEach(t => {
        if (t.getAttribute('onclick') && t.getAttribute('onclick').includes(id)) {
          t.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.1, rootMargin: '-60px 0px -60% 0px' });
document.querySelectorAll('.phase-section').forEach(s => observer.observe(s));
</script>
</body>
</html>`;
