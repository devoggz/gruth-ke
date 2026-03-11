// src/app/admin/page.tsx
// Admin dashboard — requires role === "ADMIN" (guard in middleware or layout)
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatRelativeDate, formatCurrency, getStatusColor } from "@/lib/utils";

export default async function AdminDashboardPage() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") redirect("/dashboard");

    const [clients, projects, openMessages, recentAlerts] = await Promise.all([
        prisma.user.findMany({
            where:   { role: "CLIENT" },
            include: {
                projects: { select: { id: true, status: true } },
                _count:   { select: { projects: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.project.findMany({
            include: {
                client:      { select: { name: true, email: true } },
                inspections: { orderBy: { scheduledDate: "desc" }, take: 1 },
                alerts:      { where: { isRead: false } },
                messages:    { where: { isFromClient: true, readAt: null }, orderBy: { createdAt: "desc" }, take: 1 },
            },
            orderBy: { updatedAt: "desc" },
        }),
        prisma.message.count({ where: { isFromClient: true, readAt: null } }),
        prisma.alert.findMany({
            orderBy: { createdAt: "desc" },
            take: 8,
            include: { project: { select: { name: true, client: { select: { name: true } } } } },
        }),
    ]);

    const activeProjects       = projects.filter(p => p.status === "ACTIVE").length;
    const pendingProjects      = projects.filter(p => p.status === "PENDING").length;
    const projectsNeedingReply = projects.filter(p => p.messages.length > 0).length;

    // ── Stat cards config ─────────────────────────────────────────────────────────
    const stats = [
        {
            label: "Total Clients",
            value: clients.length,
            sub: "Registered accounts",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
            ),
            accent: "text-blue-600 bg-blue-50 ring-blue-100",
        },
        {
            label: "Active Projects",
            value: activeProjects,
            sub: `${pendingProjects} pending review`,
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
                </svg>
            ),
            accent: "text-emerald-600 bg-emerald-50 ring-emerald-100",
        },
        {
            label: "Unread Messages",
            value: openMessages,
            sub: "From clients",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/>
                </svg>
            ),
            accent: "text-orange-600 bg-orange-50 ring-orange-100",
            urgent: openMessages > 0,
        },
        {
            label: "Needs Reply",
            value: projectsNeedingReply,
            sub: "Projects with new msg",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
            ),
            accent: "text-amber-600 bg-amber-50 ring-amber-100",
            urgent: projectsNeedingReply > 0,
        },
    ];

    return (
        <div className="space-y-8 pb-16">

            {/* ── Header ─────────────────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="inline-flex items-center gap-1.5 bg-charcoal-950 text-orange-400 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-charcoal-800">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        Admin Console
                    </div>
                    <h1 className="font-display text-2xl font-bold text-charcoal-950 tracking-tight">
                        Operations Dashboard
                    </h1>
                    <p className="text-charcoal-500 text-sm mt-1">
                        {clients.length} clients · {projects.length} projects · {openMessages} unread messages
                    </p>
                </div>
                <div className="flex gap-2.5">
                    <Link href="/admin/market-prices"
                          className="inline-flex items-center gap-2 bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-800 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-7"/>
                        </svg>
                        Update Prices
                    </Link>
                    <Link href="/admin/projects/new" className="btn-primary text-sm py-2.5 px-4">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        New Project
                    </Link>
                </div>
            </div>

            {/* ── Stat cards ─────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, sub, icon, accent, urgent }) => (
                    <div key={label} className={`bg-white rounded-xl border shadow-sm p-5 transition-shadow hover:shadow-md ${urgent ? "border-orange-200" : "border-charcoal-100"}`}>
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ring-2 ${accent}`}>
                            {icon}
                        </div>
                        <div className="font-display text-3xl font-bold text-charcoal-950 mb-0.5 tracking-tight tabular-nums">
                            {value}
                        </div>
                        <div className="font-semibold text-charcoal-800 text-sm">{label}</div>
                        <div className="text-charcoal-400 text-xs mt-0.5">{sub}</div>
                    </div>
                ))}
            </div>

            {/* ── Projects table ─────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-charcoal-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-charcoal-100 flex items-center justify-between">
                    <div>
                        <h2 className="font-display font-semibold text-charcoal-950">All Projects</h2>
                        <p className="text-xs text-charcoal-400 mt-0.5">{projects.length} total</p>
                    </div>
                    <Link href="/admin/projects" className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1">
                        View all
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-charcoal-100 bg-charcoal-50/50">
                            {["Project", "Client", "Status", "Last Inspection", "Budget", "Alerts", ""].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-charcoal-400 uppercase tracking-widest whitespace-nowrap">
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-50">
                        {projects.slice(0, 12).map(project => (
                            <tr key={project.id} className="hover:bg-orange-50/30 group transition-colors">
                                <td className="px-5 py-4">
                                    <div className="font-semibold text-charcoal-900 truncate max-w-[180px]">{project.name}</div>
                                    <div className="text-xs text-charcoal-400 mt-0.5">{project.type.replace(/_/g, " ")}</div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 bg-charcoal-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[10px] font-bold">
                          {project.client.name?.charAt(0).toUpperCase() ?? "?"}
                        </span>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-charcoal-800 font-medium text-sm truncate">{project.client.name}</div>
                                            <div className="text-xs text-charcoal-400 truncate">{project.client.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`status-badge ${getStatusColor(project.status)}`}>{project.status}</span>
                                </td>
                                <td className="px-5 py-4 text-charcoal-500 text-xs">
                                    {project.inspections[0] ? formatRelativeDate(project.inspections[0].scheduledDate) : (
                                        <span className="text-charcoal-300">None yet</span>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                    <span className="font-mono text-charcoal-700 text-xs">
                      {project.estimatedBudget ? formatCurrency(project.estimatedBudget) : (
                          <span className="text-charcoal-300">—</span>
                      )}
                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    {project.alerts.length > 0 ? (
                                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"/>
                                            {project.alerts.length}
                      </span>
                                    ) : (
                                        <span className="text-charcoal-200 text-xs">—</span>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                        <Link href={`/admin/projects/${project.id}`}
                                              className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-900 transition-colors">
                                            Edit
                                        </Link>
                                        <Link href={`/admin/projects/${project.id}/messages`}
                                              className={`text-xs font-semibold transition-colors ${
                                                  project.messages.length > 0
                                                      ? "text-orange-600 hover:text-orange-700"
                                                      : "text-charcoal-500 hover:text-charcoal-900"
                                              }`}>
                                            {project.messages.length > 0 ? "↩ Reply" : "Message"}
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Bottom columns: Clients + Recent Alerts ─────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Clients */}
                <div className="bg-white rounded-xl border border-charcoal-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-charcoal-100 flex items-center justify-between">
                        <div>
                            <h2 className="font-display font-semibold text-charcoal-950">Clients</h2>
                            <p className="text-xs text-charcoal-400 mt-0.5">{clients.length} registered</p>
                        </div>
                        <Link href="/admin/clients" className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1">
                            Manage
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Link>
                    </div>
                    <div className="divide-y divide-charcoal-50">
                        {clients.slice(0, 8).map(client => {
                            const active = client.projects.filter(p => p.status === "ACTIVE").length;
                            return (
                                <Link key={client.id} href={`/admin/clients/${client.id}`}
                                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-orange-50/40 transition-colors group">
                                    <div className="w-8 h-8 bg-charcoal-950 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {client.name?.charAt(0).toUpperCase() ?? "?"}
                    </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-charcoal-900 text-sm truncate group-hover:text-orange-600 transition-colors">
                                            {client.name}
                                        </div>
                                        <div className="text-xs text-charcoal-400 truncate">{client.email}</div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-xs font-semibold text-charcoal-700">
                                            {client._count.projects} project{client._count.projects !== 1 ? "s" : ""}
                                        </div>
                                        {active > 0 && (
                                            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">{active} active</div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Recent alerts */}
                <div className="bg-white rounded-xl border border-charcoal-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-charcoal-100 flex items-center justify-between">
                        <div>
                            <h2 className="font-display font-semibold text-charcoal-950">Recent Alerts Sent</h2>
                            <p className="text-xs text-charcoal-400 mt-0.5">Last {recentAlerts.length} alerts</p>
                        </div>
                        <Link href="/admin/alerts/new"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                            Create alert
                        </Link>
                    </div>
                    <div className="divide-y divide-charcoal-50">
                        {recentAlerts.map(alert => (
                            <div key={alert.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-charcoal-50/40 transition-colors">
                                {/* Severity dot */}
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                    alert.severity === "CRITICAL" ? "bg-red-500"
                                        : alert.severity === "WARNING"  ? "bg-amber-500"
                                            : "bg-blue-400"
                                }`}/>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="font-semibold text-charcoal-900 text-sm truncate">{alert.title}</span>
                                        <span className="text-[10px] text-charcoal-400 flex-shrink-0 mt-0.5">
                      {formatRelativeDate(alert.createdAt)}
                    </span>
                                    </div>
                                    <div className="text-xs text-charcoal-500 mt-0.5 truncate">
                                        {alert.project.client?.name} · {alert.project.name}
                                    </div>
                                    {/* Severity badge */}
                                    <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wide ${
                                        alert.severity === "CRITICAL" ? "bg-red-50 text-red-600"
                                            : alert.severity === "WARNING"  ? "bg-amber-50 text-amber-700"
                                                : "bg-blue-50 text-blue-600"
                                    }`}>
                    {alert.severity}
                  </span>
                                </div>
                            </div>
                        ))}
                        {recentAlerts.length === 0 && (
                            <div className="px-5 py-12 text-center text-charcoal-400 text-sm">
                                No alerts sent yet.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}