"use client";
// src/components/dashboard/DashboardHeader.tsx
import { signOut } from "next-auth/react";
import Link from "next/link";

interface DashboardHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
      {/* Mobile logo */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 bg-charcoal-950 rounded-lg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="9" cy="9" r="2" fill="#f97316" />
          </svg>
        </div>
        <span className="font-display font-semibold text-charcoal-950">
          GRUTH
        </span>
      </div>

      <div className="hidden md:block" />

      {/* Right side */}
      <div className="flex items-center gap-4">


        {/* User menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-charcoal-900">
              {user?.name ?? "Client"}
            </div>
            <div className="text-xs text-charcoal-400">{user?.email}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-9 h-9 rounded-full bg-charcoal-950 text-white text-xs font-bold flex items-center justify-center hover:bg-charcoal-800 transition-colors"
            title="Sign out"
          >
            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </button>
        </div>
      </div>
    </header>
  );
}
