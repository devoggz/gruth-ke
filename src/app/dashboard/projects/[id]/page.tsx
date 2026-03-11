// src/app/dashboard/projects/[id]/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  formatCurrency,
  formatDate,
  formatRelativeDate,
  getStatusColor,
  getProjectTypeLabel,
  getBudgetRisk,
} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { name: true },
  });
  return { title: project ? `${project.name} | GroundTruth` : "Project" };
}

// ─── Download Report Button (client component inline) ─────────────────────────
function DownloadReportButton({
  reportUrl,
  projectName,
}: {
  reportUrl: string;
  projectName: string;
}) {
  return (
    <a
      href={reportUrl}
      download={`${projectName.replace(/\s+/g, "-")}-GroundTruth-Report.pdf`}
      className="inline-flex items-center gap-2 bg-charcoal-950 hover:bg-charcoal-900 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:shadow-md"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download Report
    </a>
  );
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id!;
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id: id, clientId: userId },
    include: {
      inspections: {
        orderBy: { scheduledDate: "desc" },
        include: { media: true, report: true },
      },
      materialPrices: { include: { supplier: true } },
      vendors: true,
      alerts: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "asc" }, take: 20 },
      progressStages: { orderBy: { order: "asc" } },
    },
  });

  if (!project) notFound();

  const budget =
    project.estimatedBudget && project.amountSpent
      ? getBudgetRisk(project.estimatedBudget, project.amountSpent)
      : null;

  const allPhotos = project.inspections.flatMap((i) =>
    i.media
      .filter((m) => m.type === "PHOTO")
      .map((m) => ({
        ...m,
        inspectionDate: i.scheduledDate,
        inspectorName: i.inspectorName,
      })),
  );

  const completedStages = project.progressStages.filter(
    (s) => s.completed,
  ).length;
  const progressPct =
    project.progressStages.length > 0
      ? (completedStages / project.progressStages.length) * 100
      : 0;

  // Flatten all reports for the download button
  const latestReport = project.inspections
    .flatMap((i) =>
      i.report ? [{ ...i.report, scheduledDate: i.scheduledDate }] : [],
    )
    .sort(
      (a, b) =>
        new Date(b.scheduledDate).getTime() -
        new Date(a.scheduledDate).getTime(),
    )[0];

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm">
            <Link
              href="/dashboard/projects"
              className="text-charcoal-400 hover:text-charcoal-700 transition-colors"
            >
              Projects
            </Link>
            <span className="text-charcoal-200">/</span>
            <span className="text-charcoal-700 font-medium truncate max-w-xs">
              {project.name}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-charcoal-950">
            {project.name}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className={`status-badge ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <span className="text-charcoal-400 text-sm">
              {getProjectTypeLabel(project.type)}
            </span>
            <span className="text-charcoal-400 text-sm">·</span>
            <span className="text-charcoal-400 text-sm flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {project.location}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {latestReport?.fileUrl && (
            <DownloadReportButton
              reportUrl={latestReport.fileUrl}
              projectName={project.name}
            />
          )}
          <Link
            href="/request-verification"
            className="btn-primary text-sm flex-shrink-0"
          >
            Request New Inspection
          </Link>
        </div>
      </div>

      {/* ── Alerts ───────────────────────────────────── */}
      {project.alerts.filter((a) => !a.isRead).length > 0 && (
        <div className="space-y-2">
          {project.alerts
            .filter((a) => !a.isRead)
            .map((alert) => (
              <div
                key={alert.id}
                className={`alert-banner ${
                  alert.severity === "CRITICAL"
                    ? "bg-red-50 border-red-200"
                    : alert.severity === "WARNING"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-blue-50 border-blue-200"
                }`}
              >
                <span className="text-xl flex-shrink-0">
                  {alert.severity === "CRITICAL"
                    ? "🔴"
                    : alert.severity === "WARNING"
                      ? "⚠️"
                      : "ℹ️"}
                </span>
                <div>
                  <div className="font-semibold text-charcoal-900 text-sm">
                    {alert.title}
                  </div>
                  <div className="text-charcoal-600 text-xs mt-0.5 leading-relaxed">
                    {alert.message}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ── Overview grid ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Project overview */}
        <div className="card p-6">
          <h2 className="font-semibold text-charcoal-900 text-xs uppercase tracking-widest mb-4">
            Project Overview
          </h2>
          <dl className="space-y-3.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal-400">Type</dt>
              <dd className="font-medium text-charcoal-800">
                {getProjectTypeLabel(project.type)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal-400">Location</dt>
              <dd className="font-medium text-charcoal-800 text-right max-w-[60%]">
                {project.location}
              </dd>
            </div>
            {project.startDate && (
              <div className="flex justify-between">
                <dt className="text-charcoal-400">Started</dt>
                <dd className="font-medium text-charcoal-800">
                  {formatDate(project.startDate)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-charcoal-400">Inspections</dt>
              <dd className="font-semibold text-charcoal-800">
                {project.inspections.length}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal-400">Photos</dt>
              <dd className="font-semibold text-charcoal-800">
                {allPhotos.length}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-charcoal-400">Status</dt>
              <dd>
                <span
                  className={`status-badge ${getStatusColor(project.status)}`}
                >
                  {project.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Budget */}
        {project.estimatedBudget ? (
          <div className="card p-6">
            <h2 className="font-semibold text-charcoal-900 text-xs uppercase tracking-widest mb-4">
              Budget
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-charcoal-400">Estimated</span>
                  <span className="font-semibold text-charcoal-900">
                    {formatCurrency(project.estimatedBudget, project.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-charcoal-400">Spent</span>
                  <span className="font-semibold text-charcoal-900">
                    {formatCurrency(project.amountSpent ?? 0, project.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-400">Remaining</span>
                  <span className="font-semibold text-emerald-600">
                    {formatCurrency(
                      project.estimatedBudget - (project.amountSpent ?? 0),
                      project.currency,
                    )}
                  </span>
                </div>
              </div>
              {budget && (
                <div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        budget.level === "low"
                          ? "bg-emerald-500"
                          : budget.level === "medium"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-charcoal-400">
                      {budget.percentage.toFixed(0)}% utilised
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        budget.level === "low"
                          ? "bg-emerald-50 text-emerald-700"
                          : budget.level === "medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {budget.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card p-6 flex flex-col items-center justify-center text-center">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-charcoal-400 text-sm">Budget not specified</p>
          </div>
        )}

        {/* Progress tracker */}
        {project.progressStages.length > 0 ? (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-charcoal-900 text-xs uppercase tracking-widest">
                Progress
              </h2>
              <span className="font-display font-bold text-lg text-charcoal-950">
                {progressPct.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="space-y-2.5">
              {project.progressStages.map((stage) => (
                <div key={stage.id} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      stage.completed ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  >
                    {stage.completed && (
                      <svg
                        className="w-3 h-3 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm flex-1 ${stage.completed ? "text-charcoal-800 font-medium" : "text-charcoal-400"}`}
                  >
                    {stage.stageName}
                  </span>
                  {stage.completedAt && (
                    <span className="text-xs text-charcoal-300 flex-shrink-0">
                      {formatDate(stage.completedAt)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card p-6 flex flex-col items-center justify-center text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-charcoal-400 text-sm">
              No progress stages defined
            </p>
          </div>
        )}
      </div>

      {/* ── Inspection Timeline ───────────────────────── */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-charcoal-900">
            Inspection Timeline
          </h2>
          {latestReport?.fileUrl && (
            <DownloadReportButton
              reportUrl={latestReport.fileUrl}
              projectName={project.name}
            />
          )}
        </div>

        {project.inspections.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-charcoal-400 text-sm">No inspections yet.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
            <div className="space-y-10">
              {project.inspections.map((inspection) => {
                const photos = inspection.media.filter(
                  (m) => m.type === "PHOTO",
                );
                return (
                  <div key={inspection.id} className="relative pl-12">
                    <div
                      className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                        inspection.status === "COMPLETED"
                          ? "bg-emerald-500"
                          : inspection.status === "IN_PROGRESS"
                            ? "bg-orange-500"
                            : "bg-gray-300"
                      }`}
                    />

                    <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                      <div>
                        <div className="font-semibold text-charcoal-900 text-sm">
                          Inspection by {inspection.inspectorName}
                        </div>
                        <div className="text-xs text-charcoal-400 mt-0.5">
                          {formatDate(inspection.scheduledDate)} ·{" "}
                          {formatRelativeDate(inspection.scheduledDate)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`status-badge ${getStatusColor(inspection.status)}`}
                        >
                          {inspection.status}
                        </span>
                        {inspection.report?.fileUrl && (
                          <a
                            href={inspection.report.fileUrl}
                            download={`Inspection-Report-${formatDate(inspection.scheduledDate)}.pdf`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download Report
                          </a>
                        )}
                      </div>
                    </div>

                    {inspection.summary && (
                      <p className="text-charcoal-600 text-sm leading-relaxed bg-gray-50 rounded-xl p-4 mb-4">
                        {inspection.summary}
                      </p>
                    )}

                    {/* Milestone photos — prominently displayed */}
                    {photos.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-charcoal-500 uppercase tracking-widest mb-2">
                          {photos.length} photo{photos.length > 1 ? "s" : ""}{" "}
                          from this inspection
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                          {photos.map((media) => (
                            <div
                              key={media.id}
                              className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                            >
                              <Image
                                src={media.url}
                                alt={media.caption ?? media.filename}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {media.caption && (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <p className="text-white text-xs leading-tight">
                                    {media.caption}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Evidence Gallery ─────────────────────────── */}
      {allPhotos.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-charcoal-900">
              Evidence Gallery
              <span className="ml-2 text-sm font-normal text-charcoal-400">
                {allPhotos.length} photos
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {allPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100"
              >
                <Image
                  src={photo.url}
                  alt={photo.caption ?? photo.filename}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs leading-tight">
                      {photo.caption}
                    </p>
                    <p className="text-white/60 text-xs mt-0.5">
                      {formatDate(photo.inspectionDate)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Material Prices ───────────────────────────── */}
      {project.materialPrices.length > 0 && (
        <div className="card p-6 overflow-x-auto">
          <h2 className="font-display font-semibold text-charcoal-900 mb-5">
            Material Price Intelligence
          </h2>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  "Material",
                  "Unit",
                  "Market Range",
                  "Quoted",
                  "Verified",
                  "Supplier",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-charcoal-400 uppercase tracking-widest font-semibold py-2 pr-4 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {project.materialPrices.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="py-3 pr-4 font-medium text-charcoal-900">
                    {item.materialName}
                  </td>
                  <td className="py-3 pr-4 text-charcoal-500">{item.unit}</td>
                  <td className="py-3 pr-4 text-charcoal-600 font-mono text-xs">
                    {formatCurrency(item.marketPriceLow)} –{" "}
                    {formatCurrency(item.marketPriceHigh)}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-charcoal-700">
                    {item.quotedPrice ? formatCurrency(item.quotedPrice) : "—"}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-charcoal-700">
                    {item.verifiedPrice
                      ? formatCurrency(item.verifiedPrice)
                      : "—"}
                  </td>
                  <td className="py-3 pr-4 text-charcoal-500 text-xs">
                    {item.supplier?.name ?? "—"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`status-badge ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Vendors ──────────────────────────────────── */}
      {project.vendors.length > 0 && (
        <div className="card p-6">
          <h2 className="font-display font-semibold text-charcoal-900 mb-5">
            Vendors & Contractors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="rounded-xl p-4 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-charcoal-900 text-sm">
                      {vendor.name}
                    </h3>
                    <p className="text-orange-600 text-xs font-medium mt-0.5">
                      {vendor.role}
                    </p>
                  </div>
                  <span
                    className={`status-badge ${getStatusColor(vendor.verifiedStatus)}`}
                  >
                    {vendor.verifiedStatus}
                  </span>
                </div>
                {vendor.phone && (
                  <p className="text-charcoal-500 text-xs mt-2">
                    📞 {vendor.phone}
                  </p>
                )}
                {vendor.email && (
                  <p className="text-charcoal-500 text-xs">✉️ {vendor.email}</p>
                )}
                {vendor.performanceNotes && (
                  <p className="text-charcoal-600 text-xs mt-3 bg-gray-50 rounded-lg p-2.5 leading-relaxed">
                    {vendor.performanceNotes}
                  </p>
                )}
                {vendor.contractValue && (
                  <p className="text-charcoal-400 text-xs mt-2">
                    Contract:{" "}
                    <span className="font-semibold text-charcoal-700">
                      {formatCurrency(vendor.contractValue)}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Messages ─────────────────────────────────── */}
      {project.messages.length > 0 && (
        <div className="card p-6">
          <h2 className="font-display font-semibold text-charcoal-900 mb-5">
            Communication
          </h2>
          <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
            {project.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isFromClient ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.isFromClient
                      ? "bg-charcoal-950 text-white rounded-br-md"
                      : "bg-gray-100 text-charcoal-800 rounded-bl-md"
                  }`}
                >
                  {!msg.isFromClient && (
                    <div className="text-xs font-bold text-orange-600 mb-1 tracking-wide">
                      GroundTruth Team
                    </div>
                  )}
                  {msg.content}
                  <div
                    className={`text-xs mt-1.5 ${msg.isFromClient ? "text-white/50" : "text-charcoal-400"}`}
                  >
                    {formatRelativeDate(msg.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 text-center">
            <Link
              href="/dashboard/messages"
              className="text-orange-600 text-sm font-semibold hover:text-orange-700"
            >
              Open Messages →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
