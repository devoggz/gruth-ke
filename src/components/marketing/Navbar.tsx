"use client";
// src/components/marketing/Navbar.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("gt-theme") as "light" | "dark" | null;
    const preferred = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "dark"
      : "light";
    const initial = saved ?? preferred;
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("gt-theme", next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-charcoal-100 dark:hover:bg-charcoal-800 text-charcoal-600 hover:text-charcoal-900"
      style={{ color: "var(--text-secondary)" }}
    >
      {/* Sun */}
      <svg
        className={`absolute transition-all duration-300 ${theme === "dark" ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      {/* Moon */}
      <svg
        className={`absolute transition-all duration-300 ${theme === "light" ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </button>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    ["Services", "/services"],
    ["How It Works", "/how-it-works"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ] as const;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
      style={{
        background: scrolled ? "var(--bg-card)" : "var(--bg-card)",
        borderBottom: `1px solid var(--border)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-charcoal-950 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors duration-200">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="9" cy="9" r="2" fill="#f97316" />
              </svg>
            </div>
            <span
              className="font-display font-bold text-lg tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              GRUTH
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(([label, href]) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    active ? "text-orange-600" : ""
                  }`}
                  style={{
                    color: active ? undefined : "var(--text-secondary)",
                  }}
                >
                  <span className="relative">
                    {label}
                    {active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* CTAs + theme toggle */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />

            <Link
              href="/login"
              className="btn-primary text-sm py-2 px-5"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 py-4 space-y-1 border-t"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          {navLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: "var(--text-primary)" }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div
            className="pt-3 border-t space-y-2"
            style={{ borderColor: "var(--border)" }}
          >
            <Link
              href="/login"
              className="flex justify-center py-2.5 text-sm font-medium rounded-xl"
              style={{ color: "var(--text-secondary)" }}
            >
              Sign in
            </Link>
            <Link
              href="/request-verification"
              className="btn-primary text-sm justify-center w-full"
            >
              Request Verification
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
