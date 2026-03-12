import Link from 'next/link'





export default function ProblemSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="max-w-2xl mx-auto text-center mb-16">
                    <span className="section-tag mb-5">The Problem</span>

                    <h2 className="font-display text-4xl sm:text-5xl font-bold text-charcoal-950 mb-6 leading-tight tracking-tight">
                        Distance shouldn&rsquo;t mean{' '}
                        <span className="text-orange-500">blind trust.</span>
                    </h2>

                    <p className="text-charcoal-600 text-lg leading-relaxed mb-8">
                        Relatives mean well. Contractors sound convincing. But without
                        an independent set of eyes on the ground, you&rsquo;re relying on
                        second-hand information for decisions that matter most.
                    </p>

                   

                    <Link href="/request-verification" className="btn-secondary">
                        Get eyes on the ground
                    </Link>
                </div>



            </div>
        </section>
    )
}