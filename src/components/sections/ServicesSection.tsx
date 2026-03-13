// src/components/home/ServicesSection.tsx
import Link from 'next/link'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id:          'construction',
    title:       'Construction Verification',
    tagline:     'See exactly whats been built',
    description: 'We visit your site and document every stage — foundations, materials, structural work — and verify it matches the plan. No more guessing from blurry WhatsApp photos.',
    image:       'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80',
    span:        'col-span-2 row-span-2',
    tall:        true,
  },
  {
    id:          'land',
    title:       'Land & Property',
    tagline:     'Verify before you transfer',
    description: 'Boundaries, title deeds, encumbrances, and current occupancy — all confirmed on the ground before any funds move.',
    image:       'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80',
    span:        'col-span-1 row-span-1',
    tall:        false,
  },
  {
    id:          'wedding',
    title:       'Wedding & Events',
    tagline:     'Your day, confirmed',
    description: 'Venue bookings, vendor readiness, décor, catering, and logistics — all verified and documented so nothing is left to chance on the day.',
    image:       'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&q=80',
    span:        'col-span-1 row-span-1',
    tall:        false,
  },
  {
    id:          'business',
    title:       'Business Investment',
    tagline:     'Due diligence, done right',
    description: 'We verify that a business exists, operates as described, and matches the pitch — inventory, staff, premises, and all — before you commit capital.',
    image:       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80',
    span:        'col-span-2 row-span-1',
    tall:        false,
  },
  {
    id:          'materials',
    title:       'Material Pricing Audit',
    tagline:     'Real prices, real time',
    description: 'Live verified pricing from local markets — cement, steel, timber, and more — so you\'re never overcharged by contractors working from inflated quotes.',
    image:       'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=700&q=80',
    span:        'col-span-1 row-span-1',
    tall:        false,
  },

]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServicesSection() {
  return (
      <section className="py-24 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
            <span className="inline-flex items-center gap-1.5 text-orange-400 text-sm font-medium tracking-wide uppercase bg-orange-400/10 px-3 py-1 rounded-full mb-4">
              Our Services
            </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                What we verify
              </h2>
            </div>
            <p className="text-charcoal-400 text-sm max-w-xs leading-relaxed sm:text-right">
              Every service includes a photo evidence report, timeline, and direct access to your assigned inspector.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-3">
            {SERVICES.map((svc) => (
                <ServiceCard key={svc.id} {...svc} />
            ))}
          </div>

          {/* Footer strip */}
          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-charcoal-500 text-sm">
              Not sure which service fits?{' '}
              <Link href="/contact" className="font-semibold text-charcoal-300 hover:text-orange-400 underline underline-offset-2 transition-colors">
                Talk to our team
              </Link>
            </p>
            <Link href="/request-verification"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5">
              Request a verification
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

        </div>
      </section>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ServiceCard({
                       title, tagline, description, image, span,
                     }: {
  title:       string
  tagline:     string
  description: string
  image:       string
  span:        string
  tall:        boolean
}) {
  return (
      <div className={`${span} group relative rounded-2xl overflow-hidden cursor-default`}>

        {/* Image layer */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Base gradient — always visible, darkens bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Hover overlay — slides in from bottom */}
        <div className="absolute inset-0 bg-charcoal-950/85 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6">

          {/* Default state: tagline + title */}
          <div className="group-hover:opacity-0 group-hover:-translate-y-1 transition-all duration-300">
            <p className="text-orange-400 text-[11px] font-bold uppercase tracking-widest mb-1.5">
              {tagline}
            </p>
            <h3 className="font-display text-xl font-bold text-white leading-snug">
              {title}
            </h3>
          </div>

          {/* Hover state: full description */}
          <div className="absolute inset-0 flex flex-col justify-center p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
            <p className="text-orange-400 text-[11px] font-bold uppercase tracking-widest mb-3">
              {tagline}
            </p>
            <h3 className="font-display text-xl font-bold text-white leading-snug mb-3">
              {title}
            </h3>
            <p className="text-charcoal-300 text-sm leading-relaxed">
              {description}
            </p>
          </div>

        </div>

        {/* Subtle orange accent bar on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      </div>
  )
}