// src/components/home/ServicesSection.tsx
import Link from "next/link";

// ─── Icons — 24px viewport, strokeWidth 1.6, round caps/joins ─────────────────
const IconConstruction = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="18" height="12" rx="1.5"/>
      <path d="M3 9L12 3L21 9"/>
      <rect x="9.5" y="14" width="5" height="7" rx="0.5"/>
      <rect x="4.5" y="12" width="3.5" height="3" rx="0.5"/>
      <rect x="16" y="12" width="3.5" height="3" rx="0.5"/>
    </svg>
);

const IconLand = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <circle cx="6" cy="9" r="1" fill="currentColor" stroke="none"/>
    </svg>
);

const IconWedding = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V12Q5 5 12 5Q19 5 19 12V21"/>
      <path d="M9 21V15Q9 12 12 12Q15 12 15 15V21"/>
      <line x1="3" y1="21" x2="21" y2="21"/>
      {/* Double ring sparkle */}
      <circle cx="12" cy="2.5" r="1" fill="currentColor" stroke="none"/>
      <path d="M10 2.5L8.5 1M14 2.5L15.5 1" strokeWidth="1.2"/>
      <path d="M10 2.5L8.5 4M14 2.5L15.5 4" strokeWidth="1.2"/>
    </svg>
);

const IconBusiness = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9" rx="0.5"/>
      <rect x="10" y="7" width="4" height="14" rx="0.5"/>
      <rect x="17" y="4" width="4" height="17" rx="0.5"/>
      <polyline points="5 12 12 7 19 4"/>
      <circle cx="19" cy="4" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
);

const IconMaterials = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
);

const IconFuneral = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
);

// ─── Service definitions ──────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: <IconConstruction />,
    title: "Construction Verification",
    description:
        "We visit your site and document exactly what's been built, what materials were used, and whether work matches your plan.",
    href: "/services#construction",
    badge: null,
    color: "from-blue-500/10 to-blue-500/5 border-blue-100",
    iconColor: "text-blue-600 bg-blue-50",
  },
  {
    icon: <IconLand />,
    title: "Land & Property",
    description:
        "Verify boundaries, ownership, encumbrances, and current occupancy before any funds change hands.",
    href: "/services#land",
    badge: null,
    color: "from-emerald-500/10 to-emerald-500/5 border-emerald-100",
    iconColor: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: <IconWedding />,
    title: "Wedding & Events",
    description:
        "Confirm venue bookings, vendor readiness, décor, catering, and logistics are locked in for your special day.",
    href: "/services#events",
    badge: "Popular",
    color: "from-rose-500/10 to-rose-500/5 border-rose-100",
    iconColor: "text-rose-600 bg-rose-50",
  },
  {
    icon: <IconBusiness />,
    title: "Business Investment",
    description:
        "Verify a business actually exists, operates as described, and matches the investment pitch before you commit.",
    href: "/services#business",
    badge: null,
    color: "from-violet-500/10 to-violet-500/5 border-violet-100",
    iconColor: "text-violet-600 bg-violet-50",
  },
  {
    icon: <IconMaterials />,
    title: "Material Pricing",
    description:
        "Real-time verified pricing from local markets — so you're never overcharged on cement, steel, or supplies.",
    href: "/services#materials",
    badge: null,
    color: "from-amber-500/10 to-amber-500/5 border-amber-100",
    iconColor: "text-amber-600 bg-amber-50",
  },
  {
    icon: <IconFuneral />,
    title: "Funeral Oversight",
    description:
        "Ensure arrangements are in order when you can't be there. Dignified, discreet, and compassionate oversight.",
    href: "/services#funeral",
    badge: null,
    color: "from-charcoal-500/10 to-charcoal-500/5 border-charcoal-100",
    iconColor: "text-charcoal-600 bg-charcoal-100",
  },
];

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ServicesSection() {
  return (
      <section className="py-24 bg-charcoal-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="section-tag mb-4 inline-flex">Our Services</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-charcoal-950 tracking-tight">
                What we verify
              </h2>
            </div>
            <p className="text-charcoal-500 text-base max-w-xs sm:text-right leading-relaxed">
              If it's in Kenya and you need eyes on it, we're there.
            </p>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((service) => (
                <Link
                    key={service.title}
                    href={service.href}
                    className="relative group bg-white rounded-2xl border border-charcoal-100 p-7 hover:border-orange-200 hover:shadow-lg transition-all duration-200 flex flex-col"
                >
                  {/* Popular badge — bold orange pill with sparkle */}
                  {service.badge && (
                      <div className="absolute top-5 right-5 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md shadow-orange-200">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                        </svg>
                        {service.badge}
                      </div>
                  )}

                  {/* Icon in coloured bubble */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${service.iconColor} transition-transform duration-200 group-hover:scale-105`}>
                    {service.icon}
                  </div>

                  <h3 className="font-display text-lg font-semibold text-charcoal-950 mb-3 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-charcoal-500 text-sm leading-relaxed flex-1">
                    {service.description}
                  </p>

                  {/* Learn more arrow */}
                  <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold text-charcoal-400 group-hover:text-orange-600 transition-colors">
                    Learn more
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
            ))}
          </div>

          {/* Footer strip */}
          <div className="mt-12 pt-10 border-t border-charcoal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-charcoal-400 text-sm">
              Not sure which service fits?{" "}
              <Link href="/contact" className="font-semibold text-charcoal-700 hover:text-orange-600 underline underline-offset-2 transition-colors">
                Talk to our team
              </Link>
            </p>
            <Link href="/services" className="btn-outline text-sm">
              View all services →
            </Link>
          </div>
        </div>
      </section>
  );
}