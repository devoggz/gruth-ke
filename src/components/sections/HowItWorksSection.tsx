// src/components/home/HowItWorksSection.tsx

// ─── Step icons — inline SVGs, matches brand strokeWidth ─────────────────────
const IconSubmit = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);

const IconDispatch = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4l3 3"/>
      <path d="M16.24 7.76A6 6 0 1 0 7.76 16.24"/>
    </svg>
);

const IconCollect = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
);

const IconReport = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
);

const steps = [
  {
    number: "01",
    title: "Submit Your Request",
    desc: "Tell us about your project — location, service type, and what you need verified.",
    icon: <IconSubmit />,
    accent: "bg-blue-500",
    ring: "ring-blue-100",
    lightBg: "bg-blue-50",
    lightText: "text-blue-600",
  },
  {
    number: "02",
    title: "Inspector Dispatched",
    desc: "We assign a licensed, vetted local inspector and schedule the site visit within 24 hours.",
    icon: <IconDispatch />,
    accent: "bg-amber-500",
    ring: "ring-amber-100",
    lightBg: "bg-amber-50",
    lightText: "text-amber-600",
  },
  {
    number: "03",
    title: "Evidence Collected",
    desc: "The inspector documents everything — photos, video, measurements, and on-site interviews.",
    icon: <IconCollect />,
    accent: "bg-orange-500",
    ring: "ring-orange-100",
    lightBg: "bg-orange-50",
    lightText: "text-orange-600",
  },
  {
    number: "04",
    title: "Report Delivered",
    desc: "A structured report lands on your secure dashboard within 24–48 hours, with photo evidence.",
    icon: <IconReport />,
    accent: "bg-emerald-500",
    ring: "ring-emerald-100",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-600",
  },
];

export default function HowItWorksSection() {
  return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <span className="section-tag mb-4 inline-flex">The Process</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-charcoal-950 mb-4 tracking-tight">
              Simple. Transparent. Thorough.
            </h2>
            <p className="text-charcoal-500 text-lg max-w-xl mx-auto leading-relaxed">
              From request to report — we handle everything on the ground so you don't have to fly home.
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Horizontal connector line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-charcoal-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {steps.map(({ number, title, desc, icon, accent, ring, lightBg, lightText }, i) => (
                  <div key={number} className="relative flex flex-col items-start lg:items-center text-left lg:text-center">
                    {/* Step number circle with icon */}
                    <div className="relative mb-6">
                      {/* Outer ring */}
                      <div className={`w-20 h-20 rounded-2xl ${lightBg} ring-4 ${ring} flex items-center justify-center relative z-10`}>
                        {/* Mono number */}
                        <div className="flex flex-col items-center gap-1">
                          <span className={`font-mono text-xs font-bold ${lightText} opacity-70`}>{number}</span>
                          <span className={lightText}>{icon}</span>
                        </div>
                      </div>
                      {/* Accent dot */}
                      <div className={`absolute -top-1 -right-1 w-4 h-4 ${accent} rounded-full ring-2 ring-white z-20`} />
                    </div>

                    {/* Mobile connector arrow */}
                    {i < steps.length - 1 && (
                        <div className="lg:hidden flex items-center gap-1 text-charcoal-200 mb-2 self-start ml-8">
                          <div className="w-8 h-px border-t-2 border-dashed border-charcoal-200" />
                          <svg className="w-3 h-3 text-charcoal-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </div>
                    )}

                    <h3 className="font-display text-lg font-semibold text-charcoal-950 mb-2">
                      {title}
                    </h3>
                    <p className="text-charcoal-500 text-sm leading-relaxed max-w-[220px] lg:max-w-none">
                      {desc}
                    </p>
                  </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 flex justify-center">
            <div className="inline-flex items-center gap-4 bg-charcoal-50 border border-charcoal-100 rounded-2xl px-8 py-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/>
                <span className="text-sm font-semibold text-charcoal-800">Average turnaround:</span>
                <span className="text-sm text-charcoal-600">24–48 hours from request to report</span>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}