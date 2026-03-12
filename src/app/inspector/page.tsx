// src/app/inspector/page.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate, formatRelativeDate, getStatusColor } from '@/lib/utils'

export const metadata = { title: 'My Projects | GRUTH Inspector' }

export default async function InspectorDashboardPage() {
    const session = await auth()
    const user = session?.user as any

    const projects = await prisma.project.findMany({
        where: { inspectorId: user?.id },
        include: {
            client: { select: { name: true, email: true, country: true } },
            inspections: {
                orderBy: { scheduledDate: 'desc' },
                take: 1,
                select: { id: true, status: true, scheduledDate: true, summary: true },
            },
            _count: { select: { inspections: true, alerts: true } },
        },
        orderBy: { updatedAt: 'desc' },
    })

    const upcoming = projects.filter(p => p.inspections[0]?.status === 'SCHEDULED')
    const active   = projects.filter(p => p.status === 'ACTIVE')
    const completed = projects.filter(p => p.status === 'COMPLETED')

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="font-display text-2xl font-bold text-charcoal-950">
                    Welcome back, {user?.name?.split(' ')[0] ?? 'Inspector'}
                </h1>
                <p className="text-charcoal-500 text-sm mt-1">
                    You have {active.length} active project{active.length !== 1 ? 's' : ''} and {upcoming.length} scheduled inspection{upcoming.length !== 1 ? 's' : ''}.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Assigned', value: projects.length, color: 'bg-charcoal-950 text-white' },
                    { label: 'Active', value: active.length, color: 'bg-orange-500 text-white' },
                    { label: 'Completed', value: completed.length, color: 'bg-emerald-500 text-white' },
                ].map(({ label, value, color }) => (
                    <div key={label} className={`${color} rounded-2xl p-5`}>
                        <div className="text-3xl font-bold">{value}</div>
                        <div className="text-sm opacity-80 mt-1">{label}</div>
                    </div>
                ))}
            </div>

            {/* Upcoming inspections */}
            {upcoming.length > 0 && (
                <div>
                    <h2 className="font-semibold text-charcoal-900 mb-4">Upcoming Inspections</h2>
                    <div className="space-y-3">
                        {upcoming.map(p => (
                            <Link key={p.id} href={`/inspector/projects/${p.id}`}
                                  className="card p-5 flex items-center gap-4 hover:border-orange-200 transition-colors group">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-charcoal-900 group-hover:text-orange-700 transition-colors">{p.name}</p>
                                    <p className="text-charcoal-400 text-sm">{p.location}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-semibold text-charcoal-800">{formatDate(p.inspections[0]!.scheduledDate)}</p>
                                    <p className="text-xs text-charcoal-400">{formatRelativeDate(p.inspections[0]!.scheduledDate)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* All projects */}
            <div>
                <h2 className="font-semibold text-charcoal-900 mb-4">All Assigned Projects</h2>
                {projects.length === 0 ? (
                    <div className="card p-10 text-center">
                        <p className="text-charcoal-400">No projects assigned yet. The admin will assign you shortly.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {projects.map(p => (
                            <Link key={p.id} href={`/inspector/projects/${p.id}`}
                                  className="card p-5 flex items-start gap-4 hover:border-emerald-200 transition-colors group">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                                        <h3 className="font-semibold text-charcoal-900 group-hover:text-emerald-700 transition-colors">{p.name}</h3>
                                        <span className={`status-badge ${getStatusColor(p.status)}`}>{p.status}</span>
                                    </div>
                                    <p className="text-charcoal-500 text-sm">{p.location}</p>
                                    <p className="text-charcoal-400 text-xs mt-1">
                                        Client: {p.client.name} ({p.client.country}) · {p._count.inspections} inspection{p._count.inspections !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <svg className="w-4 h-4 text-charcoal-300 group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6"/>
                                </svg>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}