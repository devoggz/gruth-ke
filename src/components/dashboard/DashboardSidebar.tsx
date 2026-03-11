"use client";
// src/components/dashboard/DashboardSidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
        </svg>
    ),
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
    ),
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
        </svg>
    ),
  },
  {
    label: "Market Prices",
    href: "/dashboard/market-prices",
    icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 4 4-7" />
        </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    ),
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
      <aside className="hidden md:flex flex-col w-60 bg-charcoal-950 text-white flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 h-16 px-6 border-b border-charcoal-800">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path
                  d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
              />
              <circle cx="9" cy="9" r="2" fill="white" />
            </svg>
          </div>
          <span className="font-display font-semibold text-base tracking-tight">
          GRUTH
        </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-0.5">
          {navItems.map(({ label, href, icon }) => {
            // Exact match for /dashboard, prefix match for everything else
            const active =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(href));

            return (
                <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        active
                            ? "bg-orange-500 text-white"
                            : "text-charcoal-300 hover:text-white hover:bg-charcoal-800"
                    }`}
                >
                  {icon}
                  {label}
                </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-charcoal-800">
          <Link
              href="/"
              className="flex items-center gap-2 text-xs text-charcoal-400 hover:text-white transition-colors"
          >
            <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
              <path d="M10 19l-7-7 7-7M3 12h18" />
            </svg>
            Back to website
          </Link>
        </div>
      </aside>
  );
}