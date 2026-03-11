import Link from 'next/link'
import ProblemCard, { type ProblemCardProps } from '@/components/ui/ProblemCard'

const IconConstruction = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/>
        <path d="M5 21V9"/><path d="M19 21V9"/>
        <path d="M3 9h18"/>
        <line x1="5" y1="13" x2="10" y2="13"/>
        <line x1="14" y1="13" x2="19" y2="13"/>
        <line x1="5" y1="17" x2="12" y2="17"/>
        <path d="M12 9L11 6L13 3" strokeDasharray="1.5 1"/>
    </svg>
)

const IconTitle = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="17"/>
        <line x1="15" y1="13" x2="9" y2="17"/>
    </svg>
)

const IconInflation = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2.5"/>
        <path d="M13 10l2-2 2 2"/>
        <line x1="15" y1="8" x2="15" y2="13"/>
    </svg>
)

type ProblemDef = Omit<ProblemCardProps, 'variant'>

const PROBLEMS: ProblemDef[] = [
    {
        icon:        <IconConstruction />,
        title:       'Construction Fraud',
        description: 'Walls not up. Foundation half-done. Inspector reports full progress. You have no way to know — until GRUTH shows up.',
        stat:        '60%',
        statLabel:   'of diaspora builds report contractor misrepresentation',
    },
    {
        icon:        <IconTitle />,
        title:       'Title Disputes',
        description: 'A title can look clean and still carry hidden loans, cautions, or prior ownership. Registry checks reveal what photos never will.',
        stat:        '1 in 4',
        statLabel:   'Kenya land titles have a hidden encumbrance',
    },
    {
        icon:        <IconInflation />,
        title:       'Inflated Costs',
        description: 'Cement. Iron sheets. Labour. Every line item carries a diaspora premium. GRUTH verifies real market prices on every report.',
        stat:        '40%',
        statLabel:   'average materials markup charged to diaspora',
    },
]

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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {PROBLEMS.map((problem) => (
                        <ProblemCard
                            key={problem.title}
                            variant="default"
                            {...problem}
                        />
                    ))}
                </div>

            </div>
        </section>
    )
}