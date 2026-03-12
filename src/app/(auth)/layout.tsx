// src/app/(auth)/layout.tsx
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col">
      <div className="flex items-center h-16 px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
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
          <span className="font-display font-semibold text-white text-base">
            GRUTH
          </span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        {children}
      </div>
    </div>
  );
}
