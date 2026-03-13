// src/components/home/HowItWorksSection.tsx

const IconSubmit = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
)
const IconDispatch = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
    </svg>
)
const IconCollect = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4"/>
    </svg>
)
const IconReport = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
    </svg>
)

const steps = [
    {
        number: "01",
        title:  "Submit Your Request",
        desc:   "Tell us your project location, service type, and what needs verifying. Takes under 3 minutes.",
        icon:   <IconSubmit />,
    },
    {
        number: "02",
        title:  "Inspector Dispatched",
        desc:   "We assign a vetted local inspector and schedule the site visit within 24 hours of your request.",
        icon:   <IconDispatch />,
    },
    {
        number: "03",
        title:  "Evidence Collected",
        desc:   "The inspector documents everything on the ground — photos, video, measurements, interviews.",
        icon:   <IconCollect />,
    },
    {
        number: "04",
        title:  "Report Delivered",
        desc:   "A structured report with full photo evidence lands in your secure dashboard within 24–48 hours.",
        icon:   <IconReport />,
    },
]

export default function HowItWorksSection() {
    return (
        <section className="py-24 bg-white overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16 sm:mb-20">
                    <span className="section-tag mb-4 inline-flex">The Process</span>
                    <h2 className="font-display text-4xl sm:text-5xl font-bold text-charcoal-950 mb-4 tracking-tight">
                        Simple. Transparent. Thorough.
                    </h2>
                    <p className="text-charcoal-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        From request to report — we handle everything on the ground so you don't have to fly home.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">

                    {/* Desktop dashed connector — horizontally centred on icon boxes */}
                    <div
                        className="hidden lg:block absolute top-[2.375rem] h-px pointer-events-none"
                        style={{ left: "calc(12.5% + 2.375rem)", right: "calc(12.5% + 2.375rem)" }}
                    >
                        <svg width="100%" height="1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                            <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="#d3d2cf" strokeWidth="1.5" strokeDasharray="6 5"/>
                        </svg>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 lg:gap-x-4">
                        {steps.map(({ number, title, desc, icon }, i) => (
                            <div key={number} className="flex flex-col items-center text-center">

                                {/* Charcoal icon box */}
                                <div className="relative mb-7 z-10">
                                    <div className="w-[4.75rem] h-[4.75rem] rounded-2xl bg-charcoal-950 flex items-center justify-center shadow-xl shadow-charcoal-950/15 ring-4 ring-white">
                                        <span className="text-orange-400">{icon}</span>
                                    </div>
                                    {/* Step number */}
                                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold text-charcoal-400 bg-white border border-charcoal-100 rounded-full px-2 py-0.5 shadow-sm whitespace-nowrap">
                    {number}
                  </span>
                                </div>

                                <h3 className="font-display text-base sm:text-lg font-semibold text-charcoal-950 mb-2 leading-snug px-2">
                                    {title}
                                </h3>
                                <p className="text-charcoal-500 text-sm leading-relaxed max-w-[200px] sm:max-w-[240px]">
                                    {desc}
                                </p>

                                {/* Mobile-only vertical connector between steps */}
                                {i < steps.length - 1 && (
                                    <div className="sm:hidden flex flex-col items-center mt-8 gap-0.5">
                                        <div className="w-px h-5 bg-gradient-to-b from-charcoal-200 to-transparent" />
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                            <path d="M1 1l4 4 4-4" stroke="#b5b3ae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Turnaround badge */}
                <div className="mt-16 sm:mt-20 flex justify-center px-4">
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-charcoal-950 rounded-2xl px-6 sm:px-8 py-4 sm:py-5 text-center">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
                        <span className="text-sm font-semibold text-white">Average turnaround:</span>
                        <span className="text-sm text-charcoal-400">24–48 hours from request to report</span>
                    </div>
                </div>

            </div>
        </section>
    )
}