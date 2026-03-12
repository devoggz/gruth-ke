"use client";
// src/components/marketing/Navbar.tsx

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import UserMenu from "@/components/shared/UserMenu";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const { data: session } = useSession();
  const user = session?.user as any;

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
            background: "var(--bg-card)",
            borderBottom: `1px solid var(--border)`,
          }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image src="/images/logo-t.svg" alt="logo" width={180} height={100} />
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

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center gap-3">

              {!session ? (
                  <Link
                      href="/login"
                      className="btn-primary text-sm py-2 px-5"
                  >
                    Sign In
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
              ) : (
                  <UserMenu
                      name={user?.name}
                      email={user?.email}
                      role={user?.role}
                  />
              )}

            </div>

            {/* Mobile right side */}
            <div className="md:hidden flex items-center gap-1">
              <button
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
              >
                {mobileOpen ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

                {!session ? (
                    <Link
                        href="/login"
                        className="btn-primary text-sm justify-center w-full"
                        onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                ) : (
                    <div className="pt-2">
                      <UserMenu
                          name={user?.name}
                          email={user?.email}
                          role={user?.role}
                      />
                    </div>
                )}

              </div>
            </div>
        )}
      </nav>
  );
}