// src/app/services/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Services | GRUTH — Ground Verification',
    description: 'Every verification service GRUTH offers — construction, land, events, business, materials, and funeral oversight.',
}

// ─── Shared data ──────────────────────────────────────────────────────────────

const SERVICES = [
    {
        id:      'construction',
        title:   'Construction Verification',
        tagline: 'See exactly whats been built',
        hero:    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=85',
        accent:  'from-orange-950/80',
        what: [
            'Stage-by-stage site visit with timestamped photos',
            'Materials check — brand, quantity, grade',
            'Structural compliance vs. approved plan',
            'Contractor progress report with GPS coordinates',
        ],
        deliverable: 'Full photo + narrative PDF report delivered within 48 hours of inspection.',
        ideal: 'Diaspora homebuilders, property developers, and families funding construction remotely.',
    },
    {
        id:      'land',
        title:   'Land & Property',
        tagline: 'Verify before you transfer',
        hero:    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=85',
        accent:  'from-emerald-950/80',
        what: [
            'Physical boundary walk and GPS mapping',
            'Title deed cross-check with land registry records',
            'Occupancy and caretaker status confirmed',
            'Adjacent dispute or encumbrance check',
        ],
        deliverable: 'Boundary map, photo evidence, and a written ownership status report.',
        ideal: 'Anyone purchasing land in Kenya from abroad — residential, agricultural, or investment plots.',
    },
    {
        id:      'wedding',
        title:   'Wedding & Events',
        tagline: 'Your day, confirmed',
        hero:    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=85',
        accent:  'from-rose-950/80',
        what: [
            'Venue visit to confirm booking and setup readiness',
            'Vendor confirmation — caterers, florists, sound, lighting',
            'Décor and logistics walkthrough',
            'Same-day photo update sent direct to family abroad',
        ],
        deliverable: 'Pre-event readiness report with photos and a vendor checklist.',
        ideal: 'Diaspora families co-planning weddings, graduation parties, and milestone events in Kenya.',
    },
    {
        id:      'business',
        title:   'Business Investment',
        tagline: 'Due diligence, done right',
        hero:    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=85',
        accent:  'from-blue-950/80',
        what: [
            'Premises visit — location, size, and condition confirmed',
            'Operational verification — staff, stock, and activity',
            'Cross-check against business registration documents',
            'Investor pitch vs. on-the-ground reality report',
        ],
        deliverable: 'Business verification report with photos, observations, and a factual summary.',
        ideal: 'Diaspora investors evaluating SMEs, shops, farms, or franchise opportunities in Kenya.',
    },
    {
        id:      'materials',
        title:   'Material Pricing Audit',
        tagline: 'Real prices, real time',
        hero:    'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1400&q=85',
        accent:  'from-amber-950/80',
        what: [
            'Live pricing from 3+ local suppliers per material',
            'Cement, steel, timber, roofing, and finishing materials',
            'Comparison vs. contractor invoice line items',
            'Overcharge flags with documented evidence',
        ],
        deliverable: 'Itemised pricing report with supplier receipts and a contractor comparison table.',
        ideal: 'Anyone managing a construction project remotely who wants to eliminate contractor overcharging.',
    },
    // {
    //     id:      'funeral',
    //     title:   'Funeral & Event Oversight',
    //     tagline: 'Dignified. Discreet. Present.',
    //     hero:    'https://unsplash.com/photos/low-angle-photo-of-lightened-candles-fvl4b1gjpbk',
    //     accent:  'from-charcoal-900/80',
    //     what: [
    //         'Coordination with funeral home or event organiser',
    //         'Venue preparation and logistics verified',
    //         'Dignified, discreet photographic documentation',
    //         'Live family updates via WhatsApp or video call',
    //     ],
    //     deliverable: 'Respectful photo record and a written account of proceedings.',
    //     ideal: 'Families abroad who cannot attend but need assurance that final arrangements are honoured.',
    // },
]

// ─── Hero ─────────────────────────────────────────────────────────────────────

function PageHero() {
    return (
        <section className="relative bg-charcoal-950 pt-28 pb-20 overflow-hidden">
            {/* Grid texture */}
            <div className="absolute inset-0 opacity-[0.03]"
                 style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-bold tracking-widest uppercase bg-orange-400/10 px-3 py-1 rounded-full mb-6">
          What we do
        </span>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none mb-6 max-w-3xl">
                    Every service<br />
                    <span className="text-orange-400">we offer</span>
                </h1>
                <p className="text-charcoal-400 text-lg max-w-xl leading-relaxed mb-10">
                    Six categories. One promise — a verified, photo-documented report from a qualified inspector on the ground in Kenya.
                </p>

                {/* Quick-nav pills */}
                <div className="flex flex-wrap gap-2">
                    {SERVICES.map(s => (
                        <a key={s.id} href={`#${s.id}`}
                           className="px-4 py-2 rounded-full border border-white/10 text-charcoal-400 hover:text-white hover:border-white/30 text-xs font-semibold tracking-wide transition-all">
                            {s.title}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ─── Bento overview grid ──────────────────────────────────────────────────────

function OverviewGrid() {
    return (
        <section className="bg-charcoal-950 pb-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">


                {/* Row A — top bento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                    {/* Construction — tall, spans 2 rows visually via row-span-2 on lg */}
                    <BentoCard svc={SERVICES[0]} className="sm:col-span-2 lg:col-span-2 lg:row-span-2 h-[320px] sm:h-[360px] lg:h-full min-h-[420px]" />
                    <BentoCard svc={SERVICES[1]} className="h-[260px] lg:h-auto" />
                    <BentoCard svc={SERVICES[2]} className="h-[260px] lg:h-auto" />
                </div>

                {/* Row B — bottom bento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <BentoCard svc={SERVICES[3]} className="sm:col-span-2 lg:col-span-1 h-[260px]" />
                    <BentoCard svc={SERVICES[4]} className="h-[260px]" />
                </div>
            </div>
        </section>
    )
}

function BentoCard({ svc, className }: { svc: typeof SERVICES[0]; className: string }) {
    return (
        <a href={`#${svc.id}`}
           className={`group relative rounded-2xl overflow-hidden block ${className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={svc.hero} alt={svc.title}
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            <div className={`absolute inset-0 bg-gradient-to-t ${svc.accent} via-black/40 to-transparent`} />
            <div className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/30 transition-colors duration-300" />

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">{svc.tagline}</p>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-tight">{svc.title}</h3>
            </div>

            {/* Hover bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </a>
    )
}

// ─── Detailed service sections ────────────────────────────────────────────────

function ServiceDetail({ svc, index }: { svc: typeof SERVICES[0]; index: number }) {
    const isEven = index % 2 === 0

    return (
        <section id={svc.id} className="py-20 border-t border-white/5 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${isEven ? '' : 'lg:[&>*:first-child]:order-2'}`}>

                    {/* Image */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={svc.hero} alt={svc.title} className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-br ${svc.accent} to-transparent opacity-60`} />

                        {/* Floating tagline chip */}
                        <div className="absolute top-5 left-5">
              <span className="inline-flex items-center gap-1.5 bg-charcoal-950/70 backdrop-blur-sm border border-white/10 text-orange-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                {svc.tagline}
              </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">
                            {svc.title}
                        </h2>

                        {/* What's included */}
                        <div className="mb-7">
                            <p className="text-[10px] font-bold text-charcoal-500 uppercase tracking-widest mb-3">What's included</p>
                            <ul className="space-y-3">
                                {svc.what.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-charcoal-300 text-sm leading-relaxed">
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-orange-500/15 flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Deliverable pill */}
                        <div className="bg-white/[0.05] border border-white/10 rounded-xl p-4 mb-7">
                            <p className="text-[10px] font-bold text-charcoal-500 uppercase tracking-widest mb-1.5">Deliverable</p>
                            <p className="text-charcoal-200 text-sm leading-relaxed">{svc.deliverable}</p>
                        </div>

                        {/* Ideal for */}
                        <p className="text-charcoal-500 text-xs leading-relaxed mb-7">
                            <span className="font-bold text-charcoal-400">Ideal for: </span>
                            {svc.ideal}
                        </p>

                        <Link href={`/request-verification?service=${encodeURIComponent(svc.title)}`}
                              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5">
                            Request this service
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    )
}

// ─── CTA banner ───────────────────────────────────────────────────────────────

function CtaBanner() {
    return (
        <section className="py-20 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-orange-500 rounded-3xl px-8 sm:px-14 py-14 overflow-hidden">
                    {/* Subtle grid texture */}
                    <div className="absolute inset-0 opacity-10"
                         style={{ backgroundImage: 'linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)', backgroundSize: '32px 32px' }} />

                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                        <div>
                            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
                                Not sure which service you need?
                            </h2>
                            <p className="text-orange-100 text-sm max-w-md leading-relaxed">
                                Describe your situation and we'll match you to the right inspector and report type.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                            <Link href="/request-verification"
                                  className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-orange-50 text-sm font-bold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5">
                                Request a verification
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>
                            <Link href="/contact"
                                  className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-all">
                                Talk to our team
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
    return (
        <main className="bg-charcoal-950 min-h-screen">
            <PageHero />
            <OverviewGrid />
            <div className="max-w-full">
                {SERVICES.map((svc, i) => (
                    <ServiceDetail key={svc.id} svc={svc} index={i} />
                ))}
            </div>
            <CtaBanner />
        </main>
    )
}