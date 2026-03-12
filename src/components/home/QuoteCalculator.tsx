'use client'


import React, { useState, useMemo } from 'react'
import Link from 'next/link'


const SERVICE_TYPES = [
    { value: 'construction',  label: 'Construction Verification',  base: [18000, 45000], popular: false },
    { value: 'land',          label: 'Land & Property',            base: [15000, 35000], popular: false },
    { value: 'wedding',       label: 'Wedding & Events',           base: [12000, 28000], popular: true  },
    { value: 'business',      label: 'Business Investment',        base: [20000, 50000], popular: false },
    { value: 'materials',     label: 'Material Pricing Audit',     base: [10000, 22000], popular: false },
    { value: 'funeral',       label: 'Funeral & Event Oversight',  base: [10000, 20000], popular: false },
] as const

type ServiceValue = typeof SERVICE_TYPES[number]['value']

const COUNTIES = [
    { value: 'nairobi',   label: 'Nairobi',    travel: 0     },
    { value: 'mombasa',   label: 'Mombasa',    travel: 4000  },
    { value: 'kisumu',    label: 'Kisumu',     travel: 4500  },
    { value: 'nakuru',    label: 'Nakuru',     travel: 2500  },
    { value: 'eldoret',   label: 'Eldoret',    travel: 3500  },
    { value: 'nyeri',     label: 'Nyeri',      travel: 3000  },
    { value: 'machakos',  label: 'Machakos',   travel: 2000  },
    { value: 'kisii',     label: 'Kisii',      travel: 4000  },
    { value: 'other',     label: 'Remote / Other', travel: 6000 },
] as const

type CountyValue = typeof COUNTIES[number]['value']

const PROJECT_SIZES = [
    { value: 'small',  label: 'Small',  desc: 'Plot / 1–2 rooms / single vendor', multiplier: 1.0 },
    { value: 'medium', label: 'Medium', desc: '3–5 rooms / multi-vendor event',   multiplier: 1.4 },
    { value: 'large',  label: 'Large',  desc: '5+ rooms / commercial / complex',  multiplier: 1.9 },
] as const

type SizeValue = typeof PROJECT_SIZES[number]['value']

const URGENCY = [
    { value: 'standard', label: 'Standard',  sub: '48-hour turnaround', surcharge: 0     },
    { value: 'priority', label: 'Priority',  sub: '24-hour turnaround', surcharge: 5000  },
] as const

type UrgencyValue = typeof URGENCY[number]['value']

const ADDONS = [
    { value: 'drone',    label: 'Drone Footage',        price: 5000  },
    { value: 'lab',      label: 'Material Lab Testing', price: 10000 },
    { value: 'extra',    label: 'Extra Site Visit',      price: 8000  },
    { value: 'report',   label: 'Detailed PDF Report',   price: 3500  },
] as const

type AddonValue = typeof ADDONS[number]['value']

// Size only matters for these services
const SIZE_SERVICES: ServiceValue[] = ['construction', 'land', 'business']


interface Estimate {
    low:       number
    high:      number
    breakdown: { label: string; low: number; high: number }[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
    return `KSh ${n.toLocaleString('en-KE')}`
}

function useEstimate(
    service:  ServiceValue,
    county:   CountyValue,
    urgency:  UrgencyValue,
    size:     SizeValue,
    addons:   AddonValue[],
): Estimate {
    return useMemo(() => {
        const svc      = SERVICE_TYPES.find(s => s.value === service)!
        const cty      = COUNTIES.find(c => c.value === county)!
        const urg      = URGENCY.find(u => u.value === urgency)!
        const sz       = PROJECT_SIZES.find(p => p.value === size)!
        const showSize = SIZE_SERVICES.includes(service)
        const mult     = showSize ? sz.multiplier : 1

        const baseLow  = Math.round(svc.base[0] * mult)
        const baseHigh = Math.round(svc.base[1] * mult)

        const breakdown: Estimate['breakdown'] = [
            { label: 'Base inspection fee', low: baseLow, high: baseHigh },
        ]

        if (cty.travel > 0) {
            breakdown.push({ label: `${cty.label} travel`, low: cty.travel, high: cty.travel })
        }
        if (urg.surcharge > 0) {
            breakdown.push({ label: 'Priority surcharge', low: urg.surcharge, high: urg.surcharge })
        }
        addons.forEach(a => {
            const ad = ADDONS.find(x => x.value === a)!
            breakdown.push({ label: ad.label, low: ad.price, high: ad.price })
        })

        const low  = breakdown.reduce((s, r) => s + r.low,  0)
        const high = breakdown.reduce((s, r) => s + r.high, 0)
        return { low, high, breakdown }
    }, [service, county, urgency, size, addons])
}


export default function QuoteCalculator() {
    const [service, setService] = useState<ServiceValue>('construction')
    const [county,  setCounty]  = useState<CountyValue>('nairobi')
    const [urgency, setUrgency] = useState<UrgencyValue>('standard')
    const [size,    setSize]    = useState<SizeValue>('small')
    const [addons,  setAddons]  = useState<AddonValue[]>([])

    const estimate   = useEstimate(service, county, urgency, size, addons)
    const showSize   = SIZE_SERVICES.includes(service)
    const samePrice  = estimate.low === estimate.high

    const toggleAddon = (v: AddonValue) =>
        setAddons(prev => prev.includes(v) ? prev.filter(a => a !== v) : [...prev, v])

    // Build pre-fill URL
    const ctaHref = useMemo(() => {
        const svcLabel = SERVICE_TYPES.find(s => s.value === service)?.label ?? ''
        const ctyLabel = COUNTIES.find(c => c.value === county)?.label ?? ''
        return `/request-verification?service=${encodeURIComponent(svcLabel)}&location=${encodeURIComponent(ctyLabel)}`
    }, [service, county])

    return (
        <section className="py-24 bg-charcoal-950 relative overflow-hidden">

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section header */}
                <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-orange-400 text-sm font-medium tracking-wide uppercase bg-orange-400/10 px-3 py-1 rounded-full mb-4">
            Quick Estimate
          </span>
                    <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                        How much will your<br />
                        <span className="text-orange-400">verification cost?</span>
                    </h2>
                    <p className="text-charcoal-400 text-lg max-w-xl mx-auto">
                        Configure your project below and get a real-time estimate in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                    {/* ── Left panel: inputs ────────────────────────────────────────── */}
                    <div className="lg:col-span-3 bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-7">

                        {/* Service type */}
                        <div>
                            <CalcLabel>Service Type</CalcLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                                {SERVICE_TYPES.map(svc => (
                                    <button
                                        key={svc.value}
                                        onClick={() => setService(svc.value)}
                                        className={`
                      relative text-left px-4 py-3 rounded-xl border text-sm font-medium
                      transition-all duration-150
                      ${service === svc.value
                                            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                                            : 'border-white/10 text-charcoal-300 hover:border-white/25 hover:text-white'}
                    `}
                                    >
                                        {svc.label}
                                        {svc.popular && (
                                            <span className={`
                        ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full
                        ${service === svc.value ? 'bg-white/20 text-white' : 'bg-orange-500/15 text-orange-400'}
                      `}>
                        Popular
                      </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* County + Urgency row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <CalcLabel>Project Location</CalcLabel>
                                <div className="relative mt-2">
                                    <select
                                        value={county}
                                        onChange={e => setCounty(e.target.value as CountyValue)}
                                        className="w-full appearance-none bg-white/[0.06] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
                                    >
                                        {COUNTIES.map(c => (
                                            <option key={c.value} value={c.value} className="bg-charcoal-950 text-white">
                                                {c.label}{c.travel > 0 ? ` (+${fmt(c.travel)})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown />
                                </div>
                                {county === 'other' && (
                                    <p className="text-xs text-amber-400 mt-1.5">Travel fee applies — confirm at quote stage.</p>
                                )}
                            </div>

                            <div>
                                <CalcLabel>Urgency</CalcLabel>
                                <div className="flex gap-2 mt-2">
                                    {URGENCY.map(u => (
                                        <button
                                            key={u.value}
                                            onClick={() => setUrgency(u.value)}
                                            className={`
                        flex-1 px-3 py-3 rounded-xl border text-sm font-medium text-center transition-all duration-150
                        ${urgency === u.value
                                                ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                : 'border-white/10 text-charcoal-300 hover:border-white/25 hover:text-white'}
                      `}
                                        >
                                            <div className="font-semibold">{u.label}</div>
                                            <div className={`text-[11px] mt-0.5 ${urgency === u.value ? 'text-orange-100' : 'text-charcoal-500'}`}>
                                                {u.sub}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Project size — conditional */}
                        {showSize && (
                            <div>
                                <CalcLabel>Project Scale</CalcLabel>
                                <div className="grid grid-cols-3 gap-2.5 mt-2">
                                    {PROJECT_SIZES.map(p => (
                                        <button
                                            key={p.value}
                                            onClick={() => setSize(p.value)}
                                            className={`
                        text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150
                        ${size === p.value
                                                ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                : 'border-white/10 text-charcoal-300 hover:border-white/25 hover:text-white'}
                      `}
                                        >
                                            <div className="font-semibold">{p.label}</div>
                                            <div className={`text-[11px] mt-0.5 leading-snug ${size === p.value ? 'text-orange-100' : 'text-charcoal-500'}`}>
                                                {p.desc}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add-ons */}
                        <div>
                            <CalcLabel>Optional Add-ons</CalcLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                                {ADDONS.map(a => {
                                    const checked = addons.includes(a.value)
                                    return (
                                        <button
                                            key={a.value}
                                            onClick={() => toggleAddon(a.value)}
                                            className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left
                        transition-all duration-150
                        ${checked
                                                ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                                                : 'border-white/10 text-charcoal-300 hover:border-white/25 hover:text-white'}
                      `}
                                        >
                                            {/* Checkbox dot */}
                                            <span className={`
                        w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all
                        ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}
                      `}>
                        {checked && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                      </span>
                                            <span className="flex-1">{a.label}</span>
                                            <span className={`font-mono text-xs ${checked ? 'text-emerald-400' : 'text-charcoal-500'}`}>
                        +{fmt(a.price)}
                      </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Right panel: estimate ─────────────────────────────────────── */}
                    <div className="lg:col-span-2 sticky top-8 space-y-4">

                        {/* Price card */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8">
                            <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-widest mb-3">
                                Estimated Cost
                            </p>
                            <div className="mb-1">
                                {samePrice ? (
                                    <span className="font-display text-4xl font-bold text-charcoal-950 tracking-tight">
                    {fmt(estimate.low)}
                  </span>
                                ) : (
                                    <>
                    <span className="font-display text-3xl font-bold text-charcoal-950 tracking-tight">
                      {fmt(estimate.low)}
                    </span>
                                        <span className="text-charcoal-400 font-display text-2xl mx-2">–</span>
                                        <span className="font-display text-3xl font-bold text-charcoal-950 tracking-tight">
                      {fmt(estimate.high)}
                    </span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-charcoal-400 mb-6">Kenyan Shillings, inclusive of VAT</p>

                            {/* Breakdown */}
                            <div className="space-y-2.5 border-t border-charcoal-100 pt-5 mb-6">
                                {estimate.breakdown.map((row, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-charcoal-500">{row.label}</span>
                                        <span className="font-mono font-medium text-charcoal-800 text-xs tabular-nums">
                      {row.low === row.high
                          ? fmt(row.low)
                          : `${fmt(row.low)} – ${fmt(row.high)}`}
                    </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link
                                href={ctaHref}
                                className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0 text-sm"
                            >
                                Get Accurate Quote
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>
                            <Link
                                href="/request-verification"
                                className="flex items-center justify-center gap-2 w-full mt-2 border border-charcoal-200 text-charcoal-600 hover:text-charcoal-950 hover:border-charcoal-400 font-medium px-6 py-3 rounded-xl transition-all text-sm"
                            >
                                Request Verification Instead
                            </Link>
                        </div>

                        {/* Trust notes */}
                        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-3">
                            {[
                                { icon: '🔒', text: 'Payments held in escrow until work is verified' },
                                { icon: '📋', text: 'Final quote confirmed after project review' },
                                { icon: '⚡', text: 'Inspector assigned within 2 hours of booking' },
                            ].map(item => (
                                <div key={item.text} className="flex items-start gap-3 text-xs text-charcoal-400 leading-relaxed">
                                    <span className="text-base leading-none mt-0.5">{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        {/* Disclaimer */}
                        <p className="text-[11px] text-charcoal-600 leading-relaxed px-1">
                            This is a quick estimate only. Actual pricing is confirmed after a full project brief. Prices are indicative and may vary based on scope, access, and complexity.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}

// ─── Micro components ─────────────────────────────────────────────────────────

function CalcLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-widest">
      {children}
    </span>
    )
}

function ChevronDown() {
    return (
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </span>
    )
}