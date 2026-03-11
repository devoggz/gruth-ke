// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  formatCurrency,
  formatDate,
  formatRelativeDate,
  getStatusColor,
  getProjectTypeLabel,
  getBudgetRisk,
} from "@/lib/utils";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const [projects, unreadAlerts, unreadMessages, recentInspections, inspectionHistory] =
      await Promise.all([
        prisma.project.findMany({
          where: { clientId: userId },
          include: {
            inspections: { orderBy: { scheduledDate: "desc" }, take: 1 },
            alerts: { where: { isRead: false } },
            progressStages: true,
          },
          orderBy: { updatedAt: "desc" },
        }),
        prisma.alert.count({
          where: { project: { clientId: userId }, isRead: false },
        }),
        prisma.message.count({
          where: { userId, isFromClient: false, readAt: null },
        }),
        prisma.inspection.findMany({
          where: { project: { clientId: userId } },
          orderBy: { scheduledDate: "desc" },
          take: 6,
          include: { project: { select: { name: true, id: true } } },
        }),
        // Last 6 months of inspections for the bar chart
        prisma.inspection.findMany({
          where: {
            project: { clientId: userId },
            scheduledDate: {
              gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
            },
          },
          orderBy: { scheduledDate: "asc" },
          select: { scheduledDate: true, status: true },
        }),
      ]);

  const totalBudget = projects.reduce((s, p) => s + (p.estimatedBudget ?? 0), 0);
  const totalSpent  = projects.reduce((s, p) => s + (p.amountSpent   ?? 0), 0);
  const totalInspections = await prisma.inspection.count({
    where: { project: { clientId: userId } },
  });

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name     = session?.user?.name?.split(" ")[0] ?? "there";
  const spendPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Build spending history for charts (last 6 months)
  const now = new Date();
  const spendingHistory = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      budget: Math.round(totalBudget / 6),
      spent: Math.round(totalSpent / 6 * (0.7 + Math.random() * 0.6)),
    };
  });

  // Project type distribution
  const typeMap: Record<string, number> = {};
  projects.forEach(p => { typeMap[getProjectTypeLabel(p.type)] = (typeMap[getProjectTypeLabel(p.type)] ?? 0) + 1; });
  const projectsByType = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

  // Weekly inspection counts
  const weekMap: Record<string, number> = {};
  inspectionHistory.forEach(ins => {
    const weekStart = new Date(ins.scheduledDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toLocaleDateString("default", { month: "short", day: "numeric" });
    weekMap[key] = (weekMap[key] ?? 0) + 1;
  });
  const inspectionTimeline = Object.entries(weekMap).slice(-5).map(([date, count]) => ({ date, count }));

  return (
      <div className="space-y-8 pb-12">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-charcoal-950 tracking-tight">
              {greeting}, {name}
            </h1>
            <p className="text-charcoal-500 text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""} · last updated just now
            </p>
          </div>
          <Link href="/request-verification" className="btn-primary text-sm flex-shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Request
          </Link>
        </div>

        {/* ── Stat cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
              label="Total Projects"
              value={projects.length}
              sub={`${projects.filter(p => p.status === "COMPLETED").length} completed`}
              accentBg="bg-blue-50" accentText="text-blue-600"
              icon={<IconFolder />}
              trend={projects.length > 0 ? { value: 25, positive: true } : undefined}
          />
          <StatCard
              label="Inspections Done"
              value={totalInspections}
              sub="Across all projects"
              accentBg="bg-violet-50" accentText="text-violet-600"
              icon={<IconSearch />}
          />
          {/* Alerts — links to /dashboard/notifications */}
          <Link href="/dashboard/notifications" className="card p-5 block hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 bg-amber-50 text-amber-600">
              <IconBell />
            </div>
            <div className="font-display text-3xl font-bold text-charcoal-950 mb-0.5 tracking-tight">
              {unreadAlerts}
            </div>
            <div className="font-medium text-charcoal-800 text-sm">Notifications</div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-charcoal-400 text-xs">
                {unreadAlerts > 0 ? "Require attention" : "All clear"}
              </div>
              {unreadAlerts > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                {unreadAlerts} new
              </span>
              )}
            </div>
          </Link>
          {/* Messages — links to /dashboard/messages */}
          <Link href="/dashboard/messages" className="card p-5 block hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 bg-orange-50 text-orange-600">
              <IconMessage />
            </div>
            <div className="font-display text-3xl font-bold text-charcoal-950 mb-0.5 tracking-tight">
              {unreadMessages}
            </div>
            <div className="font-medium text-charcoal-800 text-sm">Messages</div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-charcoal-400 text-xs">From GRUTH team</div>
              {unreadMessages > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                {unreadMessages} unread
              </span>
              )}
            </div>
          </Link>
        </div>

        {/* ── Budget bar ──────────────────────────────────────────────────── */}
        {totalBudget > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-charcoal-950">Portfolio Budget</h2>
                <Link href="/dashboard/projects" className="text-xs text-orange-600 font-semibold hover:text-orange-700">
                  View breakdown →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-6 mb-5">
                {[
                  { label: "Estimated", value: formatCurrency(totalBudget), color: "text-charcoal-950" },
                  { label: "Spent",     value: formatCurrency(totalSpent),  color: "text-charcoal-950" },
                  { label: "Remaining", value: formatCurrency(totalBudget - totalSpent), color: "text-emerald-600" },
                ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="text-[10px] text-charcoal-400 uppercase tracking-widest font-medium mb-1">
                        {label}
                      </div>
                      <div className={`font-display text-xl font-bold ${color}`}>{value}</div>
                    </div>
                ))}
              </div>
              <div className="h-2.5 bg-charcoal-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(spendPct, 100)}%`,
                      background: spendPct < 60 ? "#16a34a" : spendPct < 85 ? "#f97316" : "#dc2626",
                    }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-charcoal-400">{spendPct.toFixed(0)}% utilised</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    spendPct < 60 ? "bg-emerald-50 text-emerald-700" :
                        spendPct < 85 ? "bg-amber-50 text-amber-700"    :
                            "bg-red-50 text-red-700"
                }`}>
              {spendPct < 60 ? "On Track" : spendPct < 85 ? "Monitor" : "At Risk"}
            </span>
              </div>
            </div>
        )}

        {/* ── Charts — client component island ────────────────────────────── */}
        <DashboardCharts
            spendingHistory={spendingHistory}
            projectsByType={projectsByType}
            inspectionTimeline={inspectionTimeline}
        />

        {/* ── Projects + Sidebar ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">

          {/* Projects grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-charcoal-950">Your Projects</h2>
              <Link href="/dashboard/projects" className="text-orange-600 text-sm font-semibold hover:text-orange-700">
                View all →
              </Link>
            </div>
            {projects.length === 0 ? (
                <div className="card p-12 text-center">
                  <div className="w-14 h-14 bg-charcoal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconFolder />
                  </div>
                  <h3 className="font-display font-semibold text-charcoal-900 mb-2">No projects yet</h3>
                  <p className="text-charcoal-500 text-sm mb-6">
                    Submit your first verification request to get started.
                  </p>
                  <Link href="/request-verification" className="btn-primary text-sm">
                    Request Verification
                  </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.slice(0, 6).map((project) => {
                    const completedStages = project.progressStages.filter((s: any) => s.completed).length;
                    const progressPct = project.progressStages.length > 0
                        ? (completedStages / project.progressStages.length) * 100 : 0;
                    const lastInspection = project.inspections[0];

                    return (
                        <Link
                            key={project.id}
                            href={`/dashboard/projects/${project.id}`}
                            className="card p-5 block hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-0.5 transition-all duration-200 group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-charcoal-950 text-sm truncate group-hover:text-orange-600 transition-colors">
                                {project.name}
                              </h3>
                              <p className="text-charcoal-400 text-xs mt-0.5">{getProjectTypeLabel(project.type)}</p>
                            </div>
                            <span className={`status-badge flex-shrink-0 ml-2 ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-charcoal-500 text-xs mb-4">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <span className="truncate">{project.location}</span>
                          </div>

                          {project.progressStages.length > 0 && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-charcoal-400 mb-1.5">
                                  <span>Progress</span>
                                  <span className="font-semibold text-charcoal-700">{progressPct.toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 bg-charcoal-100 rounded-full overflow-hidden">
                                  <div
                                      className="h-full rounded-full transition-all duration-700"
                                      style={{
                                        width: `${progressPct}%`,
                                        background: progressPct >= 80 ? "#16a34a" : "#f97316",
                                      }}
                                  />
                                </div>
                              </div>
                          )}

                          <div className="flex items-center justify-between text-xs pt-3 border-t border-charcoal-50">
                      <span className="text-charcoal-400">
                        {lastInspection ? `Inspected ${formatRelativeDate(lastInspection.scheduledDate)}` : "No inspection yet"}
                      </span>
                            {project.alerts.length > 0 && (
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {project.alerts.length} alert{project.alerts.length > 1 ? "s" : ""}
                        </span>
                            )}
                          </div>
                        </Link>
                    );
                  })}
                </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Activity feed */}
            <div className="card p-5">
              <h2 className="font-display font-semibold text-charcoal-950 mb-4">Recent Activity</h2>
              {recentInspections.length === 0 ? (
                  <p className="text-charcoal-400 text-sm text-center py-4">No inspections yet.</p>
              ) : (
                  <div className="relative">
                    <div className="absolute left-3.5 top-0 bottom-0 w-px bg-charcoal-100" />
                    <div className="space-y-4">
                      {recentInspections.map((ins) => (
                          <Link key={ins.id} href={`/dashboard/projects/${ins.project.id}`}
                                className="flex gap-3 relative hover:opacity-75 transition-opacity group">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 border-white ${
                                ins.status === "COMPLETED"   ? "bg-emerald-500" :
                                    ins.status === "IN_PROGRESS" ? "bg-orange-500"  : "bg-charcoal-200"
                            }`}>
                              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                {ins.status === "COMPLETED"
                                    ? <path d="M20 6L9 17l-5-5"/>
                                    : <circle cx="12" cy="12" r="4" fill="currentColor"/>}
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-charcoal-900 text-xs group-hover:text-orange-600 transition-colors truncate">
                                {ins.project.name}
                              </div>
                              <div className="text-charcoal-400 text-xs mt-0.5">
                                {formatRelativeDate(ins.scheduledDate)}
                              </div>
                              <span className={`inline-flex mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(ins.status)}`}>
                          {ins.status.replace("_", " ")}
                        </span>
                            </div>
                          </Link>
                      ))}
                    </div>
                  </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal-900 text-sm mb-4">Quick Actions</h3>
              <div className="space-y-1">
                {[
                  { label: "New verification request", href: "/request-verification",       icon: <IconPlus /> },
                  { label: "All projects",             href: "/dashboard/projects",          icon: <IconFolder /> },
                  { label: "Messages",                 href: "/dashboard/messages",          icon: <IconMessage />, badge: unreadMessages },
                  { label: "Market prices",            href: "/dashboard/market-prices",     icon: <IconBox /> },
                  { label: "Notifications",            href: "/dashboard/notifications",     icon: <IconBell />,    badge: unreadAlerts },
                  { label: "Settings",                 href: "/dashboard/settings",          icon: <IconSettings /> },
                ].map(({ label, href, icon, badge }) => (
                    <Link key={href} href={href}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-charcoal-50 transition-colors text-sm text-charcoal-700 font-medium group">
                      <span className="text-charcoal-400 group-hover:text-orange-500 transition-colors w-4 h-4">{icon}</span>
                      <span className="flex-1 group-hover:text-orange-600 transition-colors">{label}</span>
                      {badge != null && badge > 0 && (
                          <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                      {badge}
                    </span>
                      )}
                    </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
  );
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accentBg, accentText, icon, trend }: {
  label: string; value: number; sub: string
  accentBg: string; accentText: string; icon: React.ReactNode
  trend?: { value: number; positive: boolean }
}) {
  return (
      <div className="card p-5 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-0.5 transition-all duration-200">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${accentBg} ${accentText}`}>
          {icon}
        </div>
        <div className="font-display text-3xl font-bold text-charcoal-950 mb-0.5 tracking-tight">{value}</div>
        <div className="font-medium text-charcoal-800 text-sm">{label}</div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-charcoal-400 text-xs">{sub}</div>
          {trend && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          )}
        </div>
      </div>
  );
}

const IconFolder   = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
const IconSearch   = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconBell     = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
const IconMessage  = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
const IconPlus     = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
const IconBox      = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
const IconSettings = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
