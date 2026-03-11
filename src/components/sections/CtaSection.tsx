// src/components/home/CtaSection.tsx
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-24 bg-orange-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
          Don't send money blind.
        </h2>
        <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto">
          For a fraction of what you're sending, GroundTruth gives you the eyes
          on the ground you need to send with confidence.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/request-verification"
            className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-semibold px-8 py-4 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Get Started Today
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-medium px-8 py-4 rounded-lg hover:border-white transition-colors"
          >
            Talk to Our Team
          </Link>
        </div>
      </div>
    </section>
  );
}
