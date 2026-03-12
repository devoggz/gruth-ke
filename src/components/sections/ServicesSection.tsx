// src/components/home/ServicesSection.tsx
//
// Uses ServiceCard HOC from src/components/ui/ServiceCard.tsx
// Icons: geometric SVG strokes — no emoji, no third-party icon lib required.

import Link from "next/link";
import ServiceCard, {
  type ServiceCardProps,
} from "@/components/ui/ServiceCard";

// ─── Icon components ──────────────────────────────────────────────────────────
// 20×20 viewport, strokeWidth 1.65, round caps/joins — feels precise, not heavy.

const IconConstruction = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Building frame */}
    <rect x="3" y="9" width="18" height="12" rx="1" />
    {/* Roof peak */}
    <path d="M3 9 L12 3 L21 9" />
    {/* Door */}
    <rect x="9.5" y="14" width="5" height="7" rx="0.5" />
    {/* Window */}
    <rect x="4.5" y="12" width="3.5" height="3" rx="0.5" />
    <rect x="16" y="12" width="3.5" height="3" rx="0.5" />
  </svg>
);

const IconLand = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Map outline */}
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    {/* Meridian lines */}
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
    {/* Horizontal */}
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

const IconWedding = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Venue arch */}
    <path d="M5 21 V12 Q5 5 12 5 Q19 5 19 12 V21" />
    {/* Centre door */}
    <path d="M9 21 V15 Q9 12 12 12 Q15 12 15 15 V21" />
    {/* Lintel */}
    <line x1="3" y1="21" x2="21" y2="21" />
    {/* Star / sparkle above arch */}
    <path
      d="M12 2 L12.6 3.8 L14.5 3.8 L13 4.9 L13.6 6.8 L12 5.6 L10.4 6.8 L11 4.9 L9.5 3.8 L11.4 3.8 Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

const IconBusiness = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Chart bars */}
    <rect x="3" y="12" width="4" height="9" rx="0.5" />
    <rect x="10" y="7" width="4" height="14" rx="0.5" />
    <rect x="17" y="4" width="4" height="17" rx="0.5" />
    {/* Trend line */}
    <polyline points="5 12 12 7 19 4" strokeDasharray="1.5 1.5" />
  </svg>
);

const IconMaterials = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Cube / package */}
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconFuneral = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Shield — protection / oversight */}
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    {/* Check mark inside */}
    <path d="M9 12l2 2 4-4" />
  </svg>
);


type ServiceDef = Omit<ServiceCardProps, "variant">;

const SERVICES: ServiceDef[] = [
  {
    icon: <IconConstruction />,
    title: "Construction Verification",
    description:
      "We visit your site and document exactly what's been built, what materials were used, and whether work matches your plan.",
    href: "/services#construction",
  },
  {
    icon: <IconLand />,
    title: "Land & Property",
    description:
      "Verify boundaries, ownership, encumbrances, and current occupancy before any funds change hands.",
    href: "/services#land",
  },
  {
    icon: <IconWedding />,
    title: "Wedding & Events",
    badge: "Popular",
    description:
      "Confirm venue bookings, vendor readiness, décor, catering, and logistics are locked in for your special day.",
    href: "/services#events",
  },
  {
    icon: <IconBusiness />,
    title: "Business Investment",
    description:
      "Verify a business actually exists, operates as described, and matches the investment pitch before you commit.",
    href: "/services#business",
  },
  {
    icon: <IconMaterials />,
    title: "Material Pricing",
    description:
      "Real-time verified pricing from local markets — so you're never overcharged on cement, steel, or supplies.",
    href: "/services#materials",
  },
  {
    icon: <IconFuneral />,
    title: "Funeral & Event Oversight",
    description:
      "Ensure arrangements are in order when you can't be there. Dignified, discreet, and compassionate oversight.",
    href: "/services#funeral",
  },
];


export default function ServicesSection() {
  return (
    <section className="py-24 bg-charcoal-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — left-aligned with descriptor pushed right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <span className="section-tag mb-4 inline-flex">Our Services</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-charcoal-950 tracking-tight">
              What we verify
            </h2>
          </div>

        </div>

        {/* Card grid — uses ServiceCard HOC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} variant="default" {...service} />
          ))}
        </div>

        {/* Footer strip */}
        <div className="mt-12 pt-10 border-t border-charcoal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-charcoal-400 text-sm">
            Not sure which service fits?{" "}
            <Link
              href="/contact"
              className="font-semibold text-charcoal-700 hover:text-orange-600 underline underline-offset-2 transition-colors"
            >
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
